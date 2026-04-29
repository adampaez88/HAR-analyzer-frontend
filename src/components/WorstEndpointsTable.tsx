type WorstEndpointsTableProps = {
  filteredWorst: any[];
  worstSortAsc: boolean;
  setWorstSortAsc: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setWorstSortField: React.Dispatch<
    React.SetStateAction<string>
  >;
  getFailureColor: (
    rate: number
  ) => string;
};

function WorstEndpointsTable({
  filteredWorst,
  worstSortAsc,
  setWorstSortAsc,
  setWorstSortField,
  getFailureColor,
}: WorstEndpointsTableProps) {
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
        Worst Endpoints
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
                setWorstSortField(
                  "url"
                );
                setWorstSortAsc(
                  !worstSortAsc
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
                setWorstSortField(
                  "failure"
                );
                setWorstSortAsc(
                  !worstSortAsc
                );
              }}
            >
              Failure ↕
            </th>

            <th style={thtd}>
              File 2 Failure
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredWorst.map(
            (
              item: any,
              index: number
            ) => (
              <tr key={index}>
                <td style={thtd}>
                  {item.url}
                </td>

                <td
                  style={{
                    ...thtd,
                    color:
                      getFailureColor(
                        item.file1
                          .failureRate
                      ),
                  }}
                >
                  {item.file1.failureRate.toFixed(
                    2
                  )}
                </td>

                <td
                  style={{
                    ...thtd,
                    color:
                      getFailureColor(
                        item.file2
                          ?.failureRate ??
                          0
                      ),
                  }}
                >
                  {item.file2?.failureRate?.toFixed(
                    2
                  ) || "N/A"}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
}

export default WorstEndpointsTable;