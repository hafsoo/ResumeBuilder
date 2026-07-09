import React from "react";

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
      {/* header block */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold text-slate-900 break-words">
            {personalInfo.fullName || "Your Name"}
          </h1>
          {personalInfo.title && (
            <p className="text-cyan-700 font-medium mt-1">{personalInfo.title}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.address && <span>{personalInfo.address}</span>}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-cyan-700">
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.github && <span>{personalInfo.github}</span>}
            {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
          </div>
        </div>

        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={personalInfo.fullName || "Profile"}
            //className="w-16 h-16 rounded-full object-cover border-2 border-cyan-100 shrink-0"
            className="w-[120px] h-[120px] rounded-full object-cover border-2 border-cyan-100 shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
            {(personalInfo.fullName || "U").charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* summary */}
      {personalInfo.summary && (
        <Section title="Summary">
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {personalInfo.summary}
          </p>
        </Section>
      )}

      {/* experience */}
      {hasContent(experience) && (
        <Section title="Experience">
          <div className="space-y-5">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between flex-wrap gap-x-2">
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {exp.position} {exp.company && `— ${exp.company}`}
                  </h3>
                  <span className="text-xs text-slate-400 shrink-0">
                    {exp.startDate} {exp.endDate && `– ${exp.endDate}`}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed whitespace-pre-wrap">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* education */}
      {hasContent(education) && (
        <Section title="Education">
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between flex-wrap gap-x-2">
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {edu.degree} {edu.institute && `— ${edu.institute}`}
                  </h3>
                  <span className="text-xs text-slate-400 shrink-0">
                    {edu.startDate} {edu.endDate && `– ${edu.endDate}`}
                  </span>
                </div>
                {edu.cgpa && (
                  <p className="text-slate-600 text-sm mt-0.5">CGPA: {edu.cgpa}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* projects */}
      {hasContent(projects) && (
        <Section title="Projects">
          <div className="space-y-4">
            {projects.map((proj, i) => (
              <div key={i}>
                <h3 className="font-semibold text-slate-900 text-sm">
                  {proj.name}
                  {proj.technologies && (
                    <span className="text-slate-400 font-normal">
                      {" "}
                      · {proj.technologies}
                    </span>
                  )}
                </h3>
                {proj.description && (
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed whitespace-pre-wrap">
                    {proj.description}
                  </p>
                )}
                <div className="flex gap-3 mt-1 text-xs text-cyan-700">
                  {proj.githubLink && <span>{proj.githubLink}</span>}
                  {proj.liveLink && <span>{proj.liveLink}</span>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* skills */}
      {hasContent(skills) && (
        <Section title="Skills" last>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* nothing filled in yet */}
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