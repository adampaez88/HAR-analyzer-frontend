import type { ModifiedRequest } from "../types";

type Props = {
  data: ModifiedRequest[];
  setSelectedEndpoint: React.Dispatch<
    React.SetStateAction<ModifiedRequest | null>
  >;
};

function ModifiedRequestsTable({
  data,
  setSelectedEndpoint,
}: Props) {
  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Modified Requests</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ padding: "12px", textAlign: "left" }}>
              Endpoint
            </th>
            <th style={{ padding: "12px", textAlign: "left" }}>
              Method
            </th>
            <th style={{ padding: "12px", textAlign: "left" }}>
              Status Change
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr
              key={i}
              onClick={() => setSelectedEndpoint(item)}
              style={{
                cursor: "pointer",
              }}
            >
              <td style={{ padding: "12px" }}>
                {item.key}
              </td>

              <td style={{ padding: "12px" }}>
                {item.file1.method}
              </td>

              <td style={{ padding: "12px" }}>
                {item.file1.status} → {item.file2.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ModifiedRequestsTable;