import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useResume } from "../context/ResumeContext";

import ATSTemplate from "../components/templates/ATSTemplate";
import TabularTemplate from "../components/templates/TabularTemplate";
import SidebarTemplate from "../components/templates/SidebarTemplate";

const TEMPLATE_MAP = {
  "ats-clean": ATSTemplate,
  "tabular-pro": TabularTemplate,
  "sidebar-photo": SidebarTemplate,
};

const RESUME_WIDTH = 800;

export default function EditorPage() {
  const { templateId } = useParams();
  const resumeContext = useResume();
  const previewRef = useRef(null);
  const wrapperRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(null);

  useEffect(() => {
    function updateScale() {
      const viewportWidth = window.innerWidth;
      // leave a little breathing room on small screens
      const sidePadding = viewportWidth < 600 ? 24 : 48;
      const availableWidth = viewportWidth - sidePadding;
      const nextScale = Math.min(1, availableWidth / RESUME_WIDTH);
      setScale(nextScale);

      if (previewRef.current) {
        const naturalHeight = previewRef.current.getBoundingClientRect().height / scale || previewRef.current.scrollHeight;
        setScaledHeight(previewRef.current.scrollHeight * nextScale);
      }
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  // Recalculate height once content renders/changes (resume text edits, etc.)
  useEffect(() => {
    if (!previewRef.current) return;
    const ro = new ResizeObserver(() => {
      setScaledHeight(previewRef.current.scrollHeight * scale);
    });
    ro.observe(previewRef.current);
    return () => ro.disconnect();
  }, [scale]);

  if (!resumeContext) {
    return <div style={{ padding: 40 }}>Loading resume data...</div>;
  }

  const TemplateComponent = TEMPLATE_MAP[templateId] || ATSTemplate;

  const handleDownload = () => {
    window.print();
  };

  return (
    <div style={styles.page}>
      <style>{CSS}</style>

      <div className="no-export editor-toolbar">
        <span className="editor-hint">
          Click any text on the resume below to edit it directly
        </span>
        <button onClick={handleDownload} className="editor-download-btn">
          Download PDF
        </button>
      </div>

      <div
        className="resume-scale-wrapper"
        ref={wrapperRef}
        style={{ height: scaledHeight ? `${scaledHeight}px` : "auto" }}
      >
        <div
          ref={previewRef}
          id="resume-print-area"
          className="resume-print-area"
          style={{
            width: RESUME_WIDTH,
            transform: `scale(${scale})`,
          }}
        >
          <TemplateComponent />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#E7EDEC",
    minHeight: "100vh",
    padding: "24px 0",
  },
};

const CSS = `
.editor-toolbar {
  max-width: 800px;
  margin: 0 auto 16px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.editor-hint {
  font-size: 13px;
  color: #5B6570;
  font-family: Inter, sans-serif;
}
.editor-download-btn {
  background: #0F6C5C;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  font-family: Inter, sans-serif;
}

.resume-scale-wrapper {
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.resume-print-area {
  transform-origin: top center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  background: #fff;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .editor-toolbar {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  .editor-hint {
    order: 2;
    font-size: 12px;
  }
  .editor-download-btn {
    order: 1;
    width: 100%;
  }
}

/* Keep print/PDF output at full, unscaled resolution */
@media print {
  .no-export { display: none !important; }
  .resume-scale-wrapper {
    height: auto !important;
    overflow: visible;
  }
  .resume-print-area {
    transform: none !important;
    box-shadow: none !important;
  }
}
`;

/*
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useResume } from "../context/ResumeContext";

import ATSTemplate from "../components/templates/ATSTemplate";
import TabularTemplate from "../components/templates/TabularTemplate";
import SidebarTemplate from "../components/templates/SidebarTemplate";

const TEMPLATE_MAP = {
  "ats-clean": ATSTemplate,
  "tabular-pro": TabularTemplate,
  "sidebar-photo": SidebarTemplate,
};

export default function EditorPage() {
  const { templateId } = useParams();
  const resumeContext = useResume();
  const previewRef = useRef(null);

  if (!resumeContext) {
    return <div style={{ padding: 40 }}>Loading resume data...</div>;
  }

  const TemplateComponent = TEMPLATE_MAP[templateId] || ATSTemplate;

  const handleDownload = () => {
    window.print();
  };

  return (
    <div style={{ background: "#E7EDEC", minHeight: "100vh", padding: "24px 0" }}>
      <div
        className="no-export"
        style={{
          maxWidth: 800,
          margin: "0 auto 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, color: "#5B6570" }}>
          Click any text on the resume below to edit it directly
        </span>
        <button
          onClick={handleDownload}
          style={{
            background: "#0F6C5C",
            color: "#fff",
            border: "none",
            padding: "10px 24px",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Download PDF
        </button>
      </div>

      <div
        ref={previewRef}
        id="resume-print-area"
        style={{
          width: 800,
          margin: "0 auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          background: "#fff",
        }}
      >
        <TemplateComponent />
      </div>
    </div>
  );
}
*/