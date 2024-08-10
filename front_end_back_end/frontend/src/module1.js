import React, { useState, useEffect } from 'react';
import Sidebar from './side_bar';
import ScatterChart from './scatter.js';
import BarChart from './bar.js';
import axios from 'axios';
import './module1.css';
import { NavLink, Link } from 'react-router-dom';
import GraphComponent from './chart.js';
import Data from './data.js';
import LineChart from './line';


const apiUrl = 'http://localhost:5000/api/module/comp1';
const org1 = 'ccd650ea-b2ba-4c37-ad05-9b3474992d3d';



const Module1 = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: ' ',
        data: [],
        backgroundColor: [
          'rgba(255,255,255,1)',
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
      const tempData = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': org1,
        },
      });
      const testData = tempData.data;
      console.log(testData);
      console.log(typeof testData);
        setChartData({
          labels: testData.map((data) => Math.abs(data.Availability)),
          datasets: [
            {
              label: 'Vehicle Usage vs. Availability',
              data: testData.map((data) => data.Usage),
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

        
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []); 

return (
  <div id="mod" className="dashboard scroll-required">
    <Sidebar />
    <div className="chart-container">
      <div className="chart">
        <LineChart chartData={chartData} options={{ maintainAspectRation: false }} />
      </div>
    </div>
  
  </div>
);

};

export default Module1;
