import type { HarResult } from "../types";
import { cardStyle, colors, spacing } from "../styles/theme";

type Props = {
  result: HarResult;
};

function SummaryCards({ result }: Props) {
  const cards = [
    {
      label: "File 1 Requests",
      value: result.summary.file1TotalRequests,
    },
    {
      label: "File 2 Requests",
      value: result.summary.file2TotalRequests,
    },
    {
      label: "Missing Request Groups",
      value: result.summary.missingRequestGroups,
    },
    {
      label: "Modified Request Pairs",
      value: result.summary.modifiedRequestPairs,
    },
    {
      label: "Total Differences",
      value:
        result.summary.missingRequestGroups +
        result.summary.modifiedRequestPairs,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(220px,1fr))",
        gap: "20px",
        marginTop: spacing.sectionGap,
      }}
    >
      {cards.map((card, i) => (
        <div key={i} style={cardStyle}>
          <p style={{ color: colors.muted }}>
            {card.label}
          </p>

          <h2>{card.value}</h2>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;