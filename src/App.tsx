import { useState } from "react";
import Sidebar from "./components/Sidebar";
import UploadSection from "./components/UploadSection";
import SearchBar from "./components/SearchBar";
import SummaryCards from "./components/SummaryCards";
import ExportButtons from "./components/ExportButtons";
import ChartsSection from "./components/ChartsSection";
import WorstEndpointsTable from "./components/WorstEndpointsTable";
import MismatchTable from "./components/MismatchTable";
import EndpointDrawer from "./components/EndpointDrawer";

import {
  getFailureColor,
  renderBadge,
  buildDiffRows,
  sortBy,
} from "./utils/helpers";


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
          <WorstEndpointsTable
            filteredWorst={filteredWorst}
            worstSortAsc={worstSortAsc}
            setWorstSortAsc={setWorstSortAsc}
            setWorstSortField={setWorstSortField}
            getFailureColor={getFailureColor}
          />
        )}

        {/* Mismatch Table */}
        {result && (
          <MismatchTable
            filteredMismatch={filteredMismatch}
            mismatchSortAsc={mismatchSortAsc}
            setMismatchSortAsc={setMismatchSortAsc}
            setMismatchSortField={setMismatchSortField}
            setSelectedEndpoint={setSelectedEndpoint}
          />
        )}

      </div>

      {/* Drawer */}
      <EndpointDrawer
        selectedEndpoint={selectedEndpoint}
        setSelectedEndpoint={setSelectedEndpoint}
        tableStyle={tableStyle}
        thtd={thtd}
        buildDiffRows={buildDiffRows}
        renderBadge={renderBadge}
      />

    </div>
  );
}

export default App;