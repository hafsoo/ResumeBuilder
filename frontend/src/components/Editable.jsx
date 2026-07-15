import React, { useRef, useEffect, useState } from "react";

export default function Editable({ value, onSave, style, placeholder, tag = "div" }) {
  const ref = useRef(null);
  const Tag = tag;
  const [isEmpty, setIsEmpty] = useState(!value || value.trim() === "");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== (value || "")) {
      ref.current.innerText = value || "";
    }
    setIsEmpty(!value || value.trim() === "");
  }, [value]);

  const handleInput = (e) => {
    setIsEmpty(e.currentTarget.innerText.trim() === "");
  };

  const handleBlur = (e) => {
    const text = e.currentTarget.innerText.trim();
    onSave(text);
    setIsEmpty(text === "");
    setIsFocused(false);
  };

  const wrapperDisplay = style?.display || (tag === "span" ? "inline-block" : "block");

  return (
    <span
      style={{
        position: "relative",
        display: wrapperDisplay,
        minWidth: 30,
        marginBottom: wrapperDisplay === "block" ? 2 : 0,
      }}
    >
      <Tag
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        style={{
          outline: "none",
          cursor: "text",
          minHeight: "1.3em",
          display: "block",
          padding: "1px 4px",
          borderRadius: 3,
          border: isEmpty ? "1px dashed #c7d2cc" : "1px solid transparent",
          background: isFocused ? "rgba(15,108,92,0.08)" : "transparent",
          transition: "background 0.15s ease, border-color 0.15s ease",
          ...style,
        }}
      />
      {isEmpty && !isFocused && (
        <span
          style={{
            position: "absolute",
            left: 6,
            top: 2,
            color: "#a3aab0",
            pointerEvents: "none",
            fontStyle: "italic",
            fontSize: style?.fontSize || 13,
            fontWeight: style?.fontWeight || 400,
            whiteSpace: "nowrap",
          }}
        >
          {placeholder}
        </span>
      )}
    </span>
  );
}