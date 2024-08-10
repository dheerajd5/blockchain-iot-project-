#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This script extends the Hyperledger Fabric test network by adding
# adding a third organization to the network
#

# prepending $PWD/../bin to PATH to ensure we are picking up the correct binaries
# this may be commented out to resolve installed version of tools if desired
export PATH=${PWD}/../../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
export VERBOSE=false

. ../scripts/utils.sh

: ${CONTAINER_CLI:="docker"}
: ${CONTAINER_CLI_COMPOSE:="${CONTAINER_CLI}-compose"}
infoln "Using ${CONTAINER_CLI} and ${CONTAINER_CLI_COMPOSE}"


# Print the usage message
function printHelp () {
  echo "Usage: "
  echo "  addOrg5.sh up|down|generate [-c <channel name>] [-t <timeout>] [-d <delay>] [-f <docker-compose-file>] [-s <dbtype>]"
  echo "  addOrg5.sh -h|--help (print this message)"
  echo "    <mode> - one of 'up', 'down', or 'generate'"
  echo "      - 'up' - add org5 to the sample network. You need to bring up the test network and create a channel first."
  echo "      - 'down' - bring down the test network and org5 nodes"
  echo "      - 'generate' - generate required certificates and org definition"
  echo "    -c <channel name> - test network channel name (defaults to \"mychannel\")"
  echo "    -ca <use CA> -  Use a CA to generate the crypto material"
  echo "    -t <timeout> - CLI timeout duration in seconds (defaults to 10)"
  echo "    -d <delay> - delay duration in seconds (defaults to 5)"
  echo "    -s <dbtype> - the database backend to use: goleveldb (default) or couchdb"
  echo "    -verbose - verbose mode"
  echo
  echo "Typically, one would first generate the required certificates and "
  echo "genesis block, then bring up the network. e.g.:"
  echo
  echo "	addOrg5.sh generate"
  echo "	addOrg5.sh up"
  echo "	addOrg5.sh up -c mychannel -s couchdb"
  echo "	addOrg5.sh down"
  echo
  echo "Taking all defaults:"
  echo "	addOrg5.sh up"
  echo "	addOrg5.sh down"
}

# We use the cryptogen tool to generate the cryptographic material
# (x509 certs) for the new org.  After we run the tool, the certs will
# be put in the organizations folder with org1 and org2

# Create Organziation crypto material using cryptogen or CAs
function generateOrg5() {
  # Create crypto material using cryptogen
  if [ "$CRYPTO" == "cryptogen" ]; then
    which cryptogen
    if [ "$?" -ne 0 ]; then
      fatalln "cryptogen tool not found. exiting"
    fi
    infoln "Generating certificates using cryptogen tool"

    infoln "Creating Org5 Identities"

    set -x
    cryptogen generate --config=org5-crypto.yaml --output="../organizations"
    res=$?
    { set +x; } 2>/dev/null
    if [ $res -ne 0 ]; then
      fatalln "Failed to generate certificates..."
    fi

  fi

  # Create crypto material using Fabric CA
  if [ "$CRYPTO" == "Certificate Authorities" ]; then
    fabric-ca-client version > /dev/null 2>&1
    if [[ $? -ne 0 ]]; then
      echo "ERROR! fabric-ca-client binary not found.."
      echo
      echo "Follow the instructions in the Fabric docs to install the Fabric Binaries:"
      echo "https://hyperledger-fabric.readthedocs.io/en/latest/install.html"
      exit 1
    fi

    infoln "Generating certificates using Fabric CA"
    ${CONTAINER_CLI_COMPOSE} -f ${COMPOSE_FILE_CA_BASE} -f $COMPOSE_FILE_CA_ORG5 up -d 2>&1

    . fabric-ca/registerEnroll.sh

    sleep 10

    infoln "Creating Org5 Identities"
    createOrg5

  fi

  infoln "Generating CCP files for Org5"
  ./ccp-generate.sh
}

# Generate channel configuration transaction
function generateOrg5Definition() {
  which configtxgen
  if [ "$?" -ne 0 ]; then
    fatalln "configtxgen tool not found. exiting"
  fi
  infoln "Generating Org5 organization definition"
  export FABRIC_CFG_PATH=$PWD
  set -x
  configtxgen -printOrg Org5MSP > ../organizations/peerOrganizations/org5.example.com/org5.json
  res=$?
  { set +x; } 2>/dev/null
  if [ $res -ne 0 ]; then
    fatalln "Failed to generate Org5 organization definition..."
  fi
}

