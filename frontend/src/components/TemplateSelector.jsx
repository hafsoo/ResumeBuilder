import React from "react";
import { RESUME_TEMPLATES } from "../data/resumeTemplates";

const TemplateSelector = ({ value, onChange }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Template</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {RESUME_TEMPLATES.map((tpl) => {
          const isActive = value === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onChange(tpl.id)}
              className={`text-left p-4 rounded-xl border-2 transition relative ${
                isActive
                  ? "border-cyan-500 bg-cyan-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {isActive && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
              )}
              <p className="font-semibold text-slate-900 text-sm pr-6">{tpl.name}</p>
              <p className="text-xs text-slate-500 mt-1 italic leading-relaxed">
                {tpl.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;