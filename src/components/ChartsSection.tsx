import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type ChartsSectionProps = {
  requestChartData: any[];
  failureChartData: any[];
};

function ChartsSection({
  requestChartData,
  failureChartData,
}: ChartsSectionProps) {
  const cardStyle = {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 0 0 1px #334155",
  };

  return (
    <>
      <h2
        style={{
          marginTop: "35px",
        }}
      >
        Visualizations
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* Requests Chart */}
        <div style={cardStyle}>
          <h3>Request Totals</h3>

          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <BarChart
              data={requestChartData}
            >
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Failure Chart */}
        <div style={cardStyle}>
          <h3>Failure Rates</h3>

          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <BarChart
              data={failureChartData}
            >
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rate" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

export default ChartsSection;