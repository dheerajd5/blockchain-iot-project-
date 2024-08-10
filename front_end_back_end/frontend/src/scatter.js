import { Bar,Pie,Scatter } from "react-chartjs-2";
 const ScatterChart = ({ chartData }) => {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Location</h2>
      <Scatter
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Vehicle coordinates"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
};

export default ScatterChart;