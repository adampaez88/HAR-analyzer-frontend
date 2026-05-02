// src/styles/theme.ts

export const colors = {
  bg: "#0f172a",
  panel: "#111827",
  card: "#1e293b",
  border: "#334155",

  text: "#ffffff",
  muted: "#94a3b8",

  primary: "#3b82f6",
  success: "#22c55e",
  warning: "#eab308",
  danger: "#ef4444",
};

export const spacing = {
  pagePadding: "40px",
  sectionGap: "30px",
  cardPadding: "20px",
};

export const radius = {
  lg: "16px",
  md: "12px",
};

export const shadow = {
  card: "0 0 0 1px #334155",
};

export const layout = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
};

export const cardStyle = {
  background: colors.card,
  padding: spacing.cardPadding,
  borderRadius: radius.lg,
  boxShadow: shadow.card,
  transition: "all 0.2s ease",
};

export const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
  background: colors.card,
  borderRadius: radius.lg,
  overflow: "hidden",
};

export const thtd = {
  padding: "14px",
  borderBottom: `1px solid ${colors.border}`,
  textAlign: "left" as const,
};

export const buttonPrimary = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "10px",
  background: colors.primary,
  color: "white",
  cursor: "pointer",
};

export const buttonSecondary = {
  padding: "10px 16px",
  border: `1px solid ${colors.border}`,
  borderRadius: "10px",
  background: "transparent",
  color: colors.text,
  cursor: "pointer",
};