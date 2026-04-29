type ExportButtonsProps = {
  exportJson: () => void;
  exportCsv: () => void;
};

function ExportButtons({
  exportJson,
  exportCsv,
}: ExportButtonsProps) {
  const buttonStyle = {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "25px",
      }}
    >
      <button
        onClick={exportJson}
        style={{
          ...buttonStyle,
          background: "#2563eb",
        }}
      >
        Export JSON
      </button>

      <button
        onClick={exportCsv}
        style={{
          ...buttonStyle,
          background: "#16a34a",
        }}
      >
        Export CSV
      </button>
    </div>
  );
}

export default ExportButtons;