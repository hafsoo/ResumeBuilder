import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../server";
import AuthShowcase from "../components/AuthShowcase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// returns { score: 0-4, label, color }
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Very weak", color: "bg-red-500" },
    { label: "Weak", color: "bg-orange-500" },
    { label: "Fair", color: "bg-amber-400" },
    { label: "Good", color: "bg-cyan-400" },
    { label: "Strong", color: "bg-emerald-500" },
  ];

  return { score, ...levels[score] };
};

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const emailIsValid = EMAIL_REGEX.test(email);
  const strength = getPasswordStrength(password);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!EMAIL_REGEX.test(email)) {
      toast.error("Please enter a valid email address (e.g. name@gmail.com)");
      return;
    }

    if (strength.score < 3) {
      toast.error(
        "Please choose a stronger password (8+ characters, uppercase, lowercase, and a number)"
      );
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${server}/user/create-user`, {
        name,
        email,
        password,
        avatar,
      });

      toast.success(res.data.message || "Account created! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617]">
      <AuthShowcase variant="signup" />

      <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl border border-cyan-400/40 flex items-center justify-center bg-white/5">
              <span className="text-cyan-400 font-extrabold">R</span>
            </div>
            <span className="text-white font-extrabold text-lg">
              Resume<span className="text-cyan-400">Builder</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center lg:text-left">
            Create your account
          </h2>
          <p className="text-slate-400 text-sm mt-2 text-center lg:text-left">
            Takes less than a minute — no credit card needed.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Hafsa Aziz"
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white placeholder-slate-500 outline-none focus:ring-1 transition ${
                  emailTouched && !emailIsValid
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400/50"
                    : "border-white/10 focus:border-cyan-400 focus:ring-cyan-400/50"
                }`}
              />
              {emailTouched && !emailIsValid && (
                <p className="text-xs text-red-400 mt-1.5">
                  Please enter a valid email (e.g. name@gmail.com)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition pr-11"
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400"
                >
                  {visible ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                </button>
              </div>

              {/* password strength meter */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < strength.score ? strength.color : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs mt-1 text-slate-400">
                    Strength: <span className="font-semibold">{strength.label}</span>
                    {strength.score < 3 && (
                      <span className="text-slate-500">
                        {" "}
                        — use 8+ characters with uppercase, lowercase, and a number
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <RxAvatar className="w-7 h-7 text-slate-400" />
                )}
              </span>
              <label
                htmlFor="file-input"
                className="cursor-pointer text-sm font-medium text-cyan-400 hover:text-cyan-300 border border-cyan-400/30 rounded-lg px-4 py-2 transition"
              >
                Upload photo
                <input
                  type="file"
                  id="file-input"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileInputChange}
                  className="sr-only"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-[#020617] bg-cyan-400 hover:bg-cyan-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 font-semibold hover:text-cyan-300">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

/*
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../server";
import AuthShowcase from "../components/AuthShowcase";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${server}/user/create-user`, {
        name,
        email,
        password,
        avatar,
      });

      toast.success(res.data.message || "Account created! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617]">
      <AuthShowcase variant="signup" />

      <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl border border-cyan-400/40 flex items-center justify-center bg-white/5">
              <span className="text-cyan-400 font-extrabold">R</span>
            </div>
            <span className="text-white font-extrabold text-lg">
              Resume<span className="text-cyan-400">Builder</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center lg:text-left">
            Create your account
          </h2>
          <p className="text-slate-400 text-sm mt-2 text-center lg:text-left">
            Takes less than a minute — no credit card needed.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Hafsa Aziz"
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition pr-11"
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400"
                >
                  {visible ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <RxAvatar className="w-7 h-7 text-slate-400" />
                )}
              </span>
              <label
                htmlFor="file-input"
                className="cursor-pointer text-sm font-medium text-cyan-400 hover:text-cyan-300 border border-cyan-400/30 rounded-lg px-4 py-2"
              >
                Upload photo
                <input
                  type="file"
                  id="file-input"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileInputChange}
                  className="sr-only"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-[#020617] bg-cyan-400 hover:bg-cyan-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 font-semibold hover:text-cyan-300">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

*/