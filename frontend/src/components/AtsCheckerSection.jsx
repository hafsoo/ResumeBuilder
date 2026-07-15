import React from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiCheckCircle, FiTrendingUp } from "react-icons/fi";

const MiniScoreRing = ({ score, label, color }) => (
  <div className="flex flex-col items-center">
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center"
      style={{ background: `conic-gradient(${color} ${score * 3.6}deg, #e2e8f0 0deg)` }}
    >
      <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center">
        <span className="text-sm font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
    <p className="text-[11px] font-semibold text-slate-500 mt-1.5">{label}</p>
  </div>
);

const AtsCheckerSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 md:px-16 bg-slate-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* left: heading + copy + CTA */}
        <div>
          <p className="text-xs font-bold tracking-wider text-cyan-600 uppercase mb-3">
            AI-Powered
          </p>
          <h2 className="text-3xl md:text-[40px] font-extrabold leading-tight text-slate-900 mb-5">
            Know your resume's{" "}
            <span className="text-cyan-600">ATS score</span> before you apply
          </h2>
          <p className="text-slate-500 text-base leading-relaxed mb-8">
            Upload any resume as a PDF and our AI checker instantly scores it
            for applicant tracking systems, highlights strengths and
            weaknesses, and gives you specific suggestions to improve your
            chances of getting noticed.
          </p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <span className="w-6 h-6 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
                <FiCheckCircle size={13} className="text-cyan-600" />
              </span>
              Instant ATS and resume quality scores
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <span className="w-6 h-6 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
                <FiCheckCircle size={13} className="text-cyan-600" />
              </span>
              Clear strengths, weaknesses, and fixes
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <span className="w-6 h-6 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
                <FiCheckCircle size={13} className="text-cyan-600" />
              </span>
              Works with any resume, not just ones built here
            </li>
          </ul>

          <button
            onClick={() => navigate("/ats-checker")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition"
          >
            <FiUpload size={16} />
            Check my resume free
          </button>
        </div>

        {/* right: decorative preview mockup */}
        <div className="relative">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-bold text-slate-900">Analysis result</p>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Complete
              </span>
            </div>

            <div className="flex justify-center gap-8 mb-6">
              <MiniScoreRing score={87} label="ATS Score" color="#059669" />
              <MiniScoreRing score={92} label="Resume Score" color="#0891b2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <span className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600 font-bold mt-0.5">
                  ✓
                </span>
                <span className="text-slate-500">Strong action verbs used throughout</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <span className="w-4 h-4 rounded-full bg-cyan-50 flex items-center justify-center shrink-0 text-cyan-600 font-bold mt-0.5">
                  →
                </span>
                <span className="text-slate-500">Add more measurable achievements</span>
              </div>
            </div>
          </div>

          {/* floating badge */}
          <div className="absolute -top-4 -right-4 bg-cyan-600 text-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
            <FiTrendingUp size={14} />
            <span className="text-xs font-semibold">Free to try</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AtsCheckerSection;