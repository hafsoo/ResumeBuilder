import React from "react";
import { useNavigate } from "react-router-dom";

const FloatingPage = ({ className, rotate }) => (
  <div
    className={`absolute w-10 h-14 bg-white/90 rounded-sm shadow-md ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  />
);

const GetHiredBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="px-6 md:px-16 py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1c2c] to-[#0f2a3d] px-8 py-16 md:py-20 text-center">
        {/* floating decorative pages */}
        <FloatingPage className="top-10 left-10 bg-cyan-200/80" rotate={-18} />
        <FloatingPage className="bottom-10 left-16 hidden sm:block" rotate={10} />
        <FloatingPage className="top-14 right-14 bg-amber-200/80 hidden sm:block" rotate={16} />
        <FloatingPage className="bottom-12 right-10" rotate={-8} />

        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Get noticed, get hired faster
          </h2>
          <p className="text-slate-300 text-sm md:text-base mb-8">
            If you want a better job, start with a standout resume. Create
            yours now to get a step closer to your next big opportunity.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-400 transition"
          >
            Land your dream job now
          </button>
        </div>
      </div>
    </section>
  );
};

export default GetHiredBanner;