import { Bar,Pie,Line,Scatter } from "react-chartjs-2";
 const LineChart = ({ chartData ,text }) => {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Line</h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: text
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

export default LineChart;