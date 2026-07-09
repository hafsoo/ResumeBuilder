import React from "react";

// variant: "login" | "signup" — swaps headline + subtle badge detail
const AuthShowcase = ({ variant = "login" }) => {
  return (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 min-h-screen bg-gradient-to-br from-[#020617] via-[#0b1c2c] to-[#101a33] px-14 py-12 overflow-hidden">
      {/* ambient glow blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px]" />

      {/* logo */}
      <div className="relative z-10 flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl border border-cyan-400/40 flex items-center justify-center bg-white/5 backdrop-blur">
          <span className="text-cyan-400 font-extrabold text-lg">R</span>
        </div>
        <span className="text-white font-extrabold text-lg tracking-wide">
          Resume<span className="text-cyan-400">Builder</span>
        </span>
      </div>

      {/* illustration: stacked resume cards */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <svg viewBox="0 0 340 320" className="w-full max-w-md">
          {/* back card (top-right) */}
          <g opacity="0.55">
            <rect
              x="150"
              y="18"
              width="150"
              height="200"
              rx="14"
              fill="#0f1f2e"
              stroke="#ffffff"
              strokeOpacity="0.12"
            />
            <circle cx="188" cy="52" r="14" fill="#ffffff" fillOpacity="0.08" />
            <circle cx="188" cy="48" r="5" fill="#ffffff" fillOpacity="0.35" />
            <path
              d="M180 60c2-6 14-6 16 0"
              stroke="#ffffff"
              strokeOpacity="0.3"
              strokeWidth="2"
              fill="none"
            />
            <rect
              x="212"
              y="45"
              width="60"
              height="6"
              rx="3"
              fill="#ffffff"
              fillOpacity="0.15"
            />
            <rect
              x="212"
              y="57"
              width="45"
              height="5"
              rx="2.5"
              fill="#ffffff"
              fillOpacity="0.1"
            />
            <rect
              x="168"
              y="90"
              width="114"
              height="5"
              rx="2.5"
              fill="#ffffff"
              fillOpacity="0.1"
            />
            <rect
              x="168"
              y="102"
              width="90"
              height="5"
              rx="2.5"
              fill="#ffffff"
              fillOpacity="0.1"
            />
            <rect
              x="168"
              y="114"
              width="104"
              height="5"
              rx="2.5"
              fill="#ffffff"
              fillOpacity="0.1"
            />
          </g>

          {/* back card (top-left) */}
          <g opacity="0.7">
            <rect
              x="24"
              y="60"
              width="150"
              height="200"
              rx="14"
              fill="#0f1f2e"
              stroke="#ffffff"
              strokeOpacity="0.14"
            />
            <circle cx="62" cy="94" r="15" fill="#ffffff" fillOpacity="0.08" />
            <circle cx="62" cy="90" r="5.5" fill="#818cf8" fillOpacity="0.8" />
            <path
              d="M53 103c2-7 16-7 18 0"
              stroke="#818cf8"
              strokeOpacity="0.7"
              strokeWidth="2.2"
              fill="none"
            />
            <rect
              x="88"
              y="87"
              width="60"
              height="6"
              rx="3"
              fill="#ffffff"
              fillOpacity="0.18"
            />
            <rect
              x="88"
              y="99"
              width="45"
              height="5"
              rx="2.5"
              fill="#ffffff"
              fillOpacity="0.12"
            />
            <rect
              x="42"
              y="132"
              width="114"
              height="5"
              rx="2.5"
              fill="#ffffff"
              fillOpacity="0.12"
            />
            <rect
              x="42"
              y="144"
              width="90"
              height="5"
              rx="2.5"
              fill="#ffffff"
              fillOpacity="0.12"
            />
            <rect
              x="42"
              y="156"
              width="104"
              height="5"
              rx="2.5"
              fill="#ffffff"
              fillOpacity="0.12"
            />
            <rect
              x="42"
              y="168"
              width="70"
              height="5"
              rx="2.5"
              fill="#ffffff"
              fillOpacity="0.12"
            />
          </g>

          {/* front card (centered, most prominent) */}
          <g>
            <rect
              x="76"
              y="106"
              width="168"
              height="204"
              rx="16"
              fill="#0b1220"
              stroke="#22d3ee"
              strokeOpacity="0.4"
              strokeWidth="1.5"
            />
            <circle
              cx="118"
              cy="144"
              r="18"
              fill="#ffffff"
              fillOpacity="0.06"
              stroke="#818cf8"
              strokeOpacity="0.5"
            />
            <circle cx="118" cy="139" r="6.5" fill="#818cf8" />
            <path
              d="M107 152c2.5-8 19-8 22 0"
              stroke="#818cf8"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
            />

            {/* accent name bar */}
            <rect x="150" y="136" width="66" height="8" rx="4" fill="#22d3ee" />

            {/* body lines */}
            <rect
              x="94"
              y="182"
              width="134"
              height="6"
              rx="3"
              fill="#ffffff"
              fillOpacity="0.18"
            />
            <rect
              x="94"
              y="196"
              width="110"
              height="6"
              rx="3"
              fill="#ffffff"
              fillOpacity="0.18"
            />
            <rect
              x="94"
              y="210"
              width="124"
              height="6"
              rx="3"
              fill="#ffffff"
              fillOpacity="0.18"
            />
            <rect
              x="94"
              y="228"
              width="90"
              height="6"
              rx="3"
              fill="#ffffff"
              fillOpacity="0.14"
            />
            <rect
              x="94"
              y="242"
              width="118"
              height="6"
              rx="3"
              fill="#ffffff"
              fillOpacity="0.14"
            />
            <rect
              x="94"
              y="256"
              width="70"
              height="6"
              rx="3"
              fill="#ffffff"
              fillOpacity="0.14"
            />
          </g>

          {/* checkmark badge, overlapping bottom-right of front card */}
          <circle cx="238" cy="278" r="28" fill="#22d3ee" />
          <path
            d="M226 278 l9 9 18 -19"
            stroke="#020617"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default AuthShowcase;
