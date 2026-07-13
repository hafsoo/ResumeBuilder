import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { sendResumeByEmail } from "../redux/actions/resume";

const SendEmailModal = ({ resumeId, open, onClose }) => {
  const dispatch = useDispatch();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await dispatch(sendResumeByEmail(resumeId, recipientEmail, message));
      toast.success(res.message || "Resume sent!");
      setRecipientEmail("");
      setMessage("");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Send resume via email</h2>
        <p className="text-slate-500 text-sm mb-5">
          Your resume will be sent as a formatted email — no download needed.
        </p>

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Recipient email *
            </label>
            <input
              type="email"
              required
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="recruiter@company.com"
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Message <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, please find my resume attached..."
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendEmailModal;