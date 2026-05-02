import { colors } from "../styles/theme";

function Sidebar() {
  return (
    <div
      style={{
        width: "240px",
        background: colors.panel,
        padding: "30px 20px",
        borderRight: `1px solid ${colors.border}`,
      }}
    >
      <h2>HAR Analyzer</h2>

      <p style={{ color: colors.muted }}>
        Diff-Based Network Debugging
      </p>

      <hr
        style={{
          borderColor: colors.border,
          margin: "25px 0",
        }}
      />

      <p>📁 Upload Files</p>
      <p>📊 Summary</p>
      <p>🧩 Missing Requests</p>
      <p>🔍 Modified Requests</p>
      <p>📤 Export</p>
    </div>
  );
}

export default Sidebar;