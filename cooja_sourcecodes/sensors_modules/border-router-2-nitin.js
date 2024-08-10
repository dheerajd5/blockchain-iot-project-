'use strict';
let portIPv6 = 8843;
let hostIPv6 = 'aaaa::1';
let dgram = require('dgram');
let serverUDP = dgram.createSocket('udp6');
let disableLogs = false;


serverUDP.on('listening', function() {
    var address = serverUDP.address();
    console.log('[UDP - IPV6] Active IPv6 server addr.:' + address.address + ":" + address.port);
});

serverUDP.on('message', processMessage);

serverUDP.bind(portIPv6, hostIPv6);

const SAMPLE_APIKEY = 'be5a36c8-93d2-4e72-9d63-cb032d43c560'; //For Org 2 


const headers = {
  'Content-Type': 'application/json',
  'X-Api-Key': SAMPLE_APIKEY,
};

const dbheaders = {
  'Content-Type': 'application/json',
};



function processMessage(message, remote) {
    if (!disableLogs)
        console.log('[UDP - IPv6] ' + new Date().toISOString() + ' ' + remote.address + ' Port:' + remote.port + ' - ' + message);

        let dataArray = message.toString().split('|');
        
    
    let data = dataArray[0];
    console.log("Sending to HyperLedger");
// Split the input string into an array of key-value pairs
    const keyValuePairs = data.split(',');

    // Initialize an empty object to store the data
    const dataBlock = {};
    dataBlock["rid"] = Date.now().toString();
    // Iterate through the key-value pairs
    keyValuePairs.forEach(pair => {
      let [key, value] = pair.split(':');
      if(key == "availability" || key == "id")
        dataBlock[key] = value;
      else{
        value = parseInt(value,10);
        if(value <0){
          dataBlock[key] = value*-1;
        }else
        dataBlock[key] =value;
      }
    });
    console.log(dataBlock);
    
    try{
      fetch('http://localhost:3000/api/assets', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(dataBlock),
      })
        .then(response => response.json())
        .then(data => console.log('Response:', data))
        .catch(error => console.error('Error:', error));

    }catch(error){
      console.log("Data is sent to Hyper Ledger.");
    }
    // console.log()
    // try{
      // fetch('http://localhost:5000/api/module/add/comp3', {
      //   method: 'POST',
      //   headers:dbheaders,
      //   body: JSON.stringify(dataBlock),
      // })
    //     .then(response => response.json())
    //     .then(data => console.log('Response:', data))
    //     .catch(error => console.error('Error:', error));

    // }catch(error){
    //   console.log("Data is sent to MongoDB.");
    // }
    // try{
    //   fetch('http://localhost:3000/api/assets', {
    //     method: 'POST',
    //     headers: headers,
    //     body: JSON.stringify(dataBlock),
    //   })
    //     .then(response => response.json())
    //     .then(data => console.log('Response:', data))
    //     .catch(error => console.error('Error:', error));

    // }catch(error){
    //   console.log("Data is sent to Hyper Ledger.");
    // }
}
