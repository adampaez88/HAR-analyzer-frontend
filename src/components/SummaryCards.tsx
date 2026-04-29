import {
  cardStyle,
} from "../styles/theme";

type SummaryCardsProps = {
  result: any;
};

function SummaryCards({
  result,
}: SummaryCardsProps) {
  const cards = [
    {
      label: "File 1 Requests",
      value:
        result.summary
          .file1TotalRequests,
    },
    {
      label: "File 2 Requests",
      value:
        result.summary
          .file2TotalRequests,
    },
    {
      label: "Mismatches",
      value:
        result.summary
          .statusMismatches,
    },
    {
      label: "Unique URLs",
      value:
        result.summary
          .uniqueUrlsFile1,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(220px,1fr))",
        gap: "20px",
        marginTop: "25px",
      }}
    >
      {cards.map(
        (card, index) => (
          <div
            key={index}
            style={cardStyle}
          >
            <p
              style={{
                color:
                  "#94a3b8",
              }}
            >
              {card.label}
            </p>

            <h2>
              {card.value}
            </h2>
          </div>
        )
      )}
    </div>
  );
}

export default SummaryCards;