import type { NormalizedModifiedRequest } from "../adapters/diffAdapter";

type Props = {
  data: NormalizedModifiedRequest[];
  setSelectedEndpoint: (item: NormalizedModifiedRequest) => void;
};

function ModifiedRequestsTable({
  data,
  setSelectedEndpoint,
}: Props) {
  return (
    <div style={{ marginTop: 30 }}>
      <h2>Modified Requests</h2>

      <div style={{ display: "grid", gap: 12 }}>
        {data.map((item, i) => (
          <div
            key={i}
            onClick={() => setSelectedEndpoint(item)}
            style={{
              background: "#1e293b",
              padding: 15,
              borderRadius: 10,
              cursor: "pointer",
              border: "1px solid #334155",
            }}
          >
            <strong>{item.key}</strong>

            <p style={{ color: "#94a3b8" }}>
              Click to inspect differences
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModifiedRequestsTable;