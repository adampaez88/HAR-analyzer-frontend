type UploadSectionProps = {
  fileA: File | null;
  fileB: File | null;
  loading: boolean;
  dragTarget: "file1" | "file2" | null;
  setFileA: React.Dispatch<React.SetStateAction<File | null>>;
  setFileB: React.Dispatch<React.SetStateAction<File | null>>;
  setDragTarget: React.Dispatch<
    React.SetStateAction<"file1" | "file2" | null>
  >;
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    target: "file1" | "file2"
  ) => void;
  handleCompare: () => void;
};

function UploadSection({
  fileA,
  fileB,
  loading,
  dragTarget,
  setFileA,
  setFileB,
  setDragTarget,
  handleDrop,
  handleCompare,
}: UploadSectionProps) {
  const cardStyle = {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 0 0 1px #334155",
    marginTop: "25px",
  };

  const uploadBox = (active: boolean) => ({
    border: active
      ? "2px dashed #3b82f6"
      : "2px dashed #334155",
    borderRadius: "14px",
    padding: "22px",
    width: "280px",
    background: active ? "#172554" : "#0f172a",
    cursor: "pointer",
  });

  return (
    <div style={cardStyle}>
      <h2>Upload HAR Files</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* File 1 */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setDragTarget("file1")}
          onDragLeave={() => setDragTarget(null)}
          onDrop={(e) => handleDrop(e, "file1")}
          style={uploadBox(dragTarget === "file1")}
        >
          <p>Drop File 1 Here</p>

          <input
            type="file"
            accept=".har"
            onChange={(e) =>
              setFileA(e.target.files?.[0] || null)
            }
          />

          <p>{fileA?.name}</p>
        </div>

        {/* File 2 */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setDragTarget("file2")}
          onDragLeave={() => setDragTarget(null)}
          onDrop={(e) => handleDrop(e, "file2")}
          style={uploadBox(dragTarget === "file2")}
        >
          <p>Drop File 2 Here</p>

          <input
            type="file"
            accept=".har"
            onChange={(e) =>
              setFileB(e.target.files?.[0] || null)
            }
          />

          <p>{fileB?.name}</p>
        </div>

        {/* Compare */}
        <div>
          <button
            onClick={handleCompare}
            disabled={loading}
            style={{
              marginTop: "30px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
            }}
          >
            {loading ? "Comparing..." : "Compare"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadSection;