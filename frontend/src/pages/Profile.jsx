import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Header from "../components/Header";
import { server } from "../server";
import { loadUser, logoutUser } from "../redux/actions/user";

const TABS = [
  { id: "info", label: "Profile Info" },
  { id: "password", label: "Password" },
  { id: "logout", label: "Logout" },
];

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleTabClick = async (tabId) => {
    if (tabId === "logout") {
      setLoggingOut(true);
      try {
        await dispatch(logoutUser());
        toast.success("Logged out successfully");
        navigate("/login");
      } catch (err) {
        toast.error("Logout failed, please try again");
        setLoggingOut(false);
      }
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Account settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your name, photo, and password.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-6">
          <div className="sm:w-56 shrink-0">
            <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-3 mb-6 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
              <AvatarPreview />
              <div className="sm:mt-1 min-w-0">
                <p className="text-slate-900 font-semibold text-sm truncate">
                  {user?.name}
                </p>
                <p className="text-slate-500 text-xs truncate">{user?.email}</p>
              </div>
            </div>

            <nav className="flex sm:flex-col gap-2">
              {TABS.map((tab) => {
                const isLogout = tab.id === "logout";
                const active = activeTab === tab.id && !isLogout;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    disabled={isLogout && loggingOut}
                    className={`relative text-left px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed ${
                      isLogout
                        ? "text-red-600 hover:bg-red-50"
                        : active
                          ? "bg-cyan-50 text-cyan-700"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-cyan-500" />
                    )}
                    <span className={isLogout ? "" : "pl-2"}>
                      {isLogout && loggingOut ? "Logging out..." : tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            {activeTab === "info" ? <ProfileInfoForm /> : <PasswordForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

const AvatarPreview = () => {
  const { user } = useSelector((state) => state.user);
  return user?.avatar?.url ? (
    <img
      src={user.avatar.url}
      alt="avatar"
      className="w-14 h-14 rounded-full object-cover border border-slate-200"
    />
  ) : (
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
      {user?.name?.charAt(0).toUpperCase() || "U"}
    </div>
  );
};

const ProfileInfoForm = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.readyState !== 2) return;
      const base64 = reader.result;
      setAvatarPreview(base64);

      setSavingAvatar(true);
      try {
        await axios.put(
          `${server}/user/update-avatar`,
          { avatar: base64 },
          { withCredentials: true },
        );
        toast.success("Photo updated!");
        dispatch(loadUser());
      } catch (err) {
        toast.error(err.response?.data?.message || "Photo update failed");
      } finally {
        setSavingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      await axios.put(
        `${server}/user/update-user-info`,
        { name, email, phoneNumber },
        { withCredentials: true },
      );
      toast.success("Profile updated!");
      dispatch(loadUser());
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSavingInfo(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">
        Profile Information
      </h2>

      <div className="flex items-center gap-4 mb-8">
        <span className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
          {avatarPreview || user?.avatar?.url ? (
            <img
              src={avatarPreview || user.avatar.url}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <RxAvatar className="w-8 h-8 text-slate-400" />
          )}
        </span>
        <label
          htmlFor="avatar-input"
          className="cursor-pointer text-sm font-medium text-cyan-700 hover:text-cyan-800 border border-cyan-200 bg-cyan-50 hover:bg-cyan-100 rounded-lg px-4 py-2 transition"
        >
          {savingAvatar ? "Uploading..." : "Change photo"}
          <input
            type="file"
            id="avatar-input"
            accept=".jpg,.jpeg,.png"
            onChange={handleAvatarChange}
            className="sr-only"
            disabled={savingAvatar}
          />
        </label>
      </div>

      <form onSubmit={handleInfoSubmit} className="space-y-5 max-w-md">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Full name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Phone number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Optional"
            className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition"
          />
        </div>

        <button
          type="submit"
          disabled={savingInfo}
          className="px-6 py-2.5 rounded-lg font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {savingInfo ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
};

const PasswordField = ({
  label,
  value,
  onChange,
  field,
  autoComplete,
  visible,
  onToggleVisible,
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder="••••••••"
        className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition pr-11"
      />
      <button
        type="button"
        onClick={() => onToggleVisible(field)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600"
      >
        {visible ? (
          <AiOutlineEye size={20} />
        ) : (
          <AiOutlineEyeInvisible size={20} />
        )}
      </button>
    </div>
  </div>
);

const PasswordForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);

  const toggleVisible = (field) =>
    setVisible((v) => ({ ...v, [field]: !v[field] }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    setSaving(true);
    try {
      const res = await axios.put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true },
      );
      toast.success(res.data.message || "Password updated!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">Change password</h2>
      <p className="text-slate-500 text-sm mb-6">
        Use at least 8 characters, including a number.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        <PasswordField
          label="Current password"
          field="old"
          autoComplete="current-password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          visible={visible.old}
          onToggleVisible={toggleVisible}
        />
        <PasswordField
          label="New password"
          field="new"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          visible={visible.new}
          onToggleVisible={toggleVisible}
        />
        <PasswordField
          label="Confirm new password"
          field="confirm"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          visible={visible.confirm}
          onToggleVisible={toggleVisible}
        />

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
};

export default Profile;

/*
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Header from "../components/Header";
import { server } from "../server";
import { loadUser, logoutUser } from "../redux/actions/user";

const TABS = [
  { id: "info", label: "Profile Info" },
  { id: "password", label: "Password" },
  { id: "logout", label: "Logout" },
];

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleTabClick = async (tabId) => {
    if (tabId === "logout") {
      setLoggingOut(true);
      try {
        await dispatch(logoutUser());
        toast.success("Logged out successfully");
        navigate("/login");
      } catch (err) {
        toast.error("Logout failed, please try again");
        setLoggingOut(false);
      }
      return; // don't change activeTab — we're navigating away
    }
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Account settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your name, photo, and password.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-6">
         
          <div className="sm:w-56 shrink-0">
            <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-3 mb-6 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
              <AvatarPreview />
              <div className="sm:mt-1 min-w-0">
                <p className="text-slate-900 font-semibold text-sm truncate">
                  {user?.name}
                </p>
                <p className="text-slate-500 text-xs truncate">{user?.email}</p>
              </div>
            </div>

            <nav className="flex sm:flex-col gap-2">
              {TABS.map((tab) => {
                const isLogout = tab.id === "logout";
                const active = activeTab === tab.id && !isLogout;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    disabled={isLogout && loggingOut}
                    className={`relative text-left px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed ${
                      isLogout
                        ? "text-red-600 hover:bg-red-50"
                        : active
                        ? "bg-cyan-50 text-cyan-700"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-cyan-500" />
                    )}
                    <span className={isLogout ? "" : "pl-2"}>
                      {isLogout && loggingOut ? "Logging out..." : tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            {activeTab === "info" ? <ProfileInfoForm /> : <PasswordForm />}
          </div>
        </div>
      </div>
    </div>
  );
};


const AvatarPreview = () => {
  const { user } = useSelector((state) => state.user);
  return user?.avatar?.url ? (
    <img
      src={user.avatar.url}
      alt="avatar"
      className="w-14 h-14 rounded-full object-cover border border-slate-200"
    />
  ) : (
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
      {user?.name?.charAt(0).toUpperCase() || "U"}
    </div>
  );
};


const ProfileInfoForm = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.readyState !== 2) return;
      const base64 = reader.result;
      setAvatarPreview(base64);

      setSavingAvatar(true);
      try {
        await axios.put(
          `${server}/user/update-avatar`,
          { avatar: base64 },
          { withCredentials: true }
        );
        toast.success("Photo updated!");
        dispatch(loadUser());
      } catch (err) {
        toast.error(err.response?.data?.message || "Photo update failed");
      } finally {
        setSavingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      await axios.put(
        `${server}/user/update-user-info`,
        { name, email, phoneNumber },
        { withCredentials: true }
      );
      toast.success("Profile updated!");
      dispatch(loadUser());
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSavingInfo(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">Profile Information</h2>

    
      <div className="flex items-center gap-4 mb-8">
        <span className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
          {avatarPreview || user?.avatar?.url ? (
            <img
              src={avatarPreview || user.avatar.url}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <RxAvatar className="w-8 h-8 text-slate-400" />
          )}
        </span>
        <label
          htmlFor="avatar-input"
          className="cursor-pointer text-sm font-medium text-cyan-700 hover:text-cyan-800 border border-cyan-200 bg-cyan-50 hover:bg-cyan-100 rounded-lg px-4 py-2 transition"
        >
          {savingAvatar ? "Uploading..." : "Change photo"}
          <input
            type="file"
            id="avatar-input"
            accept=".jpg,.jpeg,.png"
            onChange={handleAvatarChange}
            className="sr-only"
            disabled={savingAvatar}
          />
        </label>
      </div>

      <form onSubmit={handleInfoSubmit} className="space-y-5 max-w-md">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Full name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Phone number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Optional"
            className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition"
          />
        </div>

        <button
          type="submit"
          disabled={savingInfo}
          className="px-6 py-2.5 rounded-lg font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {savingInfo ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
};


const PasswordForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState({ old: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);

  const toggleVisible = (field) =>
    setVisible((v) => ({ ...v, [field]: !v[field] }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    setSaving(true);
    try {
      const res = await axios.put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Password updated!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    } finally {
      setSaving(false);
    }
  };

  const PasswordField = ({ label, value, onChange, field, autoComplete }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible[field] ? "text" : "password"}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition pr-11"
        />
        <button
          type="button"
          onClick={() => toggleVisible(field)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600"
        >
          {visible[field] ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">Change password</h2>
      <p className="text-slate-500 text-sm mb-6">
        Use at least 8 characters, including a number.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        <PasswordField
          label="Current password"
          field="old"
          autoComplete="current-password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <PasswordField
          label="New password"
          field="new"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <PasswordField
          label="Confirm new password"
          field="confirm"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
};

export default Profile;

*/
