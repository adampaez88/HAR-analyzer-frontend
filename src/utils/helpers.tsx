import type {
  RequestEntry,
  DiffRow,
} from "../types";

export const getFailureColor = (
  rate: number
) => {
  if (rate === 0) return "#22c55e";
  if (rate < 0.2) return "#eab308";
  return "#ef4444";
};

export const getStatusMeta = (
  req?: RequestEntry
) => {
  if (!req) {
    return {
      label: "—",
      color: "#64748b",
    };
  }

  if (req.status === 0) {
    return {
      label: "Blocked",
      color: "#f59e0b",
    };
  }

  if (req.status >= 500) {
    return {
      label: req.status,
      color: "#ef4444",
    };
  }

  if (req.status >= 400) {
    return {
      label: req.status,
      color: "#f97316",
    };
  }

  if (req.status >= 300) {
    return {
      label: req.status,
      color: "#eab308",
    };
  }

  return {
    label: req.status,
    color: "#22c55e",
  };
};

export const renderBadge = (
  req?: RequestEntry
) => {
  const {
    label,
    color,
  } = getStatusMeta(req);

  return (
    <span
      style={{
        background: color,
        color: "white",
        padding: "4px 10px",
        borderRadius:
          "999px",
        fontSize: "12px",
        fontWeight:
          "bold",
      }}
    >
      {label}
    </span>
  );
};

export const buildDiffRows = (
  file1: RequestEntry[],
  file2: RequestEntry[]
): DiffRow[] => {
  const max = Math.max(
    file1.length,
    file2.length
  );

  const rows: DiffRow[] = [];

  for (let i = 0; i < max; i++) {
    const req1 = file1[i];
    const req2 = file2[i];

    let result = "Match";

    if (!req1 || !req2) {
      result = "Missing";
    } else if (
      req1.status !== req2.status
    ) {
      result = "Mismatch";
    }

    rows.push({
      index: i + 1,
      req1,
      req2,
      result,
    });
  }

  return rows;
};

export const sortBy = (
  items: any[],
  asc: boolean,
  extractor: (
    item: any
  ) => any
) => {
  return [...items].sort(
    (a, b) => {
      const aVal =
        extractor(a);
      const bVal =
        extractor(b);

      if (
        typeof aVal ===
        "string"
      ) {
        return asc
          ? aVal.localeCompare(
              bVal
            )
          : bVal.localeCompare(
              aVal
            );
      }

      return asc
        ? aVal - bVal
        : bVal - aVal;
    }
  );
};
