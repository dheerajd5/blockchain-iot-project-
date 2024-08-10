#!/usr/bin/env bash

#
# SPDX-License-Identifier: Apache-2.0
#

${AS_LOCAL_HOST:=true}

: "${TEST_NETWORK_HOME:=../..}"
: "${CONNECTION_PROFILE_FILE_ORG1:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org1.example.com/connection-org1.json}"
: "${CERTIFICATE_FILE_ORG1:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/User1@org1.example.com-cert.pem}"
: "${PRIVATE_KEY_FILE_ORG1:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/priv_sk}"

: "${CONNECTION_PROFILE_FILE_ORG2:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org2.example.com/connection-org2.json}"
: "${CERTIFICATE_FILE_ORG2:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/signcerts/User1@org2.example.com-cert.pem}"
: "${PRIVATE_KEY_FILE_ORG2:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/keystore/priv_sk}"

: "${CONNECTION_PROFILE_FILE_ORG3:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org3.example.com/connection-org3.json}"
: "${CERTIFICATE_FILE_ORG3:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org3.example.com/users/User1@org3.example.com/msp/signcerts/User1@org3.example.com-cert.pem}"
: "${PRIVATE_KEY_FILE_ORG3:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org3.example.com/users/User1@org3.example.com/msp/keystore/priv_sk}"

: "${CONNECTION_PROFILE_FILE_ORG4:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org4.example.com/connection-org4.json}"
: "${CERTIFICATE_FILE_ORG4:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org4.example.com/users/User1@org4.example.com/msp/signcerts/User1@org4.example.com-cert.pem}"
: "${PRIVATE_KEY_FILE_ORG4:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org4.example.com/users/User1@org4.example.com/msp/keystore/priv_sk}"

: "${CONNECTION_PROFILE_FILE_ORG5:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org5.example.com/connection-org5.json}"
: "${CERTIFICATE_FILE_ORG5:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org5.example.com/users/User1@org5.example.com/msp/signcerts/User1@org5.example.com-cert.pem}"
: "${PRIVATE_KEY_FILE_ORG5:=${TEST_NETWORK_HOME}/organizations/peerOrganizations/org5.example.com/users/User1@org5.example.com/msp/keystore/priv_sk}"




cat << ENV_END > .env
# Generated .env file
# See src/config.ts for details of all the available configuration variables
#

LOG_LEVEL=info

PORT=3000

HLF_CERTIFICATE_ORG1="$(cat ${CERTIFICATE_FILE_ORG1} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_PRIVATE_KEY_ORG1="$(cat ${PRIVATE_KEY_FILE_ORG1} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_CERTIFICATE_ORG2="$(cat ${CERTIFICATE_FILE_ORG2} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_PRIVATE_KEY_ORG2="$(cat ${PRIVATE_KEY_FILE_ORG2} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_CERTIFICATE_ORG3="$(cat ${CERTIFICATE_FILE_ORG3} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_PRIVATE_KEY_ORG3="$(cat ${PRIVATE_KEY_FILE_ORG3} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_CERTIFICATE_ORG4="$(cat ${CERTIFICATE_FILE_ORG4} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_PRIVATE_KEY_ORG4="$(cat ${PRIVATE_KEY_FILE_ORG4} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_CERTIFICATE_ORG5="$(cat ${CERTIFICATE_FILE_ORG5} | sed -e 's/$/\\n/' | tr -d '\r\n')"

HLF_PRIVATE_KEY_ORG5="$(cat ${PRIVATE_KEY_FILE_ORG5} | sed -e 's/$/\\n/' | tr -d '\r\n')"

REDIS_PORT=6379

ORG1_APIKEY=$(uuidgen)

ORG2_APIKEY=$(uuidgen)

ORG3_APIKEY=$(uuidgen)

ORG4_APIKEY=$(uuidgen)

ORG5_APIKEY=$(uuidgen)


ENV_END
 
if [ "${AS_LOCAL_HOST}" = "true" ]; then

cat << LOCAL_HOST_END >> .env
AS_LOCAL_HOST=true

HLF_CONNECTION_PROFILE_ORG1=$(cat ${CONNECTION_PROFILE_FILE_ORG1} | jq -c .)

HLF_CONNECTION_PROFILE_ORG2=$(cat ${CONNECTION_PROFILE_FILE_ORG2} | jq -c .)

HLF_CONNECTION_PROFILE_ORG3=$(cat ${CONNECTION_PROFILE_FILE_ORG3} | jq -c .)

HLF_CONNECTION_PROFILE_ORG4=$(cat ${CONNECTION_PROFILE_FILE_ORG4} | jq -c .)

HLF_CONNECTION_PROFILE_ORG5=$(cat ${CONNECTION_PROFILE_FILE_ORG5} | jq -c .)

REDIS_HOST=localhost

LOCAL_HOST_END

elif [ "${AS_LOCAL_HOST}" = "false" ]; then

cat << WITH_HOSTNAME_END >> .env
AS_LOCAL_HOST=false

HLF_CONNECTION_PROFILE_ORG1=$(cat ${CONNECTION_PROFILE_FILE_ORG1} | jq -c '.peers["peer0.org1.example.com"].url = "grpcs://peer0.org1.example.com:7051" | .certificateAuthorities["ca.org1.example.com"].url = "https://ca.org1.example.com:7055"')

HLF_CONNECTION_PROFILE_ORG2=$(cat ${CONNECTION_PROFILE_FILE_ORG2} | jq -c '.peers["peer0.org2.example.com"].url = "grpcs://peer0.org2.example.com:9051" | .certificateAuthorities["ca.org2.example.com"].url = "https://ca.org2.example.com:8055"')


REDIS_HOST=redis

WITH_HOSTNAME_END

fi
