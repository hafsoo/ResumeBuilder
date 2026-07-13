import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { loadSingleResume } from "../redux/actions/resume";
import SendEmailModal from "../components/SendEmailModal"; // NAYA IMPORT

const formatMonth = (value) => {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month] = match;
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

const formatRange = (startDate, endDate, isPresent) => {
  const start = formatMonth(startDate);
  const end = isPresent ? "Present" : formatMonth(endDate);
  if (!start && !end) return "";
  if (!end) return start;
  return `${start} — ${end}`;
};

const normalizeUrl = (url) => {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
};

const getContrastText = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#111827" : "#ffffff";
};

const darkenColor = (hex, amount = 0.25) => {
  const { r, g, b } = hexToRgb(hex);
  const dr = Math.round(r * (1 - amount));
  const dg = Math.round(g * (1 - amount));
  const db = Math.round(b * (1 - amount));
  return `rgb(${dr}, ${dg}, ${db})`;
};

const LinkChip = ({ label, value, textColor }) => (
  <a
    href={normalizeUrl(value)}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium break-all hover:opacity-80 transition"
    style={{
      backgroundColor:
        textColor === "#ffffff" ? "rgba(255,255,255,0.16)" : "rgba(17,24,39,0.08)",
      color: textColor,
    }}
  >
    <span className="opacity-70">{label}:</span> {value}
  </a>
);

