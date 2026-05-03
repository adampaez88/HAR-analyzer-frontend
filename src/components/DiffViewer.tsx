import { useState } from "react";
import JsonViewer from "./JsonViewer";

type RawDiff = {
  added?: any[];
  removed?: any[];
  changed?: any[];
};

type Props = {
  diff: any;
};

function normalizeSection(raw: RawDiff) {
  const result: any[] = [];

  raw.changed?.forEach((item) => {
    result.push({
      key: item.key,
      type: "changed",
      before: item.from,
      after: item.to,
    });
  });

  raw.added?.forEach((item) => {
    result.push({
      key: item.key,
      type: "added",
      before: undefined,
      after: item.value,
    });
  });

  raw.removed?.forEach((item) => {
    result.push({
      key: item.key,
      type: "removed",
      before: item.value,
      after: undefined,
    });
  });

  return result;
}

function DiffViewer({ diff }: Props) {
  const [showOnlyDiffs, setShowOnlyDiffs] = useState(true);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  if (!diff) return null;

  const toggleSection = (section: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderSection = (title: string, raw: RawDiff) => {
    const data = normalizeSection(raw);

    if (!data.length) return null;

    const isCollapsed = collapsed[title];

    return (
      <div style={{ marginBottom: "25px" }}>
        {/* Header */}
        <div
          onClick={() => toggleSection(title)}
          style={{
            cursor: "pointer",
            background: "#1e293b",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #334155",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <strong>{title}</strong>
          <span>{isCollapsed ? "▶" : "▼"}</span>
        </div>

        {!isCollapsed && (
          <table
            style={{
              width: "100%",
              marginTop: "10px",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Field</th>
                <th style={{ textAlign: "left" }}>Before</th>
                <th style={{ textAlign: "left" }}>After</th>
                <th style={{ textAlign: "left" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, i) => {
                if (
                  showOnlyDiffs &&
                  item.type === undefined
                ) {
                  return null;
                }

                let color = "#e2e8f0";
                if (item.type === "changed") color = "#facc15";
                if (item.type === "added") color = "#22c55e";
                if (item.type === "removed") color = "#ef4444";

                return (
                  <tr key={i}>
                    <td style={{ padding: "6px", color }}>
                      {item.key}
                    </td>

                    <td style={{ padding: "6px" }}>
                      <JsonViewer data={item.before} />
                    </td>

                    <td style={{ padding: "6px" }}>
                      <JsonViewer data={item.after} />
                    </td>

                    <td style={{ padding: "6px", color }}>
                      {item.type}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Controls */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={showOnlyDiffs}
            onChange={() =>
              setShowOnlyDiffs(!showOnlyDiffs)
            }
          />{" "}
          Show only differences
        </label>
      </div>

      {renderSection("Headers", diff.request?.headers)}
      {renderSection("Body", diff.request?.body)}
    </div>
  );
}

export default DiffViewer;