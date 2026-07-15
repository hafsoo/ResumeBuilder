import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { loadSingleResume } from "../redux/actions/resume";
import SendEmailModal from "../components/SendEmailModal";
import ResumePreviewContent from "./ResumePreviewContent";

const ResumePreview = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      <div className="print:hidden">
        <Header />
      </div>

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
          <div className="px-8 py-8 sm:px-14 sm:py-10 print:p-0">
            <ResumePreviewContent
              personalInfo={personalInfo}
              education={education}
              experience={experience}
              skills={skills}
              projects={projects}
              avatarUrl={resume?.avatar?.url}
              accentColor={accentColor}
              templateId={resume.templateId || "modern"}
            />
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

export default ResumePreview;