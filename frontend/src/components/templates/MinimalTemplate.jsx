import React from "react";
import { formatRange, normalizeUrl, hasContent } from "../../utils/resumeTemplateHelpers";

const MinimalTemplate = ({
  personalInfo = {},
  education = [],
  experience = [],
  skills = [],
  projects = [],
  avatarUrl = "",
  accentColor = "#0891b2",
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-0 -mx-8 sm:-mx-12 -mt-10 sm:-mt-12 print:mx-0 print:mt-0 print:min-h-screen">
      {/* ===== LEFT SIDEBAR ===== */}
      <div
        className="px-6 py-10 sm:py-12 text-white print:break-inside-avoid"
        style={{ backgroundColor: accentColor }}
      >
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={personalInfo.fullName || "Profile"}
            className="w-24 h-24 rounded-full object-cover border-4 border-white/30 mx-auto mb-5"
          />
        )}

        <h1 className="text-xl font-bold text-center break-words leading-tight">
          {personalInfo.fullName || "Your Name"}
        </h1>

        {/* Contact */}
        <div className="mt-6">
          <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-70 mb-2 border-b border-white/25 pb-1">
            Contact
          </h2>
          <div className="space-y-1.5 text-xs break-words">
            {personalInfo.email && <p className="break-all">{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.address && <p>{personalInfo.address}</p>}
            {personalInfo.linkedin && (
              <a href={normalizeUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="block underline break-all opacity-90 hover:opacity-100">
                LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a href={normalizeUrl(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="block underline break-all opacity-90 hover:opacity-100">
                GitHub
              </a>
            )}
            {personalInfo.portfolio && (
              <a href={normalizeUrl(personalInfo.portfolio)} target="_blank" rel="noopener noreferrer" className="block underline break-all opacity-90 hover:opacity-100">
                Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Skills */}
        {hasContent(skills) && (
          <div className="mt-6">
            <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-70 mb-2 border-b border-white/25 pb-1">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[11px] px-2 py-1 rounded bg-white/15 break-words"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {hasContent(education) && (
          <div className="mt-6">
            <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-70 mb-2 border-b border-white/25 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, i) => (
                <div key={i} className="text-xs">
                  <p className="font-semibold break-words">{edu.degree}</p>
                  {edu.institute && <p className="opacity-80 break-words">{edu.institute}</p>}
                  <p className="opacity-60 mt-0.5">
                    {formatRange(edu.startDate, edu.endDate, edu.isPresent)}
                  </p>
                  {edu.cgpa && <p className="opacity-80 mt-0.5">CGPA: {edu.cgpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== RIGHT MAIN CONTENT ===== */}
      <div className="px-8 sm:px-10 py-10 sm:py-12 bg-white">
        {personalInfo.summary && (
          <div className="mb-7">
            <h2 className="text-xs font-bold tracking-wider uppercase mb-2" style={{ color: accentColor }}>
              Summary
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {hasContent(experience) && (
          <div className="mb-7">
            <h2 className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: accentColor }}>
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: `${accentColor}40` }}>
                  <div className="flex items-baseline justify-between flex-wrap gap-x-2">
                    <h3 className="font-semibold text-slate-900 text-sm break-words">
                      {exp.position} {exp.company && <span className="text-slate-500 font-normal">· {exp.company}</span>}
                    </h3>
                    <span className="text-xs text-slate-400 shrink-0">
                      {formatRange(exp.startDate, exp.endDate, exp.isPresent)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed whitespace-pre-wrap break-words">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {hasContent(projects) && (
          <div className="mb-7">
            <h2 className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: accentColor }}>
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((proj, i) => (
                <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: `${accentColor}40` }}>
                  <h3 className="font-semibold text-slate-900 text-sm break-words">
                    {proj.name}
                    {proj.technologies && <span className="text-slate-500 font-normal"> · {proj.technologies}</span>}
                  </h3>
                  {proj.description && (
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed whitespace-pre-wrap break-words">
                      {proj.description}
                    </p>
                  )}
                  <div className="flex gap-3 mt-1 text-xs" style={{ color: accentColor }}>
                    {proj.githubLink && (
                      <a href={normalizeUrl(proj.githubLink)} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                        {proj.githubLink}
                      </a>
                    )}
                    {proj.liveLink && (
                      <a href={normalizeUrl(proj.liveLink)} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                        {proj.liveLink}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!personalInfo.summary && !hasContent(experience) && !hasContent(projects) && (
          <p className="text-slate-400 text-sm italic text-center py-10">
            Start filling the form — your resume will appear here.
          </p>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;
