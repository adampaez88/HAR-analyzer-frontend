type Props = {
  data: any;
};

function JsonViewer({ data }: Props) {
  if (data === undefined || data === null) {
    return <span style={{ color: "#64748b" }}>—</span>;
  }

  if (typeof data === "string" || typeof data === "number") {
    return <span>{String(data)}</span>;
  }

  return (
    <pre
      style={{
        margin: 0,
        fontSize: "12px",
        background: "#0f172a",
        padding: "6px",
        borderRadius: "6px",
        border: "1px solid #334155",
        overflowX: "auto",
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default JsonViewer;