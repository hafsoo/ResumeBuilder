import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const TEMPLATES = [
  { id: "ats-clean", name: "ATS Clean", tag: "Best for online applications", type: "single" },
  { id: "tabular-pro", name: "Tabular Pro", tag: "Best for professionals", type: "table" },
  { id: "sidebar-photo", name: "Sidebar Photo", tag: "Best for creative roles", type: "sidebar" },
];

function TemplatePreview({ type }) {
  if (type === "table") {
    return (
      <svg viewBox="0 0 220 260" className="tpl-preview" aria-hidden="true">
        <rect x="18" y="18" width="184" height="20" rx="2" className="pv-ink" />
        <rect x="18" y="50" width="90" height="7" rx="2" className="pv-mid" />
        <g className="pv-line">
          <line x1="18" y1="76" x2="202" y2="76" />
          <line x1="18" y1="104" x2="202" y2="104" />
          <line x1="18" y1="132" x2="202" y2="132" />
          <line x1="18" y1="160" x2="202" y2="160" />
          <line x1="74" y1="76" x2="74" y2="188" />
          <line x1="146" y1="76" x2="146" y2="188" />
          <line x1="18" y1="188" x2="202" y2="188" />
        </g>
        <rect x="26" y="84" width="38" height="6" rx="1.5" className="pv-soft" />
        <rect x="82" y="84" width="54" height="6" rx="1.5" className="pv-soft" />
        <rect x="154" y="84" width="38" height="6" rx="1.5" className="pv-soft" />
        <rect x="26" y="112" width="38" height="6" rx="1.5" className="pv-soft" />
        <rect x="82" y="112" width="54" height="6" rx="1.5" className="pv-soft" />
        <rect x="154" y="112" width="38" height="6" rx="1.5" className="pv-soft" />
      </svg>
    );
  }
  if (type === "sidebar") {
    return (
      <svg viewBox="0 0 220 260" className="tpl-preview" aria-hidden="true">
        <rect x="18" y="18" width="60" height="224" rx="3" className="pv-panel" />
        <circle cx="48" cy="52" r="16" className="pv-ink" />
        <rect x="28" y="80" width="40" height="6" rx="1.5" className="pv-onpanel" />
        <rect x="28" y="94" width="30" height="6" rx="1.5" className="pv-onpanel" />
        <rect x="28" y="130" width="40" height="5" rx="1.5" className="pv-onpanel-soft" />
        <rect x="28" y="142" width="34" height="5" rx="1.5" className="pv-onpanel-soft" />
        <rect x="28" y="154" width="38" height="5" rx="1.5" className="pv-onpanel-soft" />
        <rect x="92" y="20" width="110" height="14" rx="2" className="pv-ink" />
        <g className="pv-soft">
          <rect x="92" y="48" width="110" height="6" rx="1.5" />
          <rect x="92" y="62" width="94" height="6" rx="1.5" />
          <rect x="92" y="76" width="100" height="6" rx="1.5" />
        </g>
        <g className="pv-soft">
          <rect x="92" y="106" width="110" height="6" rx="1.5" />
          <rect x="92" y="120" width="80" height="6" rx="1.5" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 220 260" className="tpl-preview" aria-hidden="true">
      <rect x="18" y="18" width="140" height="16" rx="2" className="pv-ink" />
      <rect x="18" y="42" width="90" height="6" rx="1.5" className="pv-mid" />
      <line x1="18" y1="62" x2="202" y2="62" className="pv-rule" />
      <rect x="18" y="76" width="60" height="7" rx="1.5" className="pv-ink-soft" />
      <g className="pv-soft">
        <rect x="18" y="92" width="184" height="6" rx="1.5" />
        <rect x="18" y="106" width="170" height="6" rx="1.5" />
        <rect x="18" y="120" width="176" height="6" rx="1.5" />
      </g>
      <rect x="18" y="146" width="60" height="7" rx="1.5" className="pv-ink-soft" />
      <g className="pv-soft">
        <rect x="18" y="162" width="184" height="6" rx="1.5" />
        <rect x="18" y="176" width="150" height="6" rx="1.5" />
      </g>
      <rect x="18" y="202" width="60" height="7" rx="1.5" className="pv-ink-soft" />
      <g className="pv-soft">
        <rect x="18" y="218" width="184" height="6" rx="1.5" />
        <rect x="18" y="232" width="160" height="6" rx="1.5" />
      </g>
    </svg>
  );
}

export default function TemplatesSection() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);
  const scrollTimeout = useRef(null);

  const handleSliderScroll = useCallback(() => {
    if (!sliderRef.current) return;
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const el = sliderRef.current;
      const cardWidth = el.firstChild ? el.firstChild.getBoundingClientRect().width + 16 : 1;
      const idx = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(TEMPLATES.length - 1, idx)));
    }, 60);
  }, []);

  useEffect(() => () => clearTimeout(scrollTimeout.current), []);

  const scrollToIndex = (idx) => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.children[idx];
    if (card) el.scrollTo({ left: card.offsetLeft - 20, behavior: "smooth" });
    setActiveIndex(idx);
  };

  return (
    <section className="tpl-section">
      <style>{CSS}</style>

      <div className="tpl-heading">
        <span className="tpl-eyebrow">03 templates, one match per role</span>
        <h2 className="tpl-title">Choose a template</h2>
        <p className="tpl-sub">Pick a layout, customize it, and download your resume.</p>
      </div>

      <div className="tpl-slider" ref={sliderRef} onScroll={handleSliderScroll}>
        {TEMPLATES.map((tpl) => (
          <article key={tpl.id} className="tpl-card">
            <div className="tpl-card-inner">
              <div className="tpl-scan-wrap">
                <TemplatePreview type={tpl.type} />
                <span className="tpl-scanline" aria-hidden="true" />
                <span className="tpl-stamp" aria-hidden="true">MATCH</span>
              </div>

              <div className="tpl-meta">
                <h3 className="tpl-name">{tpl.name}</h3>
                <p className="tpl-tag">{tpl.tag}</p>
              </div>

              <button type="button" className="tpl-cta" onClick={() => navigate(`/editor/${tpl.id}`)}>
                Customize <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="tpl-dots" role="tablist" aria-label="Select template">
        {TEMPLATES.map((tpl, i) => (
          <button
            key={tpl.id}
            className={`tpl-dot ${activeIndex === i ? "is-active" : ""}`}
            onClick={() => scrollToIndex(i)}
            role="tab"
            aria-selected={activeIndex === i}
            aria-label={`Show ${tpl.name}`}
          />
        ))}
      </div>
    </section>
  );
}

const CSS = `
.tpl-section {
  --paper: #F8F9FC;
  --card: #FFFFFF;
  --ink: #111827;
  --ink-soft: #6B7280;
  --mid: #9CA3AF;
  --line: #E5E7EB;
  --purple: #6C63FF;
  --purple-soft: #EEEDFF;
  --teal: #17A2B8;
  --teal-soft: #E3F6F9;
  padding: 88px 24px 96px;
  background: var(--paper);
  text-align: center;
}
.tpl-heading { max-width: 560px; margin: 0 auto 52px; }
.tpl-eyebrow {
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--teal); margin-bottom: 14px;
}
.tpl-title {
  font-family: 'Inter', -apple-system, sans-serif;
  font-weight: 800; font-size: clamp(28px, 4vw, 38px);
  color: var(--ink); margin: 0 0 10px; letter-spacing: -0.01em;
}
.tpl-sub { font-family: 'Inter', sans-serif; color: var(--ink-soft); font-size: 16px; margin: 0; }

.tpl-slider { display: flex; gap: 28px; justify-content: center; padding: 30px 0 10px; }
.tpl-card {
  width: 268px; flex: 0 0 auto;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(17,24,39,0.04), 0 10px 24px rgba(17,24,39,0.06);
  transition: transform 320ms cubic-bezier(.2,.8,.2,1), box-shadow 320ms ease, border-color 320ms ease;
  position: relative;
}
.tpl-card:hover, .tpl-card:focus-within {
  transform: translateY(-6px);
  border-color: var(--purple);
  box-shadow: 0 4px 10px rgba(108,99,255,0.08), 0 20px 36px rgba(108,99,255,0.14);
}
.tpl-card-inner { padding: 22px 22px 24px; text-align: left; }

.tpl-scan-wrap { position: relative; overflow: hidden; border: 1px solid var(--line); border-radius: 10px; background: #fff; }
.tpl-preview { display: block; width: 100%; height: auto; }
.pv-ink { fill: var(--ink); }
.pv-ink-soft { fill: var(--purple); }
.pv-mid { fill: var(--mid); opacity: 0.7; }
.pv-soft rect { fill: var(--line); }
.pv-rule { stroke: var(--line); stroke-width: 2; }
.pv-panel { fill: var(--purple-soft); }
.pv-onpanel { fill: var(--purple); opacity: 0.9; }
.pv-onpanel-soft { fill: var(--ink-soft); opacity: 0.55; }
.pv-line line { stroke: var(--line); stroke-width: 2; }

.tpl-scanline {
  position: absolute; left: 0; right: 0; top: 0; height: 34%;
  background: linear-gradient(to bottom, rgba(23,162,184,0) 0%, rgba(23,162,184,0.28) 50%, rgba(23,162,184,0) 100%);
  transform: translateY(-120%); opacity: 0; pointer-events: none;
}
.tpl-card:hover .tpl-scanline, .tpl-card:focus-within .tpl-scanline { animation: scan-sweep 1100ms ease-in-out 1; }
@keyframes scan-sweep { 0% { transform: translateY(-120%); opacity: 0.9; } 100% { transform: translateY(340%); opacity: 0; } }

.tpl-stamp {
  position: absolute; top: 10px; right: -34px; width: 120px; text-align: center; padding: 3px 0;
  font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 0.1em; font-weight: 700;
  color: #fff; background: var(--purple); transform: rotate(30deg) scale(0.85);
  opacity: 0; transition: opacity 200ms ease, transform 200ms ease;
}
.tpl-card:hover .tpl-stamp, .tpl-card:focus-within .tpl-stamp { opacity: 1; transform: rotate(30deg) scale(1); }

.tpl-meta { margin-top: 16px; }
.tpl-name { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 18px; color: var(--ink); margin: 0 0 4px; }
.tpl-tag { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; color: var(--mid); margin: 0; }

.tpl-cta {
  margin-top: 16px; width: 100%;
  font-family: 'Inter', sans-serif; font-weight: 700; font-size: 14px;
  color: #fff; background: var(--purple); border: none; border-radius: 10px;
  padding: 11px 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: background 180ms ease, transform 120ms ease;
}
.tpl-cta:hover { background: #5A50E0; }
.tpl-cta:active { transform: scale(0.97); }
.tpl-cta:focus-visible, .tpl-dot:focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }

.tpl-dots { display: none; }

@media (max-width: 768px) {
  .tpl-section { padding: 56px 0 64px; }
  .tpl-heading { padding: 0 24px; margin-bottom: 34px; }
  .tpl-slider {
    justify-content: flex-start; overflow-x: auto; scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch; padding: 20px 24px 14px; gap: 16px; scrollbar-width: none;
  }
  .tpl-slider::-webkit-scrollbar { display: none; }
  .tpl-card { width: 78vw; max-width: 300px; scroll-snap-align: center; }
  .tpl-stamp { opacity: 1; transform: rotate(30deg) scale(1); }
  .tpl-dots { display: flex; justify-content: center; gap: 8px; margin-top: 8px; }
  .tpl-dot { width: 7px; height: 7px; border-radius: 50%; border: none; padding: 0; background: var(--line); cursor: pointer; }
  .tpl-dot.is-active { background: var(--purple); width: 20px; border-radius: 4px; }
}

@media (prefers-reduced-motion: reduce) {
  .tpl-card, .tpl-scanline, .tpl-stamp, .tpl-cta { transition: none !important; animation: none !important; }
}
`;

/*
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TEMPLATES = [
  { id: "ats-clean", name: "ATS Clean", tag: "Best for online applications" },
  { id: "tabular-pro", name: "Tabular Pro", tag: "Best for professionals" },
  { id: "sidebar-photo", name: "Sidebar Photo", tag: "Best for creative roles" },
];

export default function TemplatesSection() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{ padding: "80px 24px", background: "#F7F6F2", textAlign: "center" }}>
      <h2 style={{ fontSize: 32, marginBottom: 8, color: "#1F2933" }}>
        Choose a template
      </h2>
      <p style={{ color: "#5B6570", marginBottom: 40 }}>
        Pick a layout, customize it, and download your resume.
      </p>

      <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
        {TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            onMouseEnter={() => setHovered(tpl.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: 260,
              height: 340,
              borderRadius: 12,
              background: "#fff",
              border: "1px solid #E3E8E6",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
            }}
          >
            
            <div style={{ padding: 20 }}>
              <div style={{ width: "60%", height: 16, background: "#1F2933", borderRadius: 3, marginBottom: 10 }} />
              <div style={{ width: "90%", height: 8, background: "#DCE2E0", borderRadius: 3, marginBottom: 8 }} />
              <div style={{ width: "80%", height: 8, background: "#DCE2E0", borderRadius: 3, marginBottom: 8 }} />
              <div style={{ width: "70%", height: 8, background: "#DCE2E0", borderRadius: 3 }} />
            </div>

            {hovered === tpl.id && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(15,30,27,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => navigate(`/editor/${tpl.id}`)}
                  style={{
                    background: "#E8635A",
                    color: "#fff",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: 999,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Customize
                </button>
              </div>
            )}

            <div style={{ padding: "12px 0" }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>{tpl.name}</h3>
              <p style={{ margin: 0, fontSize: 12, color: "#7A8288" }}>{tpl.tag}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

*/