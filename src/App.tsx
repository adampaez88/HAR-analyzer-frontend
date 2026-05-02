import { useState } from "react";

import Sidebar from "./components/Sidebar";
import UploadSection from "./components/UploadSection";
import SearchBar from "./components/SearchBar";
import SummaryCards from "./components/SummaryCards";
import ExportButtons from "./components/ExportButtons";
import EndpointDrawer from "./components/EndpointDrawer";

// ✅ NEW TABLES
import MissingRequestsTable from "./components/MissingRequestsTable";
import ModifiedRequestsTable from "./components/ModifiedRequestsTable";

import type {
  HarResult,
  MissingRequest,
  ModifiedRequest,
} from "./types";

import { buildDiffRows } from "./utils/helpers";

import {
  colors,
  spacing,
  layout,
  tableStyle,
  thtd,
} from "./styles/theme";

function App() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [result, setResult] = useState<HarResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedEndpoint, setSelectedEndpoint] =
    useState<ModifiedRequest | null>(null);

  const [dragTarget, setDragTarget] = useState<
    "file1" | "file2" | null
  >(null);

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

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (target === "file1") {
      setFileA(file);
    } else {
      setFileB(file);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: spacing.pagePadding,
        }}
      >
        <div style={layout.container}>
          <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
            HAR Analyzer
          </h1>

          <p style={{ color: colors.muted }}>
            Compare and analyze network traffic differences
          </p>

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
            <p style={{ color: colors.danger }}>
              {error}
            </p>
          )}

          {result && (
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}

          {result && (
            <SummaryCards result={result} />
          )}

          {result && (
            <ExportButtons
              exportJson={() => {}}
              exportCsv={() => {}}
            />
          )}

          {/* ✅ NEW TABLES */}
          {result && (
            <MissingRequestsTable
              data={
                result.insights.missingRequests as MissingRequest[]
              }
            />
          )}

          {result && (
            <ModifiedRequestsTable
              data={
                result.insights.modifiedRequests as ModifiedRequest[]
              }
              setSelectedEndpoint={setSelectedEndpoint}
            />
          )}
        </div>
      </div>

      <EndpointDrawer
        selectedEndpoint={selectedEndpoint}
        setSelectedEndpoint={setSelectedEndpoint}
        tableStyle={tableStyle}
        thtd={thtd}
        buildDiffRows={buildDiffRows}
      />
    </div>
  );
}

export default App;