function Org5Up () {
  # start org5 nodes

  if [ "$CONTAINER_CLI" == "podman" ]; then
    cp ../podman/core.yaml ../../organizations/peerOrganizations/org5.example.com/peers/peer0.org5.example.com/
  fi

  if [ "${DATABASE}" == "couchdb" ]; then
    DOCKER_SOCK=${DOCKER_SOCK} ${CONTAINER_CLI_COMPOSE} -f ${COMPOSE_FILE_BASE} -f $COMPOSE_FILE_ORG5 -f ${COMPOSE_FILE_COUCH_BASE} -f $COMPOSE_FILE_COUCH_ORG5 up -d 2>&1
  else
    DOCKER_SOCK=${DOCKER_SOCK} ${CONTAINER_CLI_COMPOSE} -f ${COMPOSE_FILE_BASE} -f $COMPOSE_FILE_ORG5 up -d 2>&1
  fi
  if [ $? -ne 0 ]; then
    fatalln "ERROR !!!! Unable to start Org5 network"
  fi
}

# Generate the needed certificates, the genesis block and start the network.
function addOrg5 () {
  # If the test network is not up, abort
  if [ ! -d ../organizations/ordererOrganizations ]; then
    fatalln "ERROR: Please, run ./network.sh up createChannel first."
  fi

  # generate artifacts if they don't exist
  if [ ! -d "../organizations/peerOrganizations/org5.example.com" ]; then
    generateOrg5
    generateOrg5Definition
  fi

  infoln "Bringing up Org5 peer"
  Org5Up

  export PATH=${PWD}/../bin:$PATH
  export FABRIC_CFG_PATH=${PWD}/../../config/
  export CORE_PEER_TLS_ENABLED=true
  export CORE_PEER_LOCALMSPID=Org1MSP
  export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/../organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
  export CORE_PEER_MSPCONFIGPATH=${PWD}/../organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
  export CORE_PEER_ADDRESS=localhost:7051

  peer channel fetch config ../channel-artifacts/config_block.pb -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com -c mychannel --tls --cafile "${PWD}/../organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

  configtxlator proto_decode --input ../channel-artifacts/config_block.pb --type common.Block --output ../channel-artifacts/config_block.json

  jq ".data.data[0].payload.data.config" ../channel-artifacts/config_block.json > ../channel-artifacts/config.json

  jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"Org5MSP":.[1]}}}}}' ../channel-artifacts/config.json ../organizations/peerOrganizations/org5.example.com/org5.json > ../channel-artifacts/modified_config.json
# infoln "Joined half"
  configtxlator proto_encode --input ../channel-artifacts/config.json --type common.Config --output ../channel-artifacts/config.pb

  configtxlator proto_encode --input ../channel-artifacts/modified_config.json --type common.Config --output ../channel-artifacts/modified_config.pb

  configtxlator compute_update --channel_id mychannel --original ../channel-artifacts/config.pb --updated ../channel-artifacts/modified_config.pb --output ../channel-artifacts/org5_update.pb

  configtxlator proto_decode --input ../channel-artifacts/org5_update.pb --type common.ConfigUpdate --output ../channel-artifacts/org5_update.json

  echo '{"payload":{"header":{"channel_header":{"channel_id":"'mychannel'", "type":2}},"data":{"config_update":'$(cat ../channel-artifacts/org5_update.json)'}}}' | jq . > ../channel-artifacts/org5_update_in_envelope.json

  configtxlator proto_encode --input ../channel-artifacts/org5_update_in_envelope.json --type common.Envelope --output ../channel-artifacts/org5_update_in_envelope.pb

  peer channel signconfigtx -f ../channel-artifacts/org5_update_in_envelope.pb

  export CORE_PEER_TLS_ENABLED=true
  export CORE_PEER_LOCALMSPID=Org2MSP
  export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/../organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
  export CORE_PEER_MSPCONFIGPATH=${PWD}/../organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
  export CORE_PEER_ADDRESS=localhost:9051

  peer channel signconfigtx -f ../channel-artifacts/org5_update_in_envelope.pb

  export CORE_PEER_TLS_ENABLED=true
  export CORE_PEER_LOCALMSPID=Org3MSP
  export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/../organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
  export CORE_PEER_MSPCONFIGPATH=${PWD}/../organizations/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
  export CORE_PEER_ADDRESS=localhost:11051

  peer channel update -f ../channel-artifacts/org5_update_in_envelope.pb -c mychannel -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/../organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"


  infoln "Joined Org1,Org2,Org3 endorse Org5"

  export CORE_PEER_TLS_ENABLED=true
  export CORE_PEER_LOCALMSPID=Org5MSP
  export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/../organizations/peerOrganizations/org5.example.com/peers/peer0.org5.example.com/tls/ca.crt
  export CORE_PEER_MSPCONFIGPATH=${PWD}/../organizations/peerOrganizations/org5.example.com/users/Admin@org5.example.com/msp
  export CORE_PEER_ADDRESS=localhost:13051


  local rc=1
  local COUNTER=1

  
  while [ $rc -ne 0 -a $COUNTER -lt 3 ] ; do
    sleep 3
    set -x
    peer channel fetch 0 ../channel-artifacts/mychannel1.block -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com -c mychannel --tls --cafile "${PWD}/../organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
    res=$?
    { set +x; } 2>/dev/null
    let rc=$res
    COUNTER=$(expr $COUNTER + 1)
	done
  

  local rc=1
  local COUNTER=1
  
  while [ $rc -ne 0 -a $COUNTER -lt 3 ] ; do
    sleep 3
    set -x
    peer channel join -b ../channel-artifacts/mychannel1.block
    res=$?
    { set +x; } 2>/dev/null
    let rc=$res
    COUNTER=$(expr $COUNTER + 1)
	done

  infoln "Joined Org5 peer"

  # # Use the CLI container to create the configuration transaction needed to add
  # # Org5 to the network
  # infoln "Generating and submitting config tx to add Org5"
  # ${CONTAINER_CLI} exec cli ./scripts/org5-scripts/updateChannelConfig.sh $CHANNEL_NAME $CLI_DELAY $CLI_TIMEOUT $VERBOSE
  # if [ $? -ne 0 ]; then
  #   fatalln "ERROR !!!! Unable to create config tx"
  # fi

  # infoln "Joining Org5 peers to network"
  # ${CONTAINER_CLI} exec cli ./scripts/org5-scripts/joinChannel.sh $CHANNEL_NAME $CLI_DELAY $CLI_TIMEOUT $VERBOSE
  # if [ $? -ne 0 ]; then
  #   fatalln "ERROR !!!! Unable to join Org5 peers to network"
  # fi
}

