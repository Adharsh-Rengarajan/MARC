import { Box, LinearProgress, Typography } from "@mui/material";

interface Props {
  label: string;
  used: number;
  total: number;
  unit?: string;
  warningAt?: number;
  formatter?: (n: number) => string;
}

const ProgressBar = ({ label, used, total, unit = "", warningAt = 0.8, formatter }: Props) => {
  const safeTotal = total > 0 ? total : 0;
  const pct = safeTotal === 0 ? 0 : Math.min(100, (used / safeTotal) * 100);
  const color = pct >= 100 ? "error" : pct >= warningAt * 100 ? "warning" : "success";
  const fmt = formatter || ((n: number) => `${n.toLocaleString()}${unit}`);

  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: "#4b0082", textTransform: "capitalize" }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ color: "#555" }}>
          {fmt(used)} / {fmt(safeTotal)}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        color={color}
        sx={{ height: 8, borderRadius: 4, background: "#eee" }}
      />
    </Box>
  );
};

export default ProgressBar;
