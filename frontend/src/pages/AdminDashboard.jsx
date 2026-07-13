import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiGrid,
  FiUsers,
  FiFileText,
  FiToggleLeft,
  FiToggleRight,
  FiTrash2,
  FiEye,
  FiRefreshCw,
  FiArrowLeft,
  FiSearch,
  FiShield,
  FiClock,
  FiTrendingUp,
  FiUserCheck,
  FiAlertTriangle,
} from "react-icons/fi";
import { server } from "../server";

// ---------------------------------------------------------------------------
// Static config
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: FiGrid },
  { id: "users", label: "Users", icon: FiUsers },
  { id: "resumes", label: "Resumes", icon: FiFileText },
];

const STAT_CARDS = [
  { key: "totalUsers", label: "Total users", icon: FiUsers, accent: "violet" },
  { key: "totalResumes", label: "Total resumes", icon: FiFileText, accent: "cyan" },
  { key: "newUsersToday", label: "Signups today", icon: FiTrendingUp, accent: "emerald" },
  { key: "newResumesToday", label: "Resumes today", icon: FiClock, accent: "amber" },
  { key: "newUsersThisWeek", label: "Signups this week", icon: FiUserCheck, accent: "violet" },
  { key: "completedResumes", label: "Completed resumes", icon: FiFileText, accent: "cyan" },
];

