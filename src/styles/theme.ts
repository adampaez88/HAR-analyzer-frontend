export const cardStyle = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "14px",
  boxShadow:
    "0 0 0 1px #334155",
};

export const tableStyle = {
  width: "100%",
  borderCollapse:
    "collapse" as const,
  background: "#1e293b",
  borderRadius: "14px",
  overflow: "hidden",
};

export const thtd = {
  padding: "14px",
  borderBottom:
    "1px solid #334155",
  textAlign:
    "left" as const,
};

export const uploadBox = (
  active: boolean
) => ({
  border: active
    ? "2px dashed #3b82f6"
    : "2px dashed #334155",
  borderRadius: "14px",
  padding: "22px",
  width: "280px",
  background: active
    ? "#172554"
    : "#0f172a",
  cursor: "pointer",
  transition:
    "all 0.2s ease",
});