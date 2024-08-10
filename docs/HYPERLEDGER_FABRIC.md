# Environment
We've created 5 organizations to stimulate 5 different entities that want their data to be stored on the blockchain. In our case the 5 organizations are `dheeraj,farzan,rohit,easwar,nitin` their respective pairs include vehicle tracking, fuel and energy efficieny stats and so on.

They all communicate using the channel `my-channel`

Each of these organizations sign up to the blockchain with the scripts written and are given an API key, with which verification is done when they attempt to pull the data from the blockchain with the help of the REST API.
Each of these organizations have only one peer, that is incharge of written org-specific transactions into blocks and attaching it to the decentralized blockchain.

Each of the chaincodes are only able to create new records and fetch them.

Each of the respective chaincodes contains the logic only for it's organizations sensor data, i.e dheeraj's chaincode only contains the code to recieve and check for the [dheeraj-module-sensor.c](https://github.com/dheerajd5/blockchain-iot-project-/blob/main/cooja_sourcecodes/border_routers_code/dheeraj-module-sensor.c)
data.

# Details about the peers(Localhost endpoints)

Org1 - peer endpoint on port **7051**

Org2 - peer endpoint on port **9051**

Org3 - peer endpoint on port **11051**

Org4 - peer endpoint on port **12051**

Org5 - peer endpoint on port **13051**
