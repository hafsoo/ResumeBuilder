/*
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { loadSingleResume } from "../redux/actions/resume";

const ResumePreview = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchResume = async () => {
      setLoading(true);
      try {
        const data = await dispatch(loadSingleResume(id));
        if (!isMounted) return;
        console.log("[ResumePreview] loaded resume:", data); // TEMP: remove once confirmed working
        setResume(data || null);
      } catch (err) {
        if (!isMounted) return;
        toast.error(err.response?.data?.message || "Could not load resume", {
          toastId: "preview-load-error",
        });
        navigate("/dashboard");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchResume();
    return () => {
      isMounted = false;
    };
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

  if (!resume) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">
          Could not find this resume.
          <div className="mt-4">
            <button
              type="button"
              onClick={() => navigate(`/resume/${id}/edit`)}
              className="text-cyan-700 font-semibold"
            >
              ← Back to edit
            </button>
          </div>
        </div>
      </div>
    );
  }

  const personalInfo = resume.personalInfo || {};
  const education = Array.isArray(resume.education) ? resume.education : [];
  const experience = Array.isArray(resume.experience) ? resume.experience : [];
  const skills = Array.isArray(resume.skills) ? resume.skills : [];
  const projects = Array.isArray(resume.projects) ? resume.projects : [];
  const hasContent = (arr) => Array.isArray(arr) && arr.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">
      <div className="print:hidden">
        <Header />
      </div>

    
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-4 flex items-center justify-between print:hidden">
        <button
          type="button"
          onClick={() => navigate(`/resume/${id}/edit`)}
          className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
        >
          ← Back to edit
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition"
        >
          Print / Save as PDF
        </button>
      </div>

      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 print:p-0 print:max-w-none">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm print:shadow-none print:border-0 print:rounded-none px-8 py-10 sm:px-12 sm:py-12">
          
          <div className="border-b border-slate-200 pb-6 mb-6">
            <h1 className="text-3xl font-extrabold text-slate-900">
              {personalInfo.fullName || "Your Name"}
            </h1>
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

       
          {personalInfo.summary && (
            <Section title="Summary">
              <p className="text-slate-700 text-sm leading-relaxed">
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
                      <h3 className="font-semibold text-slate-900 text-sm">
                        {exp.position} {exp.company && `— ${exp.company}`}
                      </h3>
                      <span className="text-xs text-slate-400 shrink-0">
                        {exp.startDate} {exp.endDate && `– ${exp.endDate}`}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-slate-600 text-sm mt-1 leading-relaxed">
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
                      <p className="text-slate-600 text-sm mt-1 leading-relaxed">
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

       
          {!personalInfo.summary &&
            !hasContent(experience) &&
            !hasContent(education) &&
            !hasContent(projects) &&
            !hasContent(skills) && (
              <p className="text-slate-400 text-sm italic text-center py-10">
                This resume is empty so far — head back to editing to add your details.
              </p>
            )}
        </div>
      </div>
    </div>
  );
};


const Section = ({ title, children, last }) => (
  <div className={last ? "" : "mb-6"}>
    <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-3">
      {title}
    </h2>
    {children}
  </div>
);

export default ResumePreview;

*/


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { loadSingleResume } from "../redux/actions/resume";
import ResumePreviewContent from "./ResumePreviewContent";

const ResumePreview = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchResume = async () => {
      setLoading(true);
      try {
        const data = await dispatch(loadSingleResume(id));
        if (!isMounted) return;
        setResume(data || null);
      } catch (err) {
        if (!isMounted) return;
        toast.error(err.response?.data?.message || "Could not load resume", {
          toastId: "preview-load-error",
        });
        navigate("/dashboard");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchResume();
    return () => {
      isMounted = false;
    };
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

  if (!resume) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">
          Could not find this resume.
          <div className="mt-4">
            <button
              type="button"
              onClick={() => navigate(`/resume/${id}/edit`)}
              className="text-cyan-700 font-semibold"
            >
              ← Back to edit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">
      <div className="print:hidden">
        <Header />
      </div>

      {/* toolbar */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-4 flex items-center justify-between print:hidden">
        <button
          type="button"
          onClick={() => navigate(`/resume/${id}/edit`)}
          className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
        >
          ← Back to edit
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition"
        >
          Print / Save as PDF
        </button>
      </div>

      {/* the resume "paper" */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 print:p-0 print:max-w-none">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm print:shadow-none print:border-0 print:rounded-none px-8 py-10 sm:px-12 sm:py-12">
          <ResumePreviewContent
            personalInfo={resume.personalInfo}
            education={resume.education}
            experience={resume.experience}
            skills={resume.skills}
            projects={resume.projects}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;

