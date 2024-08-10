import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const GraphComponent = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Function to fetch JSON data and create the chart
    const fetchDataAndCreateChart = async () => {
      try {
        const response = await fetch('data.json');
        console.log('Response:', response); 
        const data = await response.json();

        const labels = data.map(entry => entry.label);
        const values = data.map(entry => entry.value);

        const ctx = chartRef.current.getContext('2d');

        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Your Graph Title',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } catch (error) {
        console.error('Error fetching or parsing data', error);
      }
    };

    fetchDataAndCreateChart();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return <canvas ref={chartRef} width="400" height="200" />;
};

export default GraphComponent;
