import { useState } from "react";
import JsonViewer from "./JsonViewer";

type DiffSection = {
  added: any[];
  removed: any[];
  changed: {
    key: string;
    from: any;
    to: any;
  }[];
};

type Props = {
  diff: {
    headers: DiffSection;
    body: DiffSection;
    responseHeaders: DiffSection;
  };
};

type Row = {
  key: string;
  type: "added" | "removed" | "changed";
  before?: any;
  after?: any;
};

function normalize(section: DiffSection): Row[] {
  const rows: Row[] = [];

  section.changed.forEach((c) => {
    rows.push({
      key: c.key,
      type: "changed",
      before: c.from,
      after: c.to,
    });
  });

  section.added.forEach((a) => {
    rows.push({
      key: a.key ?? "added",
      type: "added",
      after: a,
    });
  });

  section.removed.forEach((r) => {
    rows.push({
      key: r.key ?? "removed",
      type: "removed",
      before: r,
    });
  });

  return rows;
}

function getColor(type: string) {
  switch (type) {
    case "added":
      return "#22c55e";
    case "removed":
      return "#ef4444";
    case "changed":
      return "#facc15";
    default:
      return "#e2e8f0";
  }
}

function DiffViewer({ diff }: Props) {
  const [showOnlyDiffs, setShowOnlyDiffs] = useState(true);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  const renderSection = (title: string, section: DiffSection) => {
    const rows = normalize(section);

    const isCollapsed = collapsed[title];
    const hasData = rows.length > 0;

    return (
      <div style={{ marginBottom: 20 }}>
        {/* SECTION HEADER */}
        <div
          onClick={() => toggle(title)}
          style={{
            background: "#1e293b",
            padding: "10px",
            borderRadius: 8,
            cursor: "pointer",
            border: "1px solid #334155",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <strong>{title}</strong>
          <span>{isCollapsed ? "▶" : "▼"}</span>
        </div>

        {/* SECTION CONTENT */}
        {!isCollapsed && (
          <div style={{ marginTop: 10 }}>
            {!hasData && (
              <div style={{ color: "#64748b" }}>
                No differences detected
              </div>
            )}

            {hasData && (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Key</th>
                    <th style={{ textAlign: "left" }}>Before</th>
                    <th style={{ textAlign: "left" }}>After</th>
                    <th style={{ textAlign: "left" }}>Type</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r, i) => {
                    if (showOnlyDiffs && r.type === undefined) return null;

                    const color = getColor(r.type);

                    return (
                      <tr key={i}>
                        <td style={{ color }}>{r.key}</td>
                        <td>
                          <JsonViewer data={r.before} />
                        </td>
                        <td>
                          <JsonViewer data={r.after} />
                        </td>
                        <td style={{ color }}>{r.type}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* CONTROLS */}
      <div style={{ marginBottom: 15 }}>
        <label>
          <input
            type="checkbox"
            checked={showOnlyDiffs}
            onChange={() => setShowOnlyDiffs(!showOnlyDiffs)}
          />{" "}
          Show only differences
        </label>
      </div>

      {/* SECTIONS */}
      {renderSection("Headers", diff.headers)}
      {renderSection("Body", diff.body)}
      {renderSection("Response Headers", diff.responseHeaders)}
    </div>
  );
}

export default DiffViewer;