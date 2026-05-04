import { useState } from "react";
import Sidebar from "./components/Sidebar";
import UploadSection from "./components/UploadSection";
import SearchBar from "./components/SearchBar";
import SummaryCards from "./components/SummaryCards";
import ExportButtons from "./components/ExportButtons";
import MissingRequestsTable from "./components/MissingRequestsTable";
import ModifiedRequestsTable from "./components/ModifiedRequestsTable";
import EndpointDrawer from "./components/EndpointDrawer";

import {
  adaptModifiedRequests,
} from "./adapters/diffAdapter";

import type { NormalizedModifiedRequest } from "./adapters/diffAdapter";

function App() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedEndpoint, setSelectedEndpoint] =
    useState<NormalizedModifiedRequest | null>(null);

  const [dragTarget, setDragTarget] =
    useState<"file1" | "file2" | null>(null);

  // --------------------
  // Compare HAR Files
  // --------------------
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
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // ✅ NORMALIZE MODIFIED REQUESTS HERE
      const normalizedModified = adaptModifiedRequests(
        data.data.insights.modifiedRequests
      );

      setResult({
        ...data.data,
        insights: {
          ...data.data.insights,
          modifiedRequests: normalizedModified,
        },
      });
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

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (target === "file1") setFileA(file);
    else setFileB(file);
  };

  // --------------------
  // FILTERING
  // --------------------
  const filteredMissing =
    result?.insights.missingRequests.filter((item: any) =>
      (item.key || "").toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const filteredModified =
    result?.insights.modifiedRequests.filter((item: any) =>
      (item.key || "").toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, padding: "35px" }}>
        <h1>HAR File Analyzer</h1>

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

        {error && <p style={{ color: "red" }}>{error}</p>}

        {result && (
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        )}

        {result && <SummaryCards result={result} />}
        {result && <ExportButtons result={result} />}

        {result && (
          <MissingRequestsTable data={filteredMissing} />
        )}

        {result && (
          <ModifiedRequestsTable
            data={filteredModified}
            setSelectedEndpoint={setSelectedEndpoint}
          />
        )}
      </div>

      <EndpointDrawer
        selectedEndpoint={selectedEndpoint}
        setSelectedEndpoint={setSelectedEndpoint}
      />
    </div>
  );
}

export default App;