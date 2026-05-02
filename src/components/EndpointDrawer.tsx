type EndpointDrawerProps = {
  selectedEndpoint: any;
  setSelectedEndpoint: React.Dispatch<React.SetStateAction<any>>;
  tableStyle: any;
  thtd: any;
};

function EndpointDrawer({
  selectedEndpoint,
  setSelectedEndpoint,
  tableStyle,
  thtd,
}: EndpointDrawerProps) {
  if (!selectedEndpoint) return null;

  const isModified =
    selectedEndpoint.file1 && selectedEndpoint.file2;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setSelectedEndpoint(null)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
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
          background: "#111827",
          borderLeft: "1px solid #334155",
          padding: "25px",
          overflowY: "auto",
          zIndex: 50,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Endpoint Detail</h2>

          <button
            onClick={() => setSelectedEndpoint(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Key */}
        <p
          style={{
            color: "#94a3b8",
            wordBreak: "break-word",
          }}
        >
          {selectedEndpoint.key}
        </p>

        <hr
          style={{
            borderColor: "#1e293b",
            margin: "20px 0",
          }}
        />

        {/* ========================= */}
        {/* MODIFIED REQUEST VIEW */}
        {/* ========================= */}
        {isModified && (
          <>
            <h3>Request Comparison</h3>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thtd}>Field</th>
                  <th style={thtd}>File 1</th>
                  <th style={thtd}>File 2</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td style={thtd}>Method</td>
                  <td style={thtd}>
                    {selectedEndpoint.file1.method}
                  </td>
                  <td style={thtd}>
                    {selectedEndpoint.file2.method}
                  </td>
                </tr>

                <tr>
                  <td style={thtd}>Status</td>
                  <td style={thtd}>
                    {selectedEndpoint.file1.status}
                  </td>
                  <td style={thtd}>
                    {selectedEndpoint.file2.status}
                  </td>
                </tr>

                <tr>
                  <td style={thtd}>Base URL</td>
                  <td style={thtd}>
                    {selectedEndpoint.file1.baseUrl}
                  </td>
                  <td style={thtd}>
                    {selectedEndpoint.file2.baseUrl}
                  </td>
                </tr>

                <tr>
                  <td style={thtd}>Time</td>
                  <td style={thtd}>
                    {selectedEndpoint.file1.time}
                  </td>
                  <td style={thtd}>
                    {selectedEndpoint.file2.time}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}

        {/* ========================= */}
        {/* DIFF PREVIEW (NEW 🔥) */}
        {/* ========================= */}
        {selectedEndpoint.diff && (
          <>
            <h3 style={{ marginTop: "25px" }}>
              Header Differences
            </h3>

            <pre
              style={{
                background: "#0f172a",
                padding: "12px",
                borderRadius: "8px",
                overflowX: "auto",
                fontSize: "12px",
              }}
            >
              {JSON.stringify(
                selectedEndpoint.diff.request.headers,
                null,
                2
              )}
            </pre>

            <h3 style={{ marginTop: "20px" }}>
              Body Differences
            </h3>

            <pre
              style={{
                background: "#0f172a",
                padding: "12px",
                borderRadius: "8px",
                overflowX: "auto",
                fontSize: "12px",
              }}
            >
              {JSON.stringify(
                selectedEndpoint.diff.request.body,
                null,
                2
              )}
            </pre>
          </>
        )}
      </div>
    </>
  );
}

export default EndpointDrawer;