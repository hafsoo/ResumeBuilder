import React from "react";

// list of accent colors the user can pick for their resume's headings/links
export const ACCENT_COLORS = [
  { name: "Blue", value: "#2563eb" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Green", value: "#059669" },
  { name: "Red", value: "#dc2626" },
  { name: "Orange", value: "#ea580c" },
  { name: "Teal", value: "#0d9488" },
  { name: "Pink", value: "#db2777" },
  { name: "Gray", value: "#4b5563" },
  { name: "Black", value: "#111827" },
  //{ name: "White", value: "#FFFFFF" },
];

const AccentPicker = ({ value, onChange }) => (
  <div className="flex items-center gap-2 flex-wrap">
    <span className="text-xs font-semibold text-slate-500 mr-1">Accent</span>
    {ACCENT_COLORS.map((c) => {
      const selected = value === c.value;
      return (
        <button
          key={c.value}
          type="button"
          title={c.name}
          onClick={() => onChange(c.value)}
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition"
          style={{
            backgroundColor: c.value,
            // selected color gets a white ring + colored outer ring
            boxShadow: selected ? `0 0 0 2px white, 0 0 0 4px ${c.value}` : "none",
          }}
        >
          {selected && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </button>
      );
    })}
  </div>
);

export default AccentPicker;