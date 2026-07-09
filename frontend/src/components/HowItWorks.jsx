import React from "react";
import { FiEdit3, FiEye, FiDownload } from "react-icons/fi";
import bannerImage from "../Assets/banner.png";

const STEPS = [
  {
    icon: FiEdit3,
    title: "Fill in your details",
    description:
      "Walk through a simple step-by-step form — Personal Info, Education, Experience, Skills, and Projects. Your progress saves automatically at every step.",
  },
  {
    icon: FiEye,
    title: "Preview instantly",
    description:
      "See exactly how your resume will look with our clean, single-column, ATS-friendly layout — no clutter, no graphics, just what recruiters and applicant tracking systems actually read.",
  },
  {
    icon: FiDownload,
    title: "Download your resume in seconds",
    description:
      "Print or save your finished resume as a PDF straight from the preview page, ready to send to any recruiter or job board.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-6 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* left: image placeholder */}
        <div className="relative">
          <div className="w-full aspect-[4/3] rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
            <img
              //src="../Assets/banner.png"
              src={bannerImage}
              alt="Resume builder preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* right: heading + steps */}
        <div>
          <h2 className="text-3xl md:text-[40px] font-extrabold leading-tight text-slate-900 mb-10">
            Create a free, job-winning{" "}
            <span className="text-cyan-600">resume in 3 simple steps</span>
          </h2>

          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-px bg-slate-200" />

            <div className="space-y-10">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="relative flex gap-5">
                    <div className="relative z-10 shrink-0 w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-wider text-cyan-600 uppercase mb-1">
                        Step {i + 1}
                      </p>
                      <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                        {step.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;