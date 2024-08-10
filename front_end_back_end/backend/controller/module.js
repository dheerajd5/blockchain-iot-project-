const dotenv = require("dotenv") 


const org1 = '8554358f-2152-42c2-a892-f48a85608504';
const org2 = 'be5a36c8-93d2-4e72-9d63-cb032d43c560';
const org3 = '223cf615-d311-4289-acf4-3fd3417abe77';
const org4 = '1aca5370-ee55-4519-99b7-fe693164e515';
const org5 = '0239a1f3-c55d-44b3-b9a0-9635ed8edef0';
const uri = 'http://localhost:3000/api/assets';

dotenv.config({
    path: "config.env",
  });


  exports.getComp1 = async (req, res) => {
    try {// Replace with your actual API key
  
      const response = await fetch(uri, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': org1,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
      // Handle the response data as needed
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getComp2 = async (req, res) => {
    try {// Replace with your actual API key
  
      const response = await fetch(uri, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': org2,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
      // Handle the response data as needed
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getComp3 = async (req, res) => {
    try {// Replace with your actual API key
  
      const response = await fetch(uri, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': org3,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
      // Handle the response data as needed
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getComp4 = async (req, res) => {
    try {// Replace with your actual API key
  
      const response = await fetch(uri, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': org4,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
      // Handle the response data as needed
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getComp5 = async (req, res) => {
    try {// Replace with your actual API key
  
      const response = await fetch(uri, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': org5,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
      // Handle the response data as needed
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };