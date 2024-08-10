import React, { useState, useEffect } from 'react';
import Sidebar from './side_bar';
import ScatterChart from './scatter.js';
import BarChart from './bar.js';
import axios from 'axios';
import './module1.css';
const apiUrl = 'http://localhost:5000/api/module/comp5';
const org5 = 'd163123d-5e7e-4ec6-972c-a9a7620c789b';

const Module1 = () => {
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
            'X-Api-Key': org5,
          },
        });
        const testData = tempData.data;
        console.log(testData);
        console.log(typeof testData);
        setChartData({
          labels: testData.map((data) => data.Xco),
          datasets: [
            {
              label: 'Usage of vehicle vs Temperature',
              data: testData.map((data) => data.Yco),
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
          <BarChart chartData={chartData} />
        </div>
      </div>

    
    </div>
  );
};

export default Module1;