const ACCENTS = {
  violet: { bar: "bg-violet-500", text: "text-violet-600", chip: "bg-violet-50 text-violet-700" },
  cyan: { bar: "bg-cyan-500", text: "text-cyan-600", chip: "bg-cyan-50 text-cyan-700" },
  emerald: { bar: "bg-emerald-500", text: "text-emerald-600", chip: "bg-emerald-50 text-emerald-700" },
  amber: { bar: "bg-amber-500", text: "text-amber-600", chip: "bg-amber-50 text-amber-700" },
  rose: { bar: "bg-rose-500", text: "text-rose-600", chip: "bg-rose-50 text-rose-700" },
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

// ---------------------------------------------------------------------------
// Small reusable bits
// ---------------------------------------------------------------------------

const StatusBadge = ({ active }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
      active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-rose-500"}`}
    />
    {active ? "Active" : "Disabled"}
  </span>
);

const CompleteBadge = ({ complete }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
      complete ? "bg-cyan-50 text-cyan-700" : "bg-slate-100 text-slate-500"
    }`}
  >
    {complete ? "Complete" : "Draft"}
  </span>
);

const StatCard = ({ icon: Icon, label, value, accent, loading }) => {
  const a = ACCENTS[accent];
  return (
    <div className="relative bg-white border border-slate-200 rounded-2xl p-5 pt-6 shadow-sm overflow-hidden">
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${a.bar}`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, currentColor 0 10px, transparent 10px 16px)",
        }}
      />
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${a.chip}`}>
        <Icon size={17} />
      </div>
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="font-mono text-3xl font-bold text-slate-900 tabular-nums">
        {loading ? (
          <span className="inline-block w-16 h-7 bg-slate-100 rounded animate-pulse" />
        ) : (
          value ?? 0
        )}
      </p>
    </div>
  );
};

const ConfirmModal = ({ title, message, confirmLabel, danger, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <FiAlertTriangle size={18} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{message}</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition ${
            danger ? "bg-rose-600 hover:bg-rose-700" : "bg-cyan-600 hover:bg-cyan-700"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const AdminDashboard = () => {
  const { user, loading: userLoading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  // Guard: only admins get past this point
  useEffect(() => {
    if (!userLoading && (!user || user.role !== "admin")) {
      toast.error("Admins only");
      navigate("/");
    }
  }, [user, userLoading, navigate]);

  const fetchAll = useCallback(async () => {
    try {
      const [statsRes, usersRes, resumesRes] = await Promise.all([
        axios.get(`${server}/admin/stats`, { withCredentials: true }),
        axios.get(`${server}/admin/users`, { withCredentials: true }),
        axios.get(`${server}/admin/resumes`, { withCredentials: true }),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setResumes(resumesRes.data.resumes);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") fetchAll();
  }, [user, fetchAll]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAll();
  };

  const toggleUserStatus = async (id) => {
    try {
      const { data } = await axios.patch(
        `${server}/admin/users/${id}/toggle-status`,
        {},
        { withCredentials: true },
      );
      setUsers((prev) => prev.map((u) => (u._id === id ? data.user : u)));
      toast.success(data.user.isActive ? "User enabled" : "User disabled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${server}/admin/users/${id}`, { withCredentials: true });
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setResumes((prev) => prev.filter((r) => r.userId?._id !== id));
      toast.success("User and their resumes deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setConfirmAction(null);
    }
  };

  const deleteResume = async (id) => {
    try {
      await axios.delete(`${server}/admin/resumes/${id}`, { withCredentials: true });
      setResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success("Resume deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setConfirmAction(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredResumes = resumes.filter(
    (r) =>
      r.resumeName?.toLowerCase().includes(search.toLowerCase()) ||
      r.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.userId?.email?.toLowerCase().includes(search.toLowerCase()),
  );

  if (userLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <FiRefreshCw className="animate-spin" /> Checking access…
        </div>
      </div>
    );
  }

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#10132A] text-slate-300 min-h-screen sticky top-0">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <FiShield className="text-violet-400" />
            Admin Console
          </div>
          <p className="text-xs text-slate-400 mt-1">Resume Builder</p>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSearch("");
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition relative ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-violet-400" />
                )}
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-5 border-t border-white/10 space-y-3">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200 transition"
          >
            <FiArrowLeft size={16} />
            Settings
          </Link>
          <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center text-xs font-bold shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ---------------- Main content ---------------- */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur border-b border-slate-200">
          <div className="px-5 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 capitalize">
                {activeSection === "overview" ? "Overview" : activeSection}
              </h1>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                <CalendarClockIcon />
                {todayLabel}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {activeSection !== "overview" && (
                <div className="relative">
                  <FiSearch
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`Search ${activeSection}…`}
                    className="pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 w-52"
                  />
                </div>
              )}
              <button
                onClick={handleRefresh}
                className="w-9 h-9 rounded-lg border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition shrink-0"
                title="Refresh"
              >
                <FiRefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          <div className="md:hidden flex gap-2 px-5 pb-4 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSearch("");
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  activeSection === item.id
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-500 border border-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 sm:px-8 py-8">
          {/* ---------------- Overview ---------------- */}
          {activeSection === "overview" && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {STAT_CARDS.map((c) => (
                <StatCard
                  key={c.key}
                  icon={c.icon}
                  label={c.label}
                  value={stats?.[c.key]}
                  accent={c.accent}
                  loading={loading}
                />
              ))}
            </div>
          )}

          {/* ---------------- Users ---------------- */}
          {activeSection === "users" && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                      <th className="text-left font-semibold px-5 py-3">Name</th>
                      <th className="text-left font-semibold px-5 py-3">Email</th>
                      <th className="text-left font-semibold px-5 py-3">Joined</th>
                      <th className="text-left font-semibold px-5 py-3">Status</th>
                      <th className="text-right font-semibold px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                          Loading users…
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                          No users match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50/60 transition">
                          <td className="px-5 py-3.5 font-medium text-slate-900">{u.name}</td>
                          <td className="px-5 py-3.5 text-slate-500">{u.email}</td>
                          <td className="px-5 py-3.5 text-slate-500">
                            {formatDate(u.createdAt)}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge active={u.isActive !== false} />
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => toggleUserStatus(u._id)}
                                title={u.isActive !== false ? "Disable user" : "Enable user"}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                              >
                                {u.isActive !== false ? (
                                  <FiToggleRight size={18} className="text-emerald-500" />
                                ) : (
                                  <FiToggleLeft size={18} />
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  setConfirmAction({
                                    type: "user",
                                    id: u._id,
                                    title: "Delete this user?",
                                    message: `${u.name} and all of their resumes will be permanently deleted. This can't be undone.`,
                                  })
                                }
                                title="Delete user"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                              >
                                <FiTrash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------- Resumes ---------------- */}
          {activeSection === "resumes" && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                      <th className="text-left font-semibold px-5 py-3">Resume</th>
                      <th className="text-left font-semibold px-5 py-3">Owner</th>
                      <th className="text-left font-semibold px-5 py-3">Updated</th>
                      <th className="text-left font-semibold px-5 py-3">Status</th>
                      <th className="text-right font-semibold px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                          Loading resumes…
                        </td>
                      </tr>
                    ) : filteredResumes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                          No resumes match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredResumes.map((r) => (
                        <tr key={r._id} className="hover:bg-slate-50/60 transition">
                          <td className="px-5 py-3.5 font-medium text-slate-900">
                            {r.resumeName}
                          </td>
                          <td className="px-5 py-3.5 text-slate-500">
                            {r.userId?.name || "—"}
                            <span className="block text-xs text-slate-400">
                              {r.userId?.email}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500">
                            {formatDate(r.updatedAt)}
                          </td>
                          <td className="px-5 py-3.5">
                            <CompleteBadge complete={r.isComplete} />
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`/resume/${r._id}/preview`}
                                target="_blank"
                                rel="noreferrer"
                                title="View resume"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-cyan-600 transition"
                              >
                                <FiEye size={15} />
                              </a>
                              <button
                                onClick={() =>
                                  setConfirmAction({
                                    type: "resume",
                                    id: r._id,
                                    title: "Delete this resume?",
                                    message: `"${r.resumeName}" will be permanently deleted. This can't be undone.`,
                                  })
                                }
                                title="Delete resume"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                              >
                                <FiTrash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {confirmAction && (
        <ConfirmModal
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel="Delete"
          danger
          onCancel={() => setConfirmAction(null)}
          onConfirm={() =>
            confirmAction.type === "user"
              ? deleteUser(confirmAction.id)
              : deleteResume(confirmAction.id)
          }
        />
      )}
    </div>
  );
};

// tiny inline icon wrapper so we don't need an extra import line above
const CalendarClockIcon = () => <FiClock size={13} className="inline -mt-0.5" />;

export default AdminDashboard;
