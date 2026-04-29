import type {
  RequestEntry,
} from "../types";

import { getStatusMeta } from "./helpers";

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