const ResumePreview = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailModalOpen, setEmailModalOpen] = useState(false); // NAYA STATE

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await dispatch(loadSingleResume(id));
        setResume(data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Could not load resume");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">
          Loading preview...
        </div>
      </div>
    );
  }

  if (!resume) return null;

  const {
    personalInfo = {},
    education = [],
    experience = [],
    skills = [],
    projects = [],
  } = resume;

  const accentColor = resume.accentColor || "#0891b2";
  const textColor = getContrastText(accentColor);
  const chipBorder =
    textColor === "#ffffff" ? "rgba(255,255,255,0.35)" : "rgba(17,24,39,0.15)";

  const hasContent = (arr) => Array.isArray(arr) && arr.length > 0;
  const isEmpty =
    !personalInfo.summary &&
    !hasContent(experience) &&
    !hasContent(education) &&
    !hasContent(projects) &&
    !hasContent(skills);

  const toBullets = (text) => {
    if (!text) return [];
    const lines = text
      .split("\n")
      .map((l) => l.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);
    return lines.length > 0 ? lines : [text];
  };

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      <div className="print:hidden">
        <Header />
      </div>

      {/* ===== NAYA: Send via Email button, Print button ke sath ek gap-3 wrapper mein ===== */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-4 flex items-center justify-between print:hidden">
        <button
          onClick={() => navigate(`/resume/${id}/edit`)}
          className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
        >
          ← Back to edit
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEmailModalOpen(true)}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-cyan-700 border border-cyan-200 hover:bg-cyan-50 transition"
          >
            Send via Email
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 print:p-0 print:max-w-none">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm print:shadow-none print:border-0 print:rounded-none overflow-hidden">
          {/* ===== colored header banner ===== */}
          <div
            className="px-8 py-8 sm:px-14 sm:py-10"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${darkenColor(accentColor)})`,
              color: textColor,
            }}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <h1 className="text-4xl font-bold tracking-tight break-words" style={{ color: textColor }}>
                  {personalInfo.fullName || "Your Name"}
                </h1>

                {(personalInfo.email || personalInfo.phone) && (
                  <p className="mt-3 text-sm break-words opacity-90">
                    {[personalInfo.email, personalInfo.phone].filter(Boolean).join("   ·   ")}
                  </p>
                )}
                {personalInfo.address && (
                  <p className="mt-1 text-sm leading-relaxed max-w-sm break-words opacity-90">
                    {personalInfo.address}
                  </p>
                )}

                {(personalInfo.linkedin || personalInfo.github || personalInfo.portfolio) && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {personalInfo.linkedin && (
                      <LinkChip label="LinkedIn" value={personalInfo.linkedin} textColor={textColor} />
                    )}
                    {personalInfo.github && (
                      <LinkChip label="GitHub" value={personalInfo.github} textColor={textColor} />
                    )}
                    {personalInfo.portfolio && (
                      <LinkChip label="Portfolio" value={personalInfo.portfolio} textColor={textColor} />
                    )}
                  </div>
                )}
              </div>

              {resume?.avatar?.url && (
                <img
                  src={resume.avatar.url}
                  alt={personalInfo.fullName || "Profile"}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 shrink-0"
                  style={{ borderColor: chipBorder }}
                />
              )}
            </div>
          </div>

          {/* === Summary/Experience/Education/Projects/Skills ===== */}
          <div className="px-8 py-8 sm:px-14 sm:py-10">
            {isEmpty && (
              <p className="text-slate-400 text-sm italic text-center py-10">
                This resume is empty so far — head back to editing to add your details.
              </p>
            )}

            {personalInfo.summary && (
              <Section title="Summary">
                <p className="text-slate-700 text-sm leading-relaxed break-words">
                  {personalInfo.summary}
                </p>
              </Section>
            )}

            {hasContent(experience) && (
              <Section title="Experience">
                <div className="space-y-4">
                  {experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex items-baseline justify-between flex-wrap gap-x-2">
                        <h3 className="font-semibold text-slate-900 text-[15px] break-words">
                          {exp.position}
                          {exp.company && (
                            <span className="text-slate-500 font-normal"> · {exp.company}</span>
                          )}
                        </h3>
                        <span className="text-xs font-medium text-slate-400 shrink-0">
                          {formatRange(exp.startDate, exp.endDate, exp.isPresent)}
                        </span>
                      </div>
                      {exp.description && (
                        <ul className="mt-1.5 space-y-1 list-disc list-outside pl-4 marker:text-cyan-500">
                          {toBullets(exp.description).map((line, j) => (
                            <li key={j} className="text-slate-600 text-sm leading-relaxed break-words">
                              {line}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {hasContent(education) && (
              <Section title="Education">
                <div className="space-y-3">
                  {education.map((edu, i) => (
                    <div key={i}>
                      <div className="flex items-baseline justify-between flex-wrap gap-x-2">
                        <h3 className="font-semibold text-slate-900 text-[15px] break-words">
                          {edu.degree}
                          {edu.institute && (
                            <span className="text-slate-500 font-normal"> · {edu.institute}</span>
                          )}
                        </h3>
                        <span className="text-xs font-medium text-slate-400 shrink-0">
                          {formatRange(edu.startDate, edu.endDate, edu.isPresent)}
                        </span>
                      </div>
                      {edu.cgpa && (
                        <p className="text-slate-600 text-sm mt-0.5 break-words">CGPA: {edu.cgpa}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {hasContent(projects) && (
              <Section title="Projects">
                <div className="space-y-4">
                  {projects.map((proj, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-slate-900 text-[15px] break-words">
                        {proj.name}
                        {proj.technologies && (
                          <span className="text-slate-500 font-normal"> · {proj.technologies}</span>
                        )}
                      </h3>
                      {proj.description && (
                        <ul className="mt-1.5 space-y-1 list-disc list-outside pl-4 marker:text-cyan-500">
                          {toBullets(proj.description).map((line, j) => (
                            <li key={j} className="text-slate-600 text-sm leading-relaxed break-words">
                              {line}
                            </li>
                          ))}
                        </ul>
                      )}
                      {(proj.githubLink || proj.liveLink) && (
                        <div className="mt-1.5 space-y-0.5">
                          {proj.githubLink && (
                            <p className="text-xs">
                              <span className="text-slate-400 font-medium">Code: </span>
                              <a href={normalizeUrl(proj.githubLink)} target="_blank" rel="noopener noreferrer" className="text-cyan-600 font-medium break-all hover:underline">
                                {proj.githubLink}
                              </a>
                            </p>
                          )}
                          {proj.liveLink && (
                            <p className="text-xs">
                              <span className="text-slate-400 font-medium">Live: </span>
                              <a href={normalizeUrl(proj.liveLink)} target="_blank" rel="noopener noreferrer" className="text-cyan-600 font-medium break-all hover:underline">
                                {proj.liveLink}
                              </a>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {hasContent(skills) && (
              <Section title="Skills" last>
                <div className="flex flex-wrap gap-x-3 gap-y-2">
                  {skills.map((skill, i) => (
                    <span key={skill} className="text-slate-700 text-sm break-words">
                      {skill}
                      {i < skills.length - 1 && <span className="text-slate-300 ml-3">|</span>}
                    </span>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>

      <SendEmailModal
        resumeId={id}
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />
    </div>
  );
};

const Section = ({ title, children, last }) => (
  <div className={last ? "" : "mb-5"}>
    <h2 className="text-xs font-bold tracking-[0.15em] text-slate-900 uppercase pb-1.5 mb-3 border-b border-slate-200">
      {title}
    </h2>
    {children}
  </div>
);

export default ResumePreview;