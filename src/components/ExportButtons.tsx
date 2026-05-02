import type { HarResult } from "../types";

type Props = {
  result: HarResult;
};

function ExportButtons({ result }: Props) {
  const getDateStamp = () =>
    new Date().toISOString().split("T")[0];

  const exportJson = () => {
    const payload = {
      summary: result.summary,
      insights: result.insights,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob(
      [JSON.stringify(payload, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `har-report-${getDateStamp()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const rows = [
      ["Key", "File1", "File2", "Diff"],
      ...result.insights.modifiedRequests.map(
        (item: any) => [
          item.key,
          item.file1.status,
          item.file2.status,
          item.file1.status - item.file2.status,
        ]
      ),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `har-report-${getDateStamp()}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "25px",
      }}
    >
      <button
        onClick={exportJson}
        style={{
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          background: "#2563eb",
          color: "white",
          cursor: "pointer",
        }}
      >
        Export JSON
      </button>

      <button
        onClick={exportCsv}
        style={{
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          background: "#16a34a",
          color: "white",
          cursor: "pointer",
        }}
      >
        Export CSV
      </button>
    </div>
  );
}

export default ExportButtons;