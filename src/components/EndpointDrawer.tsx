import { useState } from "react";

type Props = {
  selectedEndpoint: any;
  setSelectedEndpoint: React.Dispatch<React.SetStateAction<any>>;
};

function EndpointDrawer({ selectedEndpoint, setSelectedEndpoint }: Props) {
  const [activeTab, setActiveTab] = useState<"headers" | "body">("headers");
  const [showOnlyDiff, setShowOnlyDiff] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  if (!selectedEndpoint) return null;

  const diff = selectedEndpoint.diff?.request;
  const file1 = selectedEndpoint.file1;
  const file2 = selectedEndpoint.file2;

  const copy = (val: any) => navigator.clipboard.writeText(String(val ?? ""));

  // ---------------- HEADER ROWS ----------------
  const buildRows = () => {
    const keys = new Set<string>();

    Object.keys(file1.headers || {}).forEach(k => keys.add(k));
    Object.keys(file2.headers || {}).forEach(k => keys.add(k));

    diff?.headers?.added?.forEach((d: any) => keys.add(d.key));
    diff?.headers?.removed?.forEach((d: any) => keys.add(d.key));
    diff?.headers?.changed?.forEach((d: any) => keys.add(d.key));

    return Array.from(keys).map(key => {
      const before = file1.headers?.[key];
      const after = file2.headers?.[key];

      let type = "unchanged";

      if (diff?.headers?.added?.some((d: any) => d.key === key)) type = "added";
      else if (diff?.headers?.removed?.some((d: any) => d.key === key)) type = "removed";
      else if (diff?.headers?.changed?.some((d: any) => d.key === key)) type = "changed";

      return { key, before, after, type };
    });
  };

  let rows = buildRows();

  // filters
  if (showOnlyDiff) {
    rows = rows.filter(r => r.type !== "unchanged");
  }

  if (filterType !== "all") {
    rows = rows.filter(r => r.type === filterType);
  }

  if (search) {
    rows = rows.filter(r =>
      r.key.toLowerCase().includes(search.toLowerCase())
    );
  }

  const getBg = (type: string) => {
    if (type === "added") return "#052e16";
    if (type === "removed") return "#450a0a";
    if (type === "changed") return "#422006";
    return "";
  };

  // ---------------- BODY ----------------
  const tryParse = (v: any) => {
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  };

  const body1 = tryParse(file1.body);
  const body2 = tryParse(file2.body);

  const format = (v: any) =>
    typeof v === "object"
      ? JSON.stringify(v, null, 2)
      : v ?? "—";

  return (
    <>
      <div onClick={() => setSelectedEndpoint(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)" }} />

      <div style={{ position: "fixed", right: 0, top: 0, width: "750px", height: "100vh", background: "#111827", padding: 25, overflowY: "auto" }}>
        <h2>Request Diff</h2>
        <p style={{ color: "#94a3b8" }}>{selectedEndpoint.key}</p>

        {/* CONTROLS */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setActiveTab("headers")}>Headers</button>
          <button onClick={() => setActiveTab("body")}>Body</button>
        </div>

        <div style={{ marginTop: 10 }}>
          <input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>
            <input
              type="checkbox"
              checked={showOnlyDiff}
              onChange={() => setShowOnlyDiff(!showOnlyDiff)}
            />
            Show only differences
          </label>
        </div>

        <div style={{ marginTop: 10 }}>
          <select onChange={e => setFilterType(e.target.value)}>
            <option value="all">All</option>
            <option value="added">Added</option>
            <option value="removed">Removed</option>
            <option value="changed">Changed</option>
          </select>
        </div>

        {/* HEADERS */}
        {activeTab === "headers" && (
          <table style={{ width: "100%", marginTop: 20 }}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Before</th>
                <th>After</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ background: getBg(r.type) }}>
                  <td>{r.key}</td>
                  <td>{r.before ?? "—"}</td>
                  <td>{r.after ?? "—"}</td>
                  <td>{r.type}</td>
                  <td>
                    <button onClick={() => copy(r.after ?? r.before)}>Copy</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* BODY */}
        {activeTab === "body" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <pre>{format(body1)}</pre>
            <pre>{format(body2)}</pre>
          </div>
        )}
      </div>
    </>
  );
}

export default EndpointDrawer;