import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createResume } from "../redux/actions/resume";

const CreateResumeModal = ({ open, onClose }) => {
  const [resumeName, setResumeName] = useState("");
  const [creating, setCreating] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!open) return null;

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!resumeName.trim()) {
      toast.error("Please enter a resume name");
      return;
    }

    setCreating(true);
    try {
      const resume = await dispatch(createResume(resumeName.trim()));
      toast.success("Resume created!");
      setResumeName("");
      onClose();
      navigate(`/resume/${resume._id}/edit`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create resume");
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    if (creating) return; // don't let them close mid-request
    setResumeName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40"
        onClick={handleClose}
      />

      {/* modal card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-7">
        <h2 className="text-lg font-bold text-slate-900">
          Name your resume
        </h2>
        <p className="text-slate-500 text-sm mt-1 mb-5">
          You can rename it later — this just helps you tell resumes apart.
        </p>

        <form onSubmit={handleCreate}>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Resume name
          </label>
          <input
            type="text"
            autoFocus
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            placeholder="e.g. Software Engineer Resume"
            className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition"
          />

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={creating}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {creating ? "Creating..." : "Create resume"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResumeModal;