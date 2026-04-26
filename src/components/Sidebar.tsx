function Sidebar() {
  return (
    <div
      style={{
        width: "240px",
        background: "#111827",
        padding: "30px 20px",
        borderRight: "1px solid #1e293b",
      }}
    >
      <h2>HAR Analyzer</h2>

      <p style={{ color: "#94a3b8" }}>
        Network Debug Dashboard
      </p>

      <hr
        style={{
          borderColor: "#1e293b",
          margin: "25px 0",
        }}
      />

      <p>📁 Upload</p>
      <p>📊 Charts</p>
      <p>🔥 Worst Endpoints</p>
      <p>🔍 Mismatches</p>
      <p>📤 Export</p>
    </div>
  );
}

export default Sidebar;