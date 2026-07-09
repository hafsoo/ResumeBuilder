import React from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from "react-icons/fi";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 px-6 md:px-16 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
                <span className="text-cyan-600 font-extrabold text-sm">R</span>
              </div>
              <span className="font-extrabold text-slate-900">
                Resume<span className="text-cyan-600">Builder</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Build a clean, ATS-friendly resume in minutes and get one step
              closer to your next job.
            </p>
          </div>

          {/* product */}
          <div>
            <p className="text-sm font-bold text-slate-900 mb-3">Product</p>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/dashboard" className="hover:text-cyan-600 transition">My resumes</Link></li>
              <li><Link to="/" className="hover:text-cyan-600 transition">Templates</Link></li>
              <li><Link to="/" className="hover:text-cyan-600 transition">Pricing</Link></li>
            </ul>
          </div>

          {/* company */}
          <div>
            <p className="text-sm font-bold text-slate-900 mb-3">Company</p>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/" className="hover:text-cyan-600 transition">About us</Link></li>
              <li><Link to="/" className="hover:text-cyan-600 transition">Careers</Link></li>
              <li><Link to="/" className="hover:text-cyan-600 transition">Contact</Link></li>
            </ul>
          </div>

          {/* legal */}
          <div>
            <p className="text-sm font-bold text-slate-900 mb-3">Legal</p>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/" className="hover:text-cyan-600 transition">Privacy policy</Link></li>
              <li><Link to="/" className="hover:text-cyan-600 transition">Terms of service</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            © {year} ResumeBuilder. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-cyan-600 transition"><FiTwitter size={18} /></a>
            <a href="#" className="hover:text-cyan-600 transition"><FiLinkedin size={18} /></a>
            <a href="#" className="hover:text-cyan-600 transition"><FiGithub size={18} /></a>
            <a href="#" className="hover:text-cyan-600 transition"><FiMail size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;