# IoT Device Simulation and Blockchain Integration for Secure Data Management
## Objective:
The project aims to simulate a network of IoT devices using **Contiki-NG**, visualize their mobility and interactions with **Cooja**, and securely store the generated data on a local blockchain built with **IBM Hyperledger**. The data will be transmitted via a border router using **JavaScript** and displayed on a **React-based front-end**.

## Components:
### 1. Contiki-NG for IoT Simulation:
Utilized Contiki-NG to simulate readings and data generation from various IoT devices.
Devices could include sensors for environmental data (e.g., temperature, humidity) or any custom data relevant to the project.
Ensured the simulation mimics real-world conditions for data accuracy.

### 2. Cooja for Mobility Simulation:
Integrated Cooja to simulate the mobility of IoT devices within a network.
Used Cooja’s visualization tools to track device movement and interaction in a virtual environment.
Adjusted mobility patterns to reflect realistic IoT device deployment scenarios (e.g., smart cities, industrial IoT).

### 3. JavaScript for Data Transmission:
Developed a JavaScript application to manage the transmission of simulated data from IoT devices to the border router.
The border router will act as a gateway, forwarding data packets to the local blockchain.

### 4. IBM Hyperledger Blockchain:
Set up a local blockchain using IBM Hyperledger to securely store the data transmitted from IoT devices.
Implemented smart contracts within Hyperledger to validate and manage data storage transactions.
Ensured data integrity and security through blockchain's immutable ledger features.

### 5. React Front-End:
Created a responsive web interface using React to visualize the stored IoT data.
Pulled data from the blockchain and displayed it in a user-friendly format (e.g., charts, tables, real-time updates).
Include features for data analysis, filtering, and reporting.
