## Table of Contents

- [Simulation Setup](#simulation-setup)
- [Hyperledger Blockchain Deployment](#hyperledger-blockchain-deployment)
- [Backend Code](#backend-code)
- [Frontend Code](#frontend-code)

---

## Simulation Setup

1. Create a simulation in Cooja, with one border router and multiple sensor nodes.
     ```bash
			sudo ant run
     ``` 

2. Tunslip6 Commands for border routers
    ```bash
		sudo ./tunslip6 -a 127.0.0.1 aaaa::1/64 -p 60020 -t tun0
		sudo ./tunslip6 -a 127.0.0.1 aaaa::1/64 -p 60002 -t tun1
		sudo ./tunslip6 -a 127.0.0.1 aaaa::1/64 -p 60003 -t tun2
		sudo ./tunslip6 -a 127.0.0.1 aaaa::1/64 -p 60004 -t tun3
		sudo ./tunslip6 -a 127.0.0.1 aaaa::1/64 -p 60005 -t tun4
    ```
    Make sure to change the port number based on the Serial Socket server port specified in the Cooja simulator for the border router.

3. Run the `server.js` files and wait for data to start generating

---

## Hyperledger Blockchain Deployment

4. Deploy the test network by navigating to the `fabric-samples/test-network` folder and running the following command:
    ```bash
    ./network.sh up createChannel -c mychannel -ca
    ```
    This creates a channel called `mychannel` on the Hyperledger blockchain.

5. Deploy the Org3 using `Org3.sh`:
    ```bash
    ./Org3.sh up
    ```
    This creates a new organization called `Org3` on the Hyperledger blockchain.

6. Deploy the Org3 using `Org4.sh`:
    ```bash
    ./Org4.sh up
    ```
    This creates a new organization called `Org4` on the Hyperledger blockchain.

7. Deploy the Org3 using `Org5.sh`:
    ```bash
    ./Org5.sh up
    ```
    This creates a new organization called `Org5` on the Hyperledger blockchain.

8. Deploy the chaincodes using the following command:
    ```bash
    ./network.sh deployCC -ccn easwar -ccp ../asset-transfer-basic/cc1-easwar/ -ccl node
	./network.sh deployCC -ccn nitin -ccp ../asset-transfer-basic/cc2-nitin/ -ccl node
	./network.sh deployCC -ccn rohit -ccp ../asset-transfer-basic/cc3-rohit/ -ccl node
	./network.sh deployCC -ccn dheeraj -ccp ../asset-transfer-basic/cc4-dheeraj/ -ccl node
	./network.sh deployCC -ccn farzan -ccp ../asset-transfer-basic/cc5-farzan/ -ccl node
    ```
9. Setting up Hyperledger Rest API[from rest-api-typescript directory]
```
		npm install
		npm run build
		TEST_NETWORK_HOME=$HOME/fabric-samples/test-network npm run generateEnv
		export REDIS_PASSWORD=$(uuidgen)
		npm run start:redis
		npm run start:dev
```
10. Setting up Hyperledger Blockchain Explorer[from explorer directory]
```
cp -r ../fabric-samples/test-network/organizations/ .
docker-compose up 
```
11. Now the blockchain is set up.

---

## Backend Code

12. Run the backend code in the `src` folder using:
    ```bash
    npm i && node index.js
    ```
    Install any missing dependencies using:
    ```bash
    npm i <packagename>
    ```

---

## Frontend Code

13. Run the frontend code in the `frontend` folder using:
    ```bash
    npm i && npm start
    ```

---
