import { useState } from "react";
import Sidebar from "./components/Sidebar";
import UploadSection from "./components/UploadSection";
import SearchBar from "./components/SearchBar";
import SummaryCards from "./components/SummaryCards";
import ExportButtons from "./components/ExportButtons";
import MissingRequestsTable from "./components/MissingRequestsTable";
import ModifiedRequestsTable from "./components/ModifiedRequestsTable";
import EndpointDrawer from "./components/EndpointDrawer";

import type {
  HarResult,
  ModifiedRequest,
} from "./types";

function App() {
  const [fileA, setFileA] =
    useState<File | null>(null);
  const [fileB, setFileB] =
    useState<File | null>(null);
  const [result, setResult] =
    useState<HarResult | null>(null);

  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedEndpoint, setSelectedEndpoint] =
    useState<ModifiedRequest | null>(null);

  const [dragTarget, setDragTarget] =
    useState<"file1" | "file2" | null>(
      null
    );

  // --------------------
  // Compare HAR Files
  // --------------------
  const handleCompare = async () => {
    if (!fileA || !fileB) {
      alert(
        "Please upload both HAR files."
      );
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

      const data =
        await response.json();

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

  // --------------------
  // Drag & Drop
  // --------------------
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

  // --------------------
  // FILTERING (FIXED ✅)
  // --------------------
  const filteredMissing =
    result?.insights.missingRequests.filter(
      (item) =>
        (item.key || "")
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    ) || [];

  const filteredModified =
    result?.insights.modifiedRequests.filter(
      (item) =>
        (item.key || "")
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    ) || [];

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
        <h1 style={{ marginTop: 0 }}>
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
              color: "#ef4444",
              marginTop: "12px",
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

        {/* Export */}
        {result && (
          <ExportButtons
            result={result}
          />
        )}

        {/* Missing Requests */}
        {result && (
          <MissingRequestsTable
            data={filteredMissing}
          />
        )}

        {/* Modified Requests */}
        {result && (
          <ModifiedRequestsTable
            data={filteredModified}
            setSelectedEndpoint={
              setSelectedEndpoint
            }
          />
        )}
      </div>

      {/* Drawer */}
      <EndpointDrawer
        selectedEndpoint={
          selectedEndpoint
        }
        setSelectedEndpoint={
          setSelectedEndpoint
        }
      />
    </div>
  );
}

export default App;