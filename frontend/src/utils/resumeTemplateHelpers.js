export const formatMonth = (value) => {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month] = match;
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

export const formatRange = (startDate, endDate, isPresent) => {
  const start = formatMonth(startDate);
  const end = isPresent ? "Present" : formatMonth(endDate);
  if (!start && !end) return "";
  if (!end) return start;
  return `${start} – ${end}`;
};

export const normalizeUrl = (url) => {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
};

export const getContrastText = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#111827" : "#ffffff";
};

export const darkenColor = (hex, amount = 0.25) => {
  const { r, g, b } = hexToRgb(hex);
  const dr = Math.round(r * (1 - amount));
  const dg = Math.round(g * (1 - amount));
  const db = Math.round(b * (1 - amount));
  return `rgb(${dr}, ${dg}, ${db})`;
};

export const hasContent = (arr) => Array.isArray(arr) && arr.length > 0;

export const toBullets = (text) => {
  if (!text) return [];
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : [text];
};