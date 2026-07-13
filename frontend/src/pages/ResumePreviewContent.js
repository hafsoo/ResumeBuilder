import React from "react";

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

const normalizeUrl = (url) => {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

// hex ("#2563eb") ko { r, g, b } mein convert
const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
};

// background ki brightness dekh kar white ya dark text decide karta hai
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

const LinkChip = ({ value, textColor }) => (
  <a
    href={normalizeUrl(value)}
    target="_blank"
    rel="noopener noreferrer"
    className="px-2.5 py-1 rounded-full text-xs font-medium break-all hover:opacity-80 transition"
    style={{
      backgroundColor:
        textColor === "#ffffff" ? "rgba(255,255,255,0.16)" : "rgba(17,24,39,0.08)",
      color: textColor,
    }}
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
  accentColor = "#0891b2",
}) => {
  const textColor = getContrastText(accentColor);
  const chipBorder =
    textColor === "#ffffff" ? "rgba(255,255,255,0.35)" : "rgba(17,24,39,0.15)";

  return (
    <>
      
      <div
        className="-mx-8 sm:-mx-12 -mt-10 sm:-mt-12 mb-8 px-8 sm:px-12 pt-10 sm:pt-12 pb-8 rounded-t-2xl print:rounded-none"
        style={{
          background: `linear-gradient(135deg, ${accentColor}, ${darkenColor(accentColor)})`,
          color: textColor,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold break-words" style={{ color: textColor }}>
              {personalInfo.fullName || "Your Name"}
            </h1>
            {personalInfo.title && (
              <p className="font-medium mt-1 break-words opacity-90">
                {personalInfo.title}
              </p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm opacity-90">
              {personalInfo.email && <span className="break-all">{personalInfo.email}</span>}
              {personalInfo.phone && <span className="break-words">{personalInfo.phone}</span>}
              {personalInfo.address && <span className="break-words">{personalInfo.address}</span>}
            </div>

            {(personalInfo.linkedin || personalInfo.github || personalInfo.portfolio) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {personalInfo.linkedin && <LinkChip value={personalInfo.linkedin} textColor={textColor} />}
                {personalInfo.github && <LinkChip value={personalInfo.github} textColor={textColor} />}
                {personalInfo.portfolio && <LinkChip value={personalInfo.portfolio} textColor={textColor} />}
              </div>
            )}
          </div>

          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={personalInfo.fullName || "Profile"}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-4 shrink-0"
              style={{ borderColor: chipBorder }}
            />
          )}
        </div>
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
        </Section>
      )}

      {hasContent(skills) && (
        <Section title="Skills" last>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full text-xs font-medium break-words"
                style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
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

/*
import React from "react";

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
  accentColor = "#0891b2", // NAYA PROP: default cyan, agar parent kuch na bheje
}) => {
  return (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold text-slate-900 break-words">
            {personalInfo.fullName || "Your Name"}
          </h1>
          {personalInfo.title && (
            // NAYA: hardcoded text-cyan-700 ki jagah, accentColor inline style se
            <p className="font-medium mt-1 break-words" style={{ color: accentColor }}>
              {personalInfo.title}
            </p>
          )}
         
          <div className="h-1 w-14 rounded-full mt-2" style={{ backgroundColor: accentColor }} />
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-600">
            {personalInfo.email && <span className="break-all">{personalInfo.email}</span>}
            {personalInfo.phone && <span className="break-words">{personalInfo.phone}</span>}
            {personalInfo.address && <span className="break-words">{personalInfo.address}</span>}
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm" style={{ color: accentColor }}>
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
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-[120px] md:h-[120px] rounded-full object-cover border-2 shrink-0"
            style={{ borderColor: accentColor }} // NAYA: photo ke border ka color bhi accent se
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
     
                <div className="flex gap-3 mt-1 text-xs" style={{ color: accentColor }}>
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
                className="px-3 py-1 rounded-full text-xs font-medium break-words"
                // NAYA: skill-chip ka background halka-tinted accent color, text solid accent color
                style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
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

*/