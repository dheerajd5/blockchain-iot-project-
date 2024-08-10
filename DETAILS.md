# 1. Contiki-NG Cooja
All sensor files are written in C, they all just output random values for their respective sensors, for ex. speed will be random within a range of 0-80.
Mobility is introduced separately using a Cooja mobility plugin which takes in .dat files for the exact details of the movement for each node.
## Sensor Network Diagram
![Sensor Node Network Diagram](https://github.com/user-attachments/assets/65998828-d9b8-4f78-a245-001719a3c9d1)


# 2. Border Routers
There are 5 border routers, one for each organization. They are written in javascript and basically act as way to send data to the blockchain, they collect their org specific data and then package it and send it up to the hyperledger fabric rest api.

# 3. IBM Hyperledger Blockchain
## Environment
We've created 5 organizations to stimulate 5 different entities that want their data to be stored on the blockchain. In our case the 5 organizations are `dheeraj,farzan,rohit,easwar,nitin` their respective pairs include vehicle tracking, fuel and energy efficieny stats and so on.

They all communicate using the channel `my-channel`

Each of these organizations sign up to the blockchain with the scripts written and are given an API key, with which verification is done when they attempt to pull the data from the blockchain with the help of the REST API.
Each of these organizations have only one peer, that is incharge of written org-specific transactions into blocks and attaching it to the decentralized blockchain.

Each of the chaincodes are only able to create new records and fetch them.

Each of the respective chaincodes contains the logic only for it's organizations sensor data, i.e dheeraj's chaincode only contains the code to recieve and check for the [dheeraj-module-sensor.c](https://github.com/dheerajd5/blockchain-iot-project-/blob/main/cooja_sourcecodes/border_routers_code/dheeraj-module-sensor.c)
data.

## Details about the peers(Localhost endpoints)

Org1 - peer endpoint on port **7051**

Org2 - peer endpoint on port **9051**

Org3 - peer endpoint on port **11051**

Org4 - peer endpoint on port **12051**

Org5 - peer endpoint on port **13051**

## Hyperledger Explorer

This is a dashboard tool to see and visualize the blockchain in a more clear way, it helps us to see exactly how many peers are up and how many orgs are there, we can also check different information such as the block transactions and the blockchain itself.
