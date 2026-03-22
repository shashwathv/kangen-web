export const API_URL = import.meta.env.VITE_API_URL || "http://98.95.196.207:8000";

export const KANJI_BG = [
  "漢", "字", "語", "学", "読", "書", "話", "聞",
  "見", "知", "力", "心", "人", "日", "本",
];

export const STEPS = [
  { id: "upload",   label: "Image received" },
  { id: "ocr",      label: "Reading characters" },
  { id: "validate", label: "Validating readings" },
  { id: "enhance",  label: "Enhancing with AI" },
  { id: "build",    label: "Building deck" },
];