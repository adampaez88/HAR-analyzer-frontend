import { useState } from "react";

import type {
  NormalizedModifiedRequest,
  DiffItem,
} from "../adapters/diffAdapter";
import RequestChangeSummary from "./RequestChangeSummary";

type Props = {
  selectedEndpoint: NormalizedModifiedRequest | null;

  setSelectedEndpoint: React.Dispatch<
    React.SetStateAction<NormalizedModifiedRequest | null>
  >;
};

function EndpointDrawer({
  selectedEndpoint,
  setSelectedEndpoint,
}: Props) {
  const [activeTab, setActiveTab] =
    useState<
      | "headers"
      | "cookies"
      | "body"
      | "responseCookies"
    >("headers");

  const [showOnlyDiff, setShowOnlyDiff] =
    useState(true);

  const [filterType, setFilterType] =
    useState("all");

  const [search, setSearch] = useState("");

  if (!selectedEndpoint) return null;

  const diff = selectedEndpoint.diff;

  const file1 = selectedEndpoint.file1;
  const file2 = selectedEndpoint.file2;

  const copy = (val: any) =>
    navigator.clipboard.writeText(
      String(val ?? "")
    );

  // ---------------- BUILD ROWS ----------------

  const buildRows = (
    section: {
      added: DiffItem[];
      removed: DiffItem[];
      changed: DiffItem[];
    },
    beforeObj: Record<string, any> = {},
    afterObj: Record<string, any> = {}
  ) => {
    const keys = new Set<string>();

    Object.keys(beforeObj).forEach((k) =>
      keys.add(k)
    );

    Object.keys(afterObj).forEach((k) =>
      keys.add(k)
    );

    section.added.forEach((d) =>
      keys.add(d.key)
    );

    section.removed.forEach((d) =>
      keys.add(d.key)
    );

    section.changed.forEach((d) =>
      keys.add(d.key)
    );

    return Array.from(keys).map((key) => {
      const before = beforeObj[key];
      const after = afterObj[key];

      let type = "unchanged";

      if (
        section.added.some(
          (d) => d.key === key
        )
      ) {
        type = "added";
      } else if (
        section.removed.some(
          (d) => d.key === key
        )
      ) {
        type = "removed";
      } else if (
        section.changed.some(
          (d) => d.key === key
        )
      ) {
        type = "changed";
      }

      return {
        key,
        before,
        after,
        type,
      };
    });
  };

  // ---------------- TAB SECTIONS ----------------

  let section = diff.headers;
  let beforeObj = file1.headers || {};
  let afterObj = file2.headers || {};

  if (activeTab === "cookies") {
    section = diff.cookies;
    beforeObj = file1.cookies || {};
    afterObj = file2.cookies || {};
  }

  if (activeTab === "body") {
    section = diff.body;

    try {
      beforeObj = JSON.parse(
        file1.body || "{}"
      );

      afterObj = JSON.parse(
        file2.body || "{}"
      );
    } catch {
      beforeObj = {};
      afterObj = {};
    }
  }

  if (activeTab === "responseCookies") {
    section = diff.responseCookies;

    beforeObj = file1.setCookies || {};
    afterObj = file2.setCookies || {};
  }

  let rows = buildRows(
    section,
    beforeObj,
    afterObj
  );

  // ---------------- FILTERS ----------------

  if (showOnlyDiff) {
    rows = rows.filter(
      (r) => r.type !== "unchanged"
    );
  }

  if (filterType !== "all") {
    rows = rows.filter(
      (r) => r.type === filterType
    );
  }

  if (search) {
    rows = rows.filter((r) =>
      String(r.key || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }

  const getBg = (type: string) => {
    if (type === "added") return "#052e16";
    if (type === "removed") return "#450a0a";
    if (type === "changed") return "#422006";

    return "";
  };

  // ---------------- RENDER ----------------

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() =>
          setSelectedEndpoint(null)
        }
        style={{
          position: "fixed",
          inset: 0,
          background:
            "rgba(0,0,0,0.5)",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          width: "750px",
          height: "100vh",
          background: "#111827",
          padding: 25,
          overflowY: "auto",
          color: "white",
        }}
      >
        <h2>Request Diff</h2>

        <p style={{ color: "#94a3b8" }}>
          {selectedEndpoint.key}
        </p>

        {/* Timing */}
        {selectedEndpoint.timing && (
          <div
            style={{
              marginBottom: 20,
              padding: 12,
              background: "#1e293b",
              borderRadius: 8,
            }}
          >
            <strong>
              Timing Delta:
            </strong>{" "}
            {selectedEndpoint.timing.file1}
            ms →{" "}
            {selectedEndpoint.timing.file2}
            ms (
            {selectedEndpoint.timing.delta >= 0
              ? "+"
              : ""}
            {
              selectedEndpoint.timing
                .delta
            }
            ms)
          </div>
        )}


        < RequestChangeSummary diff={diff} />
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() =>
              setActiveTab("headers")
            }
          >
            Headers
          </button>

          <button
            onClick={() =>
              setActiveTab("cookies")
            }
          >
            Cookies
          </button>

          <button
            onClick={() =>
              setActiveTab("body")
            }
          >
            Body
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "responseCookies"
              )
            }
          >
            Response Cookies
          </button>
        </div>

        {/* Controls */}
        <div style={{ marginTop: 15 }}>
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>
            <input
              type="checkbox"
              checked={showOnlyDiff}
              onChange={() =>
                setShowOnlyDiff(
                  !showOnlyDiff
                )
              }
            />{" "}
            Show only differences
          </label>
        </div>

        <div style={{ marginTop: 10 }}>
          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(
                e.target.value
              )
            }
          >
            <option value="all">
              All
            </option>

            <option value="added">
              Added
            </option>

            <option value="removed">
              Removed
            </option>

            <option value="changed">
              Changed
            </option>
          </select>
        </div>

        {/* Table */}
        <table
          style={{
            width: "100%",
            marginTop: 20,
          }}
        >
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
              <tr
                key={i}
                style={{
                  background: getBg(r.type),
                }}
              >
                <td>{r.key}</td>

                <td>
                  {String(
                    r.before ?? "—"
                  )}
                </td>

                <td>
                  {String(
                    r.after ?? "—"
                  )}
                </td>

                <td>{r.type}</td>

                <td>
                  <button
                    onClick={() =>
                      copy(
                        r.after ??
                          r.before
                      )
                    }
                  >
                    Copy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EndpointDrawer;