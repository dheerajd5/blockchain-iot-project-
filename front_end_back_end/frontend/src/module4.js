import React, { useState, useEffect } from 'react';
import Sidebar from './side_bar';
import ScatterChart from './scatter.js';
import BarChart from './bar.js';
import axios from 'axios';
import './module1.css';
import LineChart from './line';

const apiUrl = 'http://localhost:5000/api/module/comp4';
const org4 = '2239567a-35e5-48bf-9853-e7fac6e16e13';


const Module4 = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: ' ',
        data: [],
        backgroundColor: [
          'rgba(75,192,192,1)',
          '#ecf0f1',
          '#50AF95',
          '#f3ba2f',
          '#2a71d0',
        ],
        borderColor: 'black',
        borderWidth: 2,
      },
    ],
  });

  const [otherData, setOtherData] = useState({
    labels: [],
    datasets: [
      {
        label: ' ',
        data: [],
        backgroundColor: [
          'rgba(75,192,192,1)',
          '#ecf0f1',
          '#50AF95',
          '#f3ba2f',
          '#2a71d0',
        ],
        borderColor: 'black',
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tempData = await axios.get(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': org4,
          },
        });
        const testData = tempData.data;
        console.log(testData);
        setChartData({
          labels: testData.map((data) => data.Coolant),
          
          datasets: [
            {
              label: 'Coolant vs Oil Pressure of vehicle',
              data: testData.map((data) => data.OilPressure),
              backgroundColor: [
                'rgba(75,192,192,1)',
                '#ecf0f1',
                '#50AF95',
                '#f3ba2f',
                '#2a71d0',
              ],
              borderColor: 'black',
              borderWidth: 2,
            },
          ]
        });

        setOtherData({
          labels: testData.map((data) => data.Fuel),
          
          datasets: [
            {
              label: 'Temperature vs Fuel of vehicle',
              data: testData.map((data) => data.Temperature),
              backgroundColor: [
                'rgba(75,192,192,1)',
                '#ecf0f1',
                '#50AF95',
                '#f3ba2f',
                '#2a71d0',
              ],
              borderColor: 'black',
              borderWidth: 2,
            },
          ]
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []); 

  return (
    <div id="mod" className="dashboard no-scroll-required">
      <Sidebar />
      <div className="chart-container">
        <div className="chart">
          <BarChart chartData={chartData} text='Oil Pressure vs Coolant' />
        </div>
        <div className="chart">
          <LineChart chartData={otherData} text='Temperature vs Fuel' />
        </div>
      </div>

     
    </div>
  );
};

export default Module4;
