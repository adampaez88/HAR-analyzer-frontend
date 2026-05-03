type Props = {
  data: any[];
};

function MissingRequestsTable({ data }: Props) {
  return (
    <div style={{ marginTop: 30 }}>
      <h2>Missing Requests</h2>

      <div style={{ display: "grid", gap: 12 }}>
        {data.map((item, i) => (
          <div
            key={i}
            style={{
              background: "#1e293b",
              padding: 15,
              borderRadius: 10,
              border: "1px solid #334155"
            }}
          >
            <strong>{item.key}</strong>

            <p>File1: {item.file1Count}</p>
            <p>File2: {item.file2Count}</p>
            <p>Difference: {item.difference}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MissingRequestsTable;