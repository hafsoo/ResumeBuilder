import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { analyzeResumePdf } from "../redux/actions/ats";

const ScoreRing = ({ label, score }) => {
  const color = score >= 75 ? "#059669" : score >= 50 ? "#d97706" : "#dc2626";
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold"
        style={{ background: `conic-gradient(${color} ${score * 3.6}deg, #e2e8f0 0deg)` }}
      >
        <div className="w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center">
          <span style={{ color }}>{score}</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-700 mt-2">{label}</p>
    </div>
  );
};

const ListCard = ({ title, items, tone }) => {
  const tones = {
    good: { bg: "bg-emerald-50", text: "text-emerald-700", icon: "✓" },
    bad: { bg: "bg-rose-50", text: "text-rose-700", icon: "✕" },
    tip: { bg: "bg-cyan-50", text: "text-cyan-700", icon: "→" },
  };
  const t = tones[tone];
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <h3 className="font-bold text-slate-900 mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className={`flex items-start gap-2 text-sm ${t.text}`}>
            <span className={`w-5 h-5 rounded-full ${t.bg} flex items-center justify-center shrink-0 text-xs font-bold`}>
              {t.icon}
            </span>
            <span className="text-slate-600">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ATSChecker = () => {
  const dispatch = useDispatch();
  const [fileName, setFileName] = useState("");
  const [fileBase64, setFileBase64] = useState(""); // base64 string state mein rakhte hain
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  //  FileReader se base64 banate hain
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      toast.error("PDF must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setFileBase64(reader.result); // "data:application/pdf;base64,...."
        setFileName(selected.name);
        setAnalysis(null);
      }
    };
    reader.readAsDataURL(selected);
  };

  const handleAnalyze = async () => {
    if (!fileBase64) {
      toast.error("Please choose a PDF resume first");
      return;
    }
    setAnalyzing(true);
    try {
      const result = await dispatch(analyzeResumePdf(fileBase64));
      setAnalysis(result.analysis);
      toast.success("Analysis complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          AI Resume Checker
        </h1>
        <p className="text-slate-500 text-sm mt-1 mb-8">
          Upload a PDF resume and get an instant ATS score, quality score, and improvement suggestions.
        </p>

        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center mb-8">
          <label htmlFor="pdf-upload" className="cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-cyan-50 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0e7490" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p className="font-semibold text-slate-900 mb-1">
              {fileName || "Click to upload your resume PDF"}
            </p>
            <p className="text-xs text-slate-400">PDF only, up to 5MB</p>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            onClick={handleAnalyze}
            disabled={analyzing || !fileBase64}
            className="mt-6 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {analysis && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-wrap justify-center gap-10">
              <ScoreRing label="ATS Score" score={analysis.atsScore} />
              <ScoreRing label="Resume Score" score={analysis.resumeScore} />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <ListCard title="Strengths" items={analysis.strengths || []} tone="good" />
              <ListCard title="Weaknesses" items={analysis.weaknesses || []} tone="bad" />
            </div>

            <ListCard title="Suggestions" items={analysis.suggestions || []} tone="tip" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSChecker;