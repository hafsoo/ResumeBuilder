import React from "react";
import { FiStar } from "react-icons/fi";

const TESTIMONIALS = [
  {
    name: "Ayesha Khan",
    role: "Marketing Executive",
    initials: "AK",
    quote:
      "I built my resume in under 15 minutes and got 3 interview calls the same week. The templates actually look professional.",
  },
  {
    name: "Bilal Ahmed",
    role: "Software Engineer",
    initials: "BA",
    quote:
      "Finally a resume builder that doesn't feel clunky. Adding projects and skills was so simple, and the preview updates instantly.",
  },
  {
    name: "Sara Malik",
    role: "Fresh Graduate",
    initials: "SM",
    quote:
      "As a first-time job seeker I had no idea how to structure a resume. This walked me through every section step by step.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 px-6 md:px-16 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold tracking-wider text-cyan-600 uppercase mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Loved by job seekers everywhere
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <FiStar
                    key={s}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;