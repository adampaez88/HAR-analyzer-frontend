type MismatchTableProps = {
  filteredMismatch: any[];
  mismatchSortAsc: boolean;
  setMismatchSortAsc: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setMismatchSortField: React.Dispatch<
    React.SetStateAction<string>
  >;
  setSelectedEndpoint: React.Dispatch<
    React.SetStateAction<any>
  >;
};

function MismatchTable({
  filteredMismatch,
  mismatchSortAsc,
  setMismatchSortAsc,
  setMismatchSortField,
  setSelectedEndpoint,
}: MismatchTableProps) {
  const tableStyle = {
    width: "100%",
    borderCollapse:
      "collapse" as const,
    background: "#1e293b",
    borderRadius: "14px",
    overflow: "hidden",
  };

  const thtd = {
    padding: "14px",
    borderBottom:
      "1px solid #334155",
    textAlign:
      "left" as const,
  };

  return (
    <>
      <h2
        style={{
          marginTop: "35px",
        }}
      >
        Status Mismatches
      </h2>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th
              style={{
                ...thtd,
                cursor: "pointer",
              }}
              onClick={() => {
                setMismatchSortField(
                  "url"
                );
                setMismatchSortAsc(
                  !mismatchSortAsc
                );
              }}
            >
              URL ↕
            </th>

            <th
              style={{
                ...thtd,
                cursor: "pointer",
              }}
              onClick={() => {
                setMismatchSortField(
                  "count"
                );
                setMismatchSortAsc(
                  !mismatchSortAsc
                );
              }}
            >
              Count ↕
            </th>

            <th style={thtd}>
              Inspect
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredMismatch.map(
            (
              item: any,
              index: number
            ) => (
              <tr
                key={index}
                onClick={() =>
                  setSelectedEndpoint(
                    item
                  )
                }
                style={{
                  cursor:
                    "pointer",
                }}
              >
                <td style={thtd}>
                  {item.url}
                </td>

                <td style={thtd}>
                  {
                    item
                      .file1Requests
                      .length
                  }
                </td>

                <td style={thtd}>
                  →
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
}

export default MismatchTable;