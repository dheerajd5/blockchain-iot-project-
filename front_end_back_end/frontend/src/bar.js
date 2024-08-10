import { Bar,Pie,Scatter } from "react-chartjs-2";
 const BarChart = ({ chartData , text}) => {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Bar</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: text,
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

export default BarChart;