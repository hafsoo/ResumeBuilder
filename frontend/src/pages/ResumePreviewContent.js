import React from "react";
// converts "2023-01" -> "Jan 2023"
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
  return `${start} – ${end}`;
};
// ensures links open correctly even if user typed "linkedin.com/..." without https://
const normalizeUrl = (url) => {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const LinkText = ({ value, className }) => (
  <a
    href={normalizeUrl(value)}
    target="_blank"
    rel="noopener noreferrer"
    className={`hover:underline ${className || ""}`}
  >
    {value}
  </a>
);

const Section = ({ title, children, last }) => (
  <div className={last ? "" : "mb-6"}>
    <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-3">
      {title}
    </h2>
    {children}
  </div>
);

const hasContent = (arr) => Array.isArray(arr) && arr.length > 0;

const ResumePreviewContent = ({
  personalInfo = {},
  education = [],
  experience = [],
  skills = [],
  projects = [],
  avatarUrl = "",
}) => {
  return (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold text-slate-900 break-words">
            {personalInfo.fullName || "Your Name"}
          </h1>
          {personalInfo.title && (
            <p className="text-cyan-700 font-medium mt-1 break-words">
              {personalInfo.title}
            </p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-600">
            {personalInfo.email && <span className="break-all">{personalInfo.email}</span>}
            {personalInfo.phone && <span className="break-words">{personalInfo.phone}</span>}
            {personalInfo.address && <span className="break-words">{personalInfo.address}</span>}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-cyan-700">
            {personalInfo.linkedin && (
              <LinkText value={personalInfo.linkedin} className="break-all" />
            )}
            {personalInfo.github && (
              <LinkText value={personalInfo.github} className="break-all" />
            )}
            {personalInfo.portfolio && (
              <LinkText value={personalInfo.portfolio} className="break-all" />
            )}
          </div>
        </div>

        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={personalInfo.fullName || "Profile"}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-[120px] md:h-[120px] rounded-full object-cover border-2 border-cyan-100 shrink-0"
          />
        )}
      </div>

      {personalInfo.summary && (
        <Section title="Summary">
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {personalInfo.summary}
          </p>
        </Section>
      )}

      {hasContent(experience) && (
        <Section title="Experience">
          <div className="space-y-5">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between flex-wrap gap-x-2">
                  <h3 className="font-semibold text-slate-900 text-sm break-words">
                    {exp.position} {exp.company && `— ${exp.company}`}
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
        </Section>
      )}

      {hasContent(education) && (
        <Section title="Education">
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between flex-wrap gap-x-2">
                  <h3 className="font-semibold text-slate-900 text-sm break-words">
                    {edu.degree} {edu.institute && `— ${edu.institute}`}
                  </h3>
                  <span className="text-xs text-slate-400 shrink-0">
                    {formatRange(edu.startDate, edu.endDate, edu.isPresent)}
                  </span>
                </div>
                {edu.cgpa && (
                  <p className="text-slate-600 text-sm mt-0.5 break-words">
                    CGPA: {edu.cgpa}
                  </p>
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
                <h3 className="font-semibold text-slate-900 text-sm break-words">
                  {proj.name}
                  {proj.technologies && (
                    <span className="text-slate-400 font-normal">
                      {" "}
                      · {proj.technologies}
                    </span>
                  )}
                </h3>
                {proj.description && (
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed whitespace-pre-wrap break-words">
                    {proj.description}
                  </p>
                )}
                <div className="flex gap-3 mt-1 text-xs text-cyan-700">
                  {proj.githubLink && (
                    <LinkText value={proj.githubLink} className="break-all" />
                  )}
                  {proj.liveLink && (
                    <LinkText value={proj.liveLink} className="break-all" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {hasContent(skills) && (
        <Section title="Skills" last>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium break-words"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}

      {!personalInfo.summary &&
        !hasContent(experience) &&
        !hasContent(education) &&
        !hasContent(projects) &&
        !hasContent(skills) && (
          <p className="text-slate-400 text-sm italic text-center py-10">
            Start filling the form — your resume will appear here.
          </p>
        )}
    </>
  );
};

export default ResumePreviewContent;
