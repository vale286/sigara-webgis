export function formatNumber(num: number | null | undefined, decimals = 0): string {
  if (num === null || num === undefined || isNaN(num)) return "-";
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(num);
}

export function formatCurrency(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(num);
}

export function formatPercent(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return "-";
  const prefix = val > 0 ? "+" : "";
  return `${prefix}${val.toFixed(1)}%`;
}

export function getChoroplethColor(value: number | null, min: number, max: number): string {
  if (value === null || value === undefined || isNaN(value)) return "#CBD5E1";
  if (min === max) return "#2F6F57";
  
  const ratio = Math.min(Math.max((value - min) / (max - min), 0), 1);
  
  // Color ramp from soft mint to dark green accent
  // 0.0 -> #EEF4F1, 0.25 -> #A3D2BD, 0.5 -> #6FA58A, 0.75 -> #2F6F57, 1.0 -> #163A32
  if (ratio < 0.2) return "#D3E8DF";
  if (ratio < 0.4) return "#A2D0BD";
  if (ratio < 0.6) return "#6FA58A";
  if (ratio < 0.8) return "#2F6F57";
  return "#163A32";
}
