import { useState } from "react";
import Sidebar from "./components/Sidebar";
import UploadSection from "./components/UploadSection";
import SearchBar from "./components/SearchBar";
import SummaryCards from "./components/SummaryCards";
import ExportButtons from "./components/ExportButtons";
import ChartsSection from "./components/ChartsSection";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function App() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedEndpoint, setSelectedEndpoint] =
    useState<any>(null);

  const [dragTarget, setDragTarget] = useState<
    "file1" | "file2" | null
  >(null);

  const [worstSortField, setWorstSortField] =
    useState("failure");
  const [worstSortAsc, setWorstSortAsc] =
    useState(false);

  const [mismatchSortField, setMismatchSortField] =
    useState("url");
  const [mismatchSortAsc, setMismatchSortAsc] =
    useState(true);

  // ------------------------------------
  // Compare HAR Files
  // ------------------------------------
  const handleCompare = async () => {
    if (!fileA || !fileB) {
      alert("Please upload both HAR files.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file1", fileA);
    formData.append("file2", fileB);

    try {
      const response = await fetch(
        "http://localhost:3000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Upload failed"
        );
      }

      setResult(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // Drag & Drop
  // ------------------------------------
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    target: "file1" | "file2"
  ) => {
    e.preventDefault();
    setDragTarget(null);

    const file =
      e.dataTransfer.files?.[0];

    if (!file) return;

    if (target === "file1") {
      setFileA(file);
    } else {
      setFileB(file);
    }
  };

  // ------------------------------------
  // Helpers
  // ------------------------------------
  const getFailureColor = (
    rate: number
  ) => {
    if (rate === 0) return "#22c55e";
    if (rate < 0.2) return "#eab308";
    return "#ef4444";
  };

  const getStatusMeta = (req: any) => {
    if (!req)
      return {
        label: "—",
        color: "#64748b",
      };

    if (req.status === 0)
      return {
        label: "Blocked",
        color: "#f59e0b",
      };

    if (req.status >= 500)
      return {
        label: req.status,
        color: "#ef4444",
      };

    if (req.status >= 400)
      return {
        label: req.status,
        color: "#f97316",
      };

    if (req.status >= 300)
      return {
        label: req.status,
        color: "#eab308",
      };

    return {
      label: req.status,
      color: "#22c55e",
    };
  };

  const renderBadge = (req: any) => {
    const { label, color } =
      getStatusMeta(req);

    return (
      <span
        style={{
          background: color,
          color: "white",
          padding: "4px 10px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {label}
      </span>
    );
  };

  const buildDiffRows = (
    file1: any[],
    file2: any[]
  ) => {
    const max = Math.max(
      file1.length,
      file2.length
    );

    const rows = [];

    for (let i = 0; i < max; i++) {
      const req1 = file1[i];
      const req2 = file2[i];

      let result = "Match";

      if (!req1 || !req2) {
        result = "Missing";
      } else if (
        req1.status !== req2.status
      ) {
        result = "Mismatch";
      }

      rows.push({
        index: i + 1,
        req1,
        req2,
        result,
      });
    }

    return rows;
  };

  const sortBy = (
    items: any[],
    asc: boolean,
    extractor: (item: any) => any
  ) => {
    return [...items].sort((a, b) => {
      const aVal = extractor(a);
      const bVal = extractor(b);

      if (
        typeof aVal === "string"
      ) {
        return asc
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return asc
        ? aVal - bVal
        : bVal - aVal;
    });
  };

  // ------------------------------------
  // Derived Data
  // ------------------------------------
  const filteredWorst = sortBy(
    result?.insights.worstEndpoints.filter(
      (item: any) =>
        item.url
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    ) || [],
    worstSortAsc,
    (item) =>
      worstSortField === "url"
        ? item.url
        : item.file1.failureRate
  );

  const filteredMismatch =
    sortBy(
      result?.sample.statusMismatches.filter(
        (item: any) =>
          item.url
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
      ) || [],
      mismatchSortAsc,
      (item) =>
        mismatchSortField ===
        "url"
          ? item.url
          : item.file1Requests.length
    );

  const requestChartData = result
    ? [
        {
          name: "File 1",
          requests:
            result.summary
              .file1TotalRequests,
        },
        {
          name: "File 2",
          requests:
            result.summary
              .file2TotalRequests,
        },
      ]
    : [];

  const failureChartData =
    filteredWorst
      .slice(0, 6)
      .map((item: any) => ({
        name:
          item.url.length > 20
            ? item.url.slice(
                0,
                20
              ) + "..."
            : item.url,
        rate:
          item.file1.failureRate,
      }));

  // ------------------------------------
  // Export Helpers
  // ------------------------------------
  const getDateStamp = () => {
    return new Date()
      .toISOString()
      .split("T")[0];
  };

  const exportJson = () => {
    if (!result) return;

    const payload = {
      summary: result.summary,
      insights:
        result.insights,
      mismatches:
        result.sample
          .statusMismatches,
      exportedAt:
        new Date().toISOString(),
    };

    const blob = new Blob(
      [
        JSON.stringify(
          payload,
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download = `har-report-${getDateStamp()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    if (!result) return;

    const rows = [
      [
        "URL",
        "File1 Requests",
        "File2 Requests",
        "Delta",
      ],
      ...filteredMismatch.map(
        (item: any) => [
          item.url,
          item.file1Requests.length,
          item.file2Requests.length,
          item.file2Requests.length -
            item.file1Requests.length,
        ]
      ),
    ];

    const csv = rows
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download = `har-report-${getDateStamp()}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  // ------------------------------------
  // Styles
  // ------------------------------------
  const cardStyle = {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "14px",
    boxShadow:
      "0 0 0 1px #334155",
  };

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

  const uploadBox = (
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

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div
        style={{
          flex: 1,
          padding: "35px",
        }}
      >
        <h1
          style={{
            marginTop: 0,
          }}
        >
          HAR File Analyzer
        </h1>

        {/* Upload */}
        <UploadSection
          fileA={fileA}
          fileB={fileB}
          loading={loading}
          dragTarget={dragTarget}
          setFileA={setFileA}
          setFileB={setFileB}
          setDragTarget={setDragTarget}
          handleDrop={handleDrop}
          handleCompare={handleCompare}
        />

        {error && (
          <p
            style={{
              color:
                "#ef4444",
              marginTop:
                "12px",
            }}
          >
            {error}
          </p>
        )}

        {/* Search */}
        {result && (
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}

        {/* Summary */}
        {result && (
          <SummaryCards result={result} />
        )}

        {/* Export Buttons */}
        {result && (
          <ExportButtons
            exportJson={exportJson}
            exportCsv={exportCsv}
          />
        )}

        {/* Charts */}
        {result && (
          <ChartsSection
            requestChartData={requestChartData}
            failureChartData={failureChartData}
          />
        )}

        {/* Worst Endpoints */}
        {result && (
          <>
            <h2
              style={{
                marginTop:
                  "35px",
              }}
            >
              Worst Endpoints
            </h2>

            <table
              style={
                tableStyle
              }
            >
              <thead>
                <tr>
                  <th
                    style={{
                      ...thtd,
                      cursor:
                        "pointer",
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
                      cursor:
                        "pointer",
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

                  <th
                    style={
                      thtd
                    }
                  >
                    File 2 Failure
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredWorst.map(
                  (
                    item: any,
                    i: number
                  ) => (
                    <tr
                      key={i}
                    >
                      <td
                        style={
                          thtd
                        }
                      >
                        {
                          item.url
                        }
                      </td>

                      <td
                        style={{
                          ...thtd,
                          color:
                            getFailureColor(
                              item
                                .file1
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
                              item
                                .file2
                                ?.failureRate ??
                                0
                            ),
                        }}
                      >
                        {item.file2?.failureRate?.toFixed(
                          2
                        ) ||
                          "N/A"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </>
        )}

        {/* Mismatch Table */}
        {result && (
          <>
            <h2
              style={{
                marginTop:
                  "35px",
              }}
            >
              Status Mismatches
            </h2>

            <table
              style={
                tableStyle
              }
            >
              <thead>
                <tr>
                  <th
                    style={{
                      ...thtd,
                      cursor:
                        "pointer",
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
                      cursor:
                        "pointer",
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

                  <th
                    style={
                      thtd
                    }
                  >
                    Inspect
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredMismatch.map(
                  (
                    item: any,
                    i: number
                  ) => (
                    <tr
                      key={i}
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
                      <td
                        style={
                          thtd
                        }
                      >
                        {
                          item.url
                        }
                      </td>

                      <td
                        style={
                          thtd
                        }
                      >
                        {
                          item
                            .file1Requests
                            .length
                        }
                      </td>

                      <td
                        style={
                          thtd
                        }
                      >
                        →
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Drawer */}
      {selectedEndpoint && (
        <>
          <div
            onClick={() =>
              setSelectedEndpoint(
                null
              )
            }
            style={{
              position:
                "fixed",
              inset: 0,
              background:
                "rgba(0,0,0,0.5)",
            }}
          />

          <div
            style={{
              position:
                "fixed",
              top: 0,
              right: 0,
              width: "430px",
              height:
                "100vh",
              background:
                "#111827",
              borderLeft:
                "1px solid #334155",
              padding:
                "25px",
              overflowY:
                "auto",
              zIndex: 50,
            }}
          >
            <div
              style={{
                display:
                  "flex",
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
                  border:
                    "none",
                  color:
                    "white",
                  fontSize:
                    "20px",
                  cursor:
                    "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <p
              style={{
                color:
                  "#94a3b8",
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

            <h3
              style={{
                marginTop:
                  "25px",
              }}
            >
              Request Comparison
            </h3>

            <table
              style={
                tableStyle
              }
            >
              <thead>
                <tr>
                  <th
                    style={
                      thtd
                    }
                  >
                    #
                  </th>
                  <th
                    style={
                      thtd
                    }
                  >
                    File1
                  </th>
                  <th
                    style={
                      thtd
                    }
                  >
                    File2
                  </th>
                  <th
                    style={
                      thtd
                    }
                  >
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
      )}
    </div>
  );
}

export default App;