import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import CreateResumeModal from "../components/CreateResumeModal";
import { loadResumes, deleteResume } from "../redux/actions/resume";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ResumeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumes, loading } = useSelector((state) => state.resume);

  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  useEffect(() => {
    dispatch(loadResumes());
  }, [dispatch]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await dispatch(deleteResume(id));
      toast.success("Resume deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              My Resumes
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {resumes.length === 0
                ? "You haven't created any resumes yet."
                : `${resumes.length} resume${resumes.length > 1 ? "s" : ""} saved`}
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition"
          >
            + Create New Resume
          </button>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-16">Loading resumes...</div>
        ) : resumes.length === 0 ? (
          <EmptyState onCreate={() => setModalOpen(true)} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                onEdit={() => navigate(`/resume/${resume._id}/edit`)}
                onPreview={() => navigate(`/resume/${resume._id}/preview`)}
                onDeleteClick={() => setConfirmingId(resume._id)}
                confirming={confirmingId === resume._id}
                deleting={deletingId === resume._id}
                onConfirmDelete={() => handleDelete(resume._id)}
                onCancelDelete={() => setConfirmingId(null)}
              />
            ))}
          </div>
        )}
      </div>

      <CreateResumeModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

/* ---------- single resume card ---------- */
const ResumeCard = ({
  resume,
  onEdit,
  onPreview,
  onDeleteClick,
  confirming,
  deleting,
  onConfirmDelete,
  onCancelDelete,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0e7490" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="13" y2="17" />
          </svg>
        </div>
      </div>

      <h3 className="font-bold text-slate-900 truncate">{resume.resumeName}</h3>
      <p className="text-xs text-slate-400 mt-1">
        Updated {formatDate(resume.updatedAt)}
      </p>
      <p className="text-xs text-slate-400">
        Created {formatDate(resume.createdAt)}
      </p>

      {!confirming ? (
        <div className="flex items-center gap-2 mt-5">
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition"
          >
            Edit
          </button>
          <button
            onClick={onPreview}
            className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold text-cyan-700 border border-cyan-200 hover:bg-cyan-50 transition"
          >
            Preview
          </button>
          <button
            onClick={onDeleteClick}
            className="px-3 py-2 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 transition"
            title="Delete resume"
          >
            🗑
          </button>
        </div>
      ) : (
        <div className="mt-5 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs text-red-700 font-medium mb-2">
            Delete this resume? This can't be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onConfirmDelete}
              disabled={deleting}
              className="flex-1 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </button>
            <button
              onClick={onCancelDelete}
              disabled={deleting}
              className="flex-1 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- empty state ---------- */
const EmptyState = ({ onCreate }) => (
  <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-2xl">
    <div className="w-14 h-14 rounded-full bg-cyan-50 flex items-center justify-center mx-auto mb-4">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0e7490" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    </div>
    <h3 className="font-bold text-slate-900 mb-1">No resumes yet</h3>
    <p className="text-slate-500 text-sm mb-5">
      Create your first resume to get started.
    </p>
    <button
      onClick={onCreate}
      className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition"
    >
      + Create New Resume
    </button>
  </div>
);

export default ResumeDashboard;