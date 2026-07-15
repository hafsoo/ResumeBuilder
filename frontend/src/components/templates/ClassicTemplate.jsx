import React from "react";
import { formatRange, normalizeUrl, hasContent } from "../../utils/resumeTemplateHelpers";

/* ---------- tiny inline icons (no extra dependency) ---------- */
const IconBase = ({ children, size = 13 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const IconMail = (p) => (
  <IconBase {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </IconBase>
);
const IconPhone = (p) => (
  <IconBase {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </IconBase>
);
const IconPin = (p) => (
  <IconBase {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </IconBase>
);
const IconLink = (p) => (
  <IconBase {...p}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </IconBase>
);
const IconCap = (p) => (
  <IconBase {...p}>
    <path d="M22 10 12 5 2 10l10 5 10-5Z" />
    <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
  </IconBase>
);
const IconBriefcase = (p) => (
  <IconBase {...p}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </IconBase>
);
const IconBulb = (p) => (
  <IconBase {...p}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2.05V17h6v-.25c0-.85.4-1.55 1-2.05A7 7 0 0 0 12 2Z" />
  </IconBase>
);
const IconFolder = (p) => (
  <IconBase {...p}>
    <path d="M4 4h6l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
  </IconBase>
);
const IconTag = (p) => (
  <IconBase {...p}>
    <path d="M4 11h16" />
    <path d="M4 6h16" />
    <path d="M4 16h10" />
  </IconBase>
);

/* ---------- print reliability ----------
   1. "break-inside: avoid" on every entry stops a browser from slicing
      an experience/education/project block in half at a page break.
   2. ".resume-print-sidebar-bg" is hidden on screen, but in print it
      becomes position:fixed — fixed elements repeat on every printed
      page in Chrome, which is how we get the tinted sidebar colour to
      show up on page 2+ even though the real sidebar column itself
      isn't tall enough to reach that far.
*/
const PrintFixStyles = () => (
  <style>{`
    @media print {
      .resume-entry {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .resume-classic-wrap, .resume-classic-wrap * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      .resume-print-sidebar-bg {
        display: block !important;
        position: fixed;
        top: 0;
        left: 0;
        width: 34%;
        height: 100%;
        z-index: -1;
      }
    }
    .resume-print-sidebar-bg {
      display: none;
    }
  `}</style>
);

/* ---------- shared bits ---------- */

// notched "ribbon" section header, color driven entirely by accentColor
const Ribbon = ({ icon, children, accentColor }) => (
  <div className="mb-3">
    <div
      className="inline-flex items-center gap-2 pl-4 pr-7 py-1.5 text-white text-[11px] font-bold uppercase tracking-wider"
      style={{
        backgroundColor: accentColor,
        clipPath: "polygon(0 0, 100% 0, 88% 50%, 100% 100%, 0 100%)",
      }}
    >
      {icon}
      <span>{children}</span>
    </div>
  </div>
);

const ContactRow = ({ icon, accentColor, children }) => (
  <li className="flex items-start gap-2.5">
    <span
      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
      style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
    >
      {icon}
    </span>
    <span className="text-xs text-slate-600 break-all leading-relaxed pt-1">{children}</span>
  </li>
);

const LinkText = ({ value }) => (
  <a
    href={normalizeUrl(value)}
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline"
  >
    {value}
  </a>
);

const ClassicTemplate = ({
  personalInfo = {},
  education = [],
  experience = [],
  skills = [],
  projects = [],
  avatarUrl = "",
  accentColor = "#0891b2",
}) => {
  const tagline = experience.find((e) => e.position?.trim())?.position;
  const isEmpty =
    !personalInfo.summary &&
    !hasContent(experience) &&
    !hasContent(education) &&
    !hasContent(projects) &&
    !hasContent(skills);

  return (
    <>
      <PrintFixStyles />

      {/* print-only: repeats the tinted sidebar colour on every printed page */}
      <div
        className="resume-print-sidebar-bg"
        style={{ backgroundColor: `${accentColor}0D` }}
      />

      <div className="resume-classic-wrap rounded-xl overflow-hidden border border-slate-200 flex flex-col md:flex-row">
        {/* -------- Sidebar -------- */}
        <div
          className="resume-classic-sidebar w-full md:w-[34%] shrink-0"
          style={{ backgroundColor: `${accentColor}0D` }}
        >
          {/* photo + name block */}
          <div className="resume-entry px-6 py-8 text-center" style={{ backgroundColor: accentColor }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={personalInfo.fullName || "Profile"}
                className="w-24 h-24 rounded-full object-cover border-4 border-white/40 mx-auto"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/40 mx-auto flex items-center justify-center">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </div>
            )}
            <h1 className="text-xl font-extrabold text-white mt-4 break-words">
              {personalInfo.fullName || "Your Name"}
            </h1>
            {tagline && (
              <p className="text-white/85 text-[11px] font-semibold uppercase tracking-widest mt-1 break-words">
                {tagline}
              </p>
            )}
          </div>

          {/* contact + skills */}
          <div className="px-6 py-7 space-y-7">
            <div className="resume-entry">
              <Ribbon icon={<IconMail />} accentColor={accentColor}>
                Contact
              </Ribbon>
              <ul className="space-y-2.5">
                {personalInfo.email && (
                  <ContactRow icon={<IconMail size={12} />} accentColor={accentColor}>
                    {personalInfo.email}
                  </ContactRow>
                )}
                {personalInfo.phone && (
                  <ContactRow icon={<IconPhone size={12} />} accentColor={accentColor}>
                    {personalInfo.phone}
                  </ContactRow>
                )}
                {personalInfo.address && (
                  <ContactRow icon={<IconPin size={12} />} accentColor={accentColor}>
                    {personalInfo.address}
                  </ContactRow>
                )}
                {personalInfo.linkedin && (
                  <ContactRow icon={<IconLink size={12} />} accentColor={accentColor}>
                    <LinkText value={personalInfo.linkedin} />
                  </ContactRow>
                )}
                {personalInfo.github && (
                  <ContactRow icon={<IconLink size={12} />} accentColor={accentColor}>
                    <LinkText value={personalInfo.github} />
                  </ContactRow>
                )}
                {personalInfo.portfolio && (
                  <ContactRow icon={<IconLink size={12} />} accentColor={accentColor}>
                    <LinkText value={personalInfo.portfolio} />
                  </ContactRow>
                )}
              </ul>
            </div>

            {hasContent(skills) && (
              <div className="resume-entry">
                <Ribbon icon={<IconTag />} accentColor={accentColor}>
                  Skills
                </Ribbon>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium leading-tight break-words max-w-full"
                      style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* -------- Main content -------- */}
        <div className="resume-classic-main flex-1 bg-white px-6 py-8 sm:px-8">
          {isEmpty && (
            <p className="text-slate-400 text-sm italic text-center py-10">
              Start filling the form — your resume will appear here.
            </p>
          )}

          {personalInfo.summary && (
            <div className="resume-entry mb-7">
              <Ribbon icon={<IconBulb />} accentColor={accentColor}>
                Objective
              </Ribbon>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {hasContent(experience) && (
            <div className="mb-7">
              <Ribbon icon={<IconBriefcase />} accentColor={accentColor}>
                Work Experience
              </Ribbon>
              <div className="space-y-5">
                {experience.map((exp, i) => (
                  <div
                    key={i}
                    className="resume-entry relative pl-4"
                    style={{ borderLeft: `2px solid ${accentColor}33` }}
                  >
                    <span
                      className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
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
            </div>
          )}

          {hasContent(education) && (
            <div className="mb-7">
              <Ribbon icon={<IconCap />} accentColor={accentColor}>
                Education
              </Ribbon>
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <div
                    key={i}
                    className="resume-entry relative pl-4"
                    style={{ borderLeft: `2px solid ${accentColor}33` }}
                  >
                    <span
                      className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                    <div className="flex items-baseline justify-between flex-wrap gap-x-2">
                      <h3 className="font-semibold text-slate-900 text-sm break-words">
                        {edu.degree} {edu.institute && `— ${edu.institute}`}
                      </h3>
                      <span className="text-xs text-slate-400 shrink-0">
                        {formatRange(edu.startDate, edu.endDate, edu.isPresent)}
                      </span>
                    </div>
                    {edu.cgpa && <p className="text-slate-600 text-sm mt-0.5 break-words">CGPA: {edu.cgpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasContent(projects) && (
            <div>
              <Ribbon icon={<IconFolder />} accentColor={accentColor}>
                Projects
              </Ribbon>
              <div className="space-y-4">
                {projects.map((proj, i) => (
                  <div
                    key={i}
                    className="resume-entry relative pl-4"
                    style={{ borderLeft: `2px solid ${accentColor}33` }}
                  >
                    <span
                      className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                    <h3 className="font-semibold text-slate-900 text-sm break-words">
                      {proj.name}
                      {proj.technologies && (
                        <span className="text-slate-400 font-normal"> · {proj.technologies}</span>
                      )}
                    </h3>
                    {proj.description && (
                      <p className="text-slate-600 text-sm mt-1 leading-relaxed whitespace-pre-wrap break-words">
                        {proj.description}
                      </p>
                    )}
                    <div className="flex gap-3 mt-1 text-xs" style={{ color: accentColor }}>
                      {proj.githubLink && <LinkText value={proj.githubLink} />}
                      {proj.liveLink && <LinkText value={proj.liveLink} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClassicTemplate;

/*
import React from "react";
import { formatRange, normalizeUrl, hasContent } from "../../utils/resumeTemplateHelpers";

const LinkText = ({ value, className }) => (
  <a href={normalizeUrl(value)} target="_blank" rel="noopener noreferrer" className={`hover:underline ${className || ""}`}>
    {value}
  </a>
);

const Section = ({ title, children, last }) => (
  <div className={last ? "" : "mb-6"}>
    <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-3">{title}</h2>
    {children}
  </div>
);

const ClassicTemplate = ({
  personalInfo = {},
  education = [],
  experience = [],
  skills = [],
  projects = [],
  avatarUrl = "",
  accentColor = "#0891b2",
}) => {
  return (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold text-slate-900 break-words">
            {personalInfo.fullName || "Your Name"}
          </h1>
          <div className="h-1 w-14 rounded-full mt-2" style={{ backgroundColor: accentColor }} />
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-600">
            {personalInfo.email && <span className="break-all">{personalInfo.email}</span>}
            {personalInfo.phone && <span className="break-words">{personalInfo.phone}</span>}
            {personalInfo.address && <span className="break-words">{personalInfo.address}</span>}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm" style={{ color: accentColor }}>
            {personalInfo.linkedin && <LinkText value={personalInfo.linkedin} className="break-all" />}
            {personalInfo.github && <LinkText value={personalInfo.github} className="break-all" />}
            {personalInfo.portfolio && <LinkText value={personalInfo.portfolio} className="break-all" />}
          </div>
        </div>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={personalInfo.fullName || "Profile"}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-[120px] md:h-[120px] rounded-full object-cover border-2 shrink-0"
            style={{ borderColor: accentColor }}
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
                {edu.cgpa && <p className="text-slate-600 text-sm mt-0.5 break-words">CGPA: {edu.cgpa}</p>}
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
                  {proj.technologies && <span className="text-slate-400 font-normal"> · {proj.technologies}</span>}
                </h3>
                {proj.description && (
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed whitespace-pre-wrap break-words">
                    {proj.description}
                  </p>
                )}
                <div className="flex gap-3 mt-1 text-xs" style={{ color: accentColor }}>
                  {proj.githubLink && <LinkText value={proj.githubLink} className="break-all" />}
                  {proj.liveLink && <LinkText value={proj.liveLink} className="break-all" />}
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

      {!personalInfo.summary && !hasContent(experience) && !hasContent(education) && !hasContent(projects) && !hasContent(skills) && (
        <p className="text-slate-400 text-sm italic text-center py-10">
          Start filling the form — your resume will appear here.
        </p>
      )}
    </>
  );
};

export default ClassicTemplate;

*/