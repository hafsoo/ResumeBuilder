import React from "react";

const RESUME_CARDS = [
  { top: "8%", left: "6%", size: 150, rotate: -14, delay: 0, dur: 22 },
  { top: "62%", left: "10%", size: 110, rotate: 10, delay: 2, dur: 26 },
  { top: "14%", left: "82%", size: 130, rotate: 12, delay: 1, dur: 24 },
  { top: "68%", left: "80%", size: 160, rotate: -8, delay: 3, dur: 20 },
  { top: "38%", left: "2%", size: 90, rotate: 6, delay: 4, dur: 28 },
  { top: "4%", left: "42%", size: 100, rotate: -6, delay: 1.5, dur: 25 },
  { top: "78%", left: "46%", size: 120, rotate: 4, delay: 2.5, dur: 23 },
  { top: "42%", left: "90%", size: 95, rotate: -12, delay: 0.5, dur: 27 },
];

const ResumeCard = ({ top, left, size, rotate, delay, dur }) => (
  <div
    className="resume-card"
    style={{
      top,
      left,
      width: size,
      height: size * 1.3,
      "--rotate": `${rotate}deg`,
      "--delay": `${delay}s`,
      "--dur": `${dur}s`,
    }}
  >
    <div className="resume-card__avatar" />
    <div className="resume-card__line resume-card__line--name" />
    <div className="resume-card__line resume-card__line--role" />
    <div className="resume-card__line" />
    <div className="resume-card__line" />
    <div className="resume-card__line resume-card__line--short" />
    <div className="resume-card__line" />
    <div className="resume-card__line resume-card__line--short" />
  </div>
);

// onCreateClick opens the "name your resume" modal 
// onViewClick navigates to the dashboard 
const Hero = ({ onCreateClick, onViewClick }) => {
  return (
    <>
      <style>{`
        @keyframes drift {
          0%   { transform: translateY(0px) rotate(var(--rotate)); }
          50%  { transform: translateY(-26px) rotate(calc(var(--rotate) + 2deg)); }
          100% { transform: translateY(0px) rotate(var(--rotate)); }
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .resume-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.55);
          border: 1px solid rgba(2, 132, 199, 0.18);
          border-radius: 14px;
          box-shadow: 0 20px 45px -20px rgba(15, 23, 42, 0.25);
          padding: 14px;
          animation: drift var(--dur) ease-in-out var(--delay) infinite;
          backdrop-filter: blur(1px);
        }
        .resume-card__avatar {
          width: 26%;
          aspect-ratio: 1;
          border-radius: 999px;
          background: rgba(2, 132, 199, 0.35);
          margin-bottom: 10px;
        }
        .resume-card__line {
          height: 6px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.12);
          margin-bottom: 8px;
          width: 90%;
        }
        .resume-card__line--name {
          width: 65%;
          height: 8px;
          background: rgba(2, 132, 199, 0.4);
        }
        .resume-card__line--role {
          width: 45%;
          background: rgba(15, 23, 42, 0.18);
        }
        .resume-card__line--short {
          width: 55%;
        }
        .hero-content > * {
          animation: riseIn 0.7s ease both;
        }
        .hero-content > *:nth-child(2) { animation-delay: 0.08s; }
        .hero-content > *:nth-child(3) { animation-delay: 0.16s; }

        @media (prefers-reduced-motion: reduce) {
          .resume-card { animation: none; }
          .hero-content > * { animation: none; }
        }
      `}</style>

      <div
        id="Home"
        className="relative w-full min-h-[90vh] flex items-center justify-center px-6 md:px-20 py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
      >
        {/* Ambient background blobs */}
        <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-blue-400/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-[120px]" />

        {/* Floating resume cards */}
        <div className="absolute inset-0 pointer-events-none">
          {RESUME_CARDS.map((card, i) => (
            <ResumeCard key={i} {...card} />
          ))}
        </div>

        {/* Soft veil so cards stay in the background, behind the text */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white/10" />

        {/* Centered content */}
        <div className="hero-content relative z-10 text-center max-w-2xl mx-auto">
          <h1 className="text-[36px] md:text-[58px] font-extrabold leading-[1.1] text-gray-900">
            The ultimate resume builder
          </h1>

          <p className="mt-6 text-[17px] text-gray-600 leading-relaxed max-w-xl mx-auto">
            Build recruiter-tested templates in minutes. Our resume builder is
            powerful and easy to use.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
            <button
              onClick={onCreateClick}
              className="px-8 py-3.5 rounded-xl font-semibold text-white transition-transform hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
                boxShadow: "0 8px 24px rgba(2, 132, 199, 0.35)",
              }}
            >
              Create New Resume
            </button>

            <button
              onClick={onViewClick}
              className="px-8 py-3.5 rounded-xl font-semibold transition-colors"
              style={{
                background: "transparent",
                border: "2px solid rgba(2, 132, 199, 0.6)",
                color: "#0284c7",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(2,132,199,0.08)";
                e.currentTarget.style.borderColor = "#0284c7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(2,132,199,0.6)";
              }}
            >
              View Existing Resumes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;