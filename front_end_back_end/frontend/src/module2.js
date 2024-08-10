import React, { useState, useEffect } from 'react';
import Sidebar from './side_bar';
import LineChart from './line.js';
import axios from 'axios';
import './module1.css';

const apiUrl = 'http://localhost:5000/api/module/comp2';
const org2 = '4bfc887b-0663-4652-a4fe-c512ecd3ef2b';


const Module2 = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tempData = await axios.get(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': org2,
          },
        });
        const testData = tempData.data;
        console.log(testData);
        console.log(typeof testData);
        setChartData({
          labels: testData.map((data) => Math.abs(data.Temperature)),
          datasets: [
            {
              label: 'Temperature of each car',
              data: testData.map((data) => Math.abs(data.ID)),
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
      <div className="chart-container no-scroll-required">
        <div className="chart">
          <LineChart chartData={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Module2;
