type EndpointDrawerProps = {
  selectedEndpoint: any;
  setSelectedEndpoint: React.Dispatch<
    React.SetStateAction<any>
  >;
  tableStyle: any;
  thtd: any;
  buildDiffRows: (
    file1: any[],
    file2: any[]
  ) => any[];
  renderBadge: (
    req: any
  ) => React.ReactNode;
};

function EndpointDrawer({
  selectedEndpoint,
  setSelectedEndpoint,
  tableStyle,
  thtd,
  buildDiffRows,
  renderBadge,
}: EndpointDrawerProps) {
  if (!selectedEndpoint) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() =>
          setSelectedEndpoint(
            null
          )
        }
        style={{
          position: "fixed",
          inset: 0,
          background:
            "rgba(0,0,0,0.5)",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "430px",
          height: "100vh",
          background:
            "#111827",
          borderLeft:
            "1px solid #334155",
          padding: "25px",
          overflowY: "auto",
          zIndex: 50,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
          }}
        >
          <h2>
            Endpoint Detail
          </h2>

          <button
            onClick={() =>
              setSelectedEndpoint(
                null
              )
            }
            style={{
              background:
                "transparent",
              border: "none",
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* URL */}
        <p
          style={{
            color: "#94a3b8",
            wordBreak:
              "break-word",
          }}
        >
          {
            selectedEndpoint.url
          }
        </p>

        <hr
          style={{
            borderColor:
              "#1e293b",
            margin:
              "20px 0",
          }}
        />

        {/* Counts */}
        <p>
          File 1 Requests:{" "}
          {
            selectedEndpoint
              .file1Requests
              .length
          }
        </p>

        <p>
          File 2 Requests:{" "}
          {
            selectedEndpoint
              .file2Requests
              .length
          }
        </p>

        {/* Table */}
        <h3
          style={{
            marginTop:
              "25px",
          }}
        >
          Request Comparison
        </h3>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thtd}>
                #
              </th>
              <th style={thtd}>
                File1
              </th>
              <th style={thtd}>
                File2
              </th>
              <th style={thtd}>
                Result
              </th>
            </tr>
          </thead>

          <tbody>
            {buildDiffRows(
              selectedEndpoint.file1Requests,
              selectedEndpoint.file2Requests
            ).map(
              (
                row: any
              ) => (
                <tr
                  key={
                    row.index
                  }
                >
                  <td
                    style={
                      thtd
                    }
                  >
                    {
                      row.index
                    }
                  </td>

                  <td
                    style={
                      thtd
                    }
                  >
                    {renderBadge(
                      row.req1
                    )}
                  </td>

                  <td
                    style={
                      thtd
                    }
                  >
                    {renderBadge(
                      row.req2
                    )}
                  </td>

                  <td
                    style={{
                      ...thtd,
                      color:
                        row.result ===
                        "Mismatch"
                          ? "#ef4444"
                          : row.result ===
                            "Missing"
                          ? "#f59e0b"
                          : "#22c55e",
                    }}
                  >
                    {
                      row.result
                    }
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EndpointDrawer;