# Tear down running network
function networkDown () {
    cd ..
    ./network.sh down
}

# Using crpto vs CA. default is cryptogen
CRYPTO="cryptogen"
# timeout duration - the duration the CLI should wait for a response from
# another container before giving up
CLI_TIMEOUT=10
#default for delay
CLI_DELAY=3
# channel name defaults to "mychannel"
CHANNEL_NAME="mychannel"
# use this as the docker compose couch file
COMPOSE_FILE_COUCH_BASE=compose/compose-couch-org5.yaml
COMPOSE_FILE_COUCH_ORG5=compose/${CONTAINER_CLI}/docker-compose-couch-org5.yaml
# use this as the default docker-compose yaml definition
COMPOSE_FILE_BASE=compose/compose-org5.yaml
COMPOSE_FILE_ORG5=compose/${CONTAINER_CLI}/docker-compose-org5.yaml
# certificate authorities compose file
COMPOSE_FILE_CA_BASE=compose/compose-ca-org5.yaml
COMPOSE_FILE_CA_ORG5=compose/${CONTAINER_CLI}/docker-compose-ca-org5.yaml
# database
DATABASE="leveldb"

# Get docker sock path from environment variable
SOCK="${DOCKER_HOST:-/var/run/docker.sock}"
DOCKER_SOCK="${SOCK##unix://}"

# Parse commandline args

## Parse mode
if [[ $# -lt 1 ]] ; then
  printHelp
  exit 0
else
  MODE=$1
  shift
fi

# parse flags

while [[ $# -ge 1 ]] ; do
  key="$1"
  case $key in
  -h )
    printHelp
    exit 0
    ;;
  -c )
    CHANNEL_NAME="$2"
    shift
    ;;
  -ca )
    CRYPTO="Certificate Authorities"
    ;;
  -t )
    CLI_TIMEOUT="$2"
    shift
    ;;
  -d )
    CLI_DELAY="$2"
    shift
    ;;
  -s )
    DATABASE="$2"
    shift
    ;;
  -verbose )
    VERBOSE=true
    ;;
  * )
    errorln "Unknown flag: $key"
    printHelp
    exit 1
    ;;
  esac
  shift
done


# Determine whether starting, stopping, restarting or generating for announce
if [ "$MODE" == "up" ]; then
  infoln "Adding org5 to channel '${CHANNEL_NAME}' with '${CLI_TIMEOUT}' seconds and CLI delay of '${CLI_DELAY}' seconds and using database '${DATABASE}'"
  echo
elif [ "$MODE" == "down" ]; then
  EXPMODE="Stopping network"
elif [ "$MODE" == "generate" ]; then
  EXPMODE="Generating certs and organization definition for Org5"
else
  printHelp
  exit 1
fi

#Create the network using docker compose
if [ "${MODE}" == "up" ]; then
  addOrg5
elif [ "${MODE}" == "down" ]; then ## Clear the network
  networkDown
elif [ "${MODE}" == "generate" ]; then ## Generate Artifacts
  generateOrg5
  generateOrg5Definition
else
  printHelp
  exit 1
fi
