/*
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { loadSingleResume, updateResume } from "../redux/actions/resume";

const STEPS = [
  { id: "personal", label: "Personal Info" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
];

const emptyPersonal = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  linkedin: "",
  github: "",
  portfolio: "",
  summary: "",
};

const ResumeForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeResume } = useSelector((state) => state.resume);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stepIndex, setStepIndex] = useState(() => {
    const saved = sessionStorage.getItem(`resume-step-${id}`);
    return saved !== null ? Number(saved) : 0;
  });
  const [resumeName, setResumeName] = useState("");
  const [personalInfo, setPersonalInfo] = useState(emptyPersonal);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  // load existing resume data on mount
  useEffect(() => {
    let isMounted = true;
    const fetchResume = async () => {
      try {
        const resume = await dispatch(loadSingleResume(id));
        if (!isMounted) return;
        setResumeName(resume?.resumeName || "");
        setPersonalInfo({ ...emptyPersonal, ...(resume?.personalInfo || {}) });
        setEducation(Array.isArray(resume?.education) ? resume.education : []);
        setExperience(Array.isArray(resume?.experience) ? resume.experience : []);
        setSkills(Array.isArray(resume?.skills) ? resume.skills : []);
        setProjects(Array.isArray(resume?.projects) ? resume.projects : []);
      } catch (err) {
        if (!isMounted) return;
        toast.error(err.response?.data?.message || "Could not load resume", {
          toastId: "resume-load-error",
        });
        navigate("/dashboard");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchResume();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // remember which step the user was on, so navigating away (e.g. to
  // Preview) and coming back doesn't reset them to step 1
  useEffect(() => {
    sessionStorage.setItem(`resume-step-${id}`, stepIndex);
  }, [stepIndex, id]);

 
  const validateStep = useCallback(
    (stepId) => {
      if (stepId === "personal") {
        if (!resumeName.trim()) {
          toast.error("Please give your resume a name", { toastId: "err-resumeName" });
          return false;
        }
        if (!personalInfo.fullName.trim()) {
          toast.error("Full name is required", { toastId: "err-fullName" });
          return false;
        }
        if (!personalInfo.email.trim()) {
          toast.error("Email is required", { toastId: "err-email" });
          return false;
        }
        if (!personalInfo.phone.trim()) {
          toast.error("Phone number is required", { toastId: "err-phone" });
          return false;
        }
        if (!personalInfo.linkedin.trim()) {
          toast.error("LinkedIn profile is required", { toastId: "err-linkedin" });
          return false;
        }
        return true;
      }

      if (stepId === "education") {
        if (education.length === 0) {
          toast.error("Please add at least one education entry", { toastId: "err-education" });
          return false;
        }
        for (let i = 0; i < education.length; i++) {
          const e = education[i];
          if (!e.degree?.trim() || !e.institute?.trim() || !e.startDate?.trim()) {
            toast.error(`Education #${i + 1}: degree, institute, and start date are required`, {
              toastId: "err-education-fields",
            });
            return false;
          }
        }
        return true;
      }

      if (stepId === "experience") {
        for (let i = 0; i < experience.length; i++) {
          const e = experience[i];
          if (!e.company?.trim() || !e.position?.trim() || !e.startDate?.trim()) {
            toast.error(`Experience #${i + 1}: company, position, and start date are required`, {
              toastId: "err-experience-fields",
            });
            return false;
          }
        }
        return true;
      }
      if (stepId === "skills") {
        if (skills.length === 0) {
          toast.error("Please add at least one skill", { toastId: "err-skills" });
          return false;
        }
        return true;
      }
      if (stepId === "projects") {
        for (let i = 0; i < projects.length; i++) {
          if (!projects[i].name?.trim()) {
            toast.error(`Project #${i + 1}: project name is required`, {
              toastId: "err-projects-fields",
            });
            return false;
          }
        }
        return true;
      }
      return true;
    },
    [resumeName, personalInfo, education, experience, skills, projects]
  );

  const validateAllSteps = () => {
    for (const step of STEPS) {
      if (!validateStep(step.id)) {
        setStepIndex(STEPS.findIndex((s) => s.id === step.id));
        return false;
      }
    }
    return true;
  };

  const buildPayload = (isComplete = false) => ({
    resumeName,
    personalInfo,
    education,
    experience,
    skills,
    projects,
    isComplete,
  });

  const handleSave = async ({ andExit = false, silent = false, isComplete = false } = {}) => {
    if (saving) return false;
    setSaving(true);
    try {
      await dispatch(updateResume(id, buildPayload(isComplete)));
      if (!silent) {
        toast.success("Resume saved!", { toastId: "resume-save-success" });
      }
      if (andExit) navigate("/dashboard");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed", {
        toastId: "resume-save-error",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const currentStep = STEPS[stepIndex].id;

  // Fires ONLY when the "Save & continue" button is clicked.
  const goNext = async () => {
    if (saving) return;
    if (!validateStep(currentStep)) return;
    const ok = await handleSave({ silent: true });
    if (!ok) return; // stop navigation if save failed
    toast.success("Saved. Moving to next step.", { toastId: "resume-step-saved" });
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  // Going back never validates or saves — just moves the view.
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleFinish = async () => {
    if (saving) return;
    if (!validateAllSteps()) return;
    const ok = await handleSave({ andExit: true, isComplete: true });
    if (ok) sessionStorage.removeItem(`resume-step-${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">
          Loading resume...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <input
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            placeholder="Resume name *"
            className="text-xl font-bold text-slate-900 bg-transparent outline-none border-b-2 border-transparent focus:border-cyan-500 transition"
          />
          <button
            type="button"
            onClick={() => navigate(`/resume/${id}/preview`)}
            className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
          >
            Preview →
          </button>
        </div>

        
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => {
                  if (i <= stepIndex) setStepIndex(i);
                }}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  i === stepIndex
                    ? "bg-cyan-600 text-white"
                    : i < stepIndex
                    ? "bg-cyan-50 text-cyan-700"
                    : "bg-slate-100 text-slate-500 cursor-not-allowed"
                }`}
              >
                {i + 1}. {step.label}
              </button>
              {i < STEPS.length - 1 && (
                <div className="w-6 h-px bg-slate-300 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

       
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {currentStep === "personal" && (
            <PersonalInfoStep data={personalInfo} onChange={setPersonalInfo} />
          )}
          {currentStep === "education" && (
            <EducationStep data={education} onChange={setEducation} />
          )}
          {currentStep === "experience" && (
            <ExperienceStep data={experience} onChange={setExperience} />
          )}
          {currentStep === "skills" && (
            <SkillsStep data={skills} onChange={setSkills} />
          )}
          {currentStep === "projects" && (
            <ProjectsStep data={projects} onChange={setProjects} />
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0 || saving}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Back
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (validateStep(currentStep)) handleSave({ andExit: true });
                }}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-cyan-700 border border-cyan-200 hover:bg-cyan-50 transition disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save & exit"}
              </button>

              {stepIndex < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save & continue →"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Finish"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder, type = "text", area }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label}
    </label>
    {area ? (
      <textarea
        rows={3}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition resize-none"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition"
      />
    )}
  </div>
);


const PersonalInfoStep = ({ data, onChange }) => {
  const set = (key) => (e) => onChange({ ...data, [key]: e.target.value });

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">Personal Information</h2>
      <p className="text-slate-500 text-sm mb-6">
        Fields marked * are required to save your resume.
      </p>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name *" value={data.fullName} onChange={set("fullName")} placeholder="Hafsa Aziz" />
        <Field label="Email *" value={data.email} onChange={set("email")} placeholder="you@example.com" type="email" />
        <Field label="Phone *" value={data.phone} onChange={set("phone")} placeholder="+92 300 1234567" />
        <Field label="LinkedIn *" value={data.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/..." />
        <Field label="Address" value={data.address} onChange={set("address")} placeholder="Lahore, Pakistan" />
        <Field label="GitHub" value={data.github} onChange={set("github")} placeholder="github.com/..." />
        <Field label="Portfolio" value={data.portfolio} onChange={set("portfolio")} placeholder="yourportfolio.com" />
      </div>
      <div className="mt-5">
        <Field
          label="Professional summary"
          value={data.summary}
          onChange={set("summary")}
          placeholder="2-3 sentences about who you are and what you do"
          area
        />
      </div>
    </div>
  );
};


const RepeatableSection = ({ title, subtitle, items, onChange, emptyItem, renderFields, addLabel }) => {
  const updateItem = (index, updated) => {
    const next = [...items];
    next[index] = updated;
    onChange(next);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addItem = () => onChange([...items, { ...emptyItem }]);

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">{title}</h2>
      <p className="text-slate-500 text-sm mb-6">{subtitle}</p>

      <div className="space-y-5">
        {items.map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-xl p-5 relative">
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="absolute top-3 right-3 text-xs font-semibold text-red-500 hover:text-red-600"
            >
              Remove
            </button>
            {renderFields(item, (updated) => updateItem(i, updated))}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-slate-400 text-sm italic mb-4">Nothing added yet.</p>
      )}

      <button
        type="button"
        onClick={addItem}
        className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold text-cyan-700 border border-cyan-200 bg-cyan-50 hover:bg-cyan-100 transition"
      >
        + {addLabel}
      </button>
    </div>
  );
};


const EducationStep = ({ data, onChange }) => (
  <RepeatableSection
    title="Education"
    subtitle="Add at least one entry. Degree, institute, and start date are required."
    items={data}
    onChange={onChange}
    addLabel="Add education"
    emptyItem={{ degree: "", institute: "", startDate: "", endDate: "", cgpa: "" }}
    renderFields={(item, update) => (
      <div className="grid sm:grid-cols-2 gap-4 pr-16">
        <Field label="Degree *" value={item.degree} onChange={(e) => update({ ...item, degree: e.target.value })} placeholder="BS Computer Science" />
        <Field label="Institute *" value={item.institute} onChange={(e) => update({ ...item, institute: e.target.value })} placeholder="University name" />
        <Field label="Start date *" value={item.startDate} onChange={(e) => update({ ...item, startDate: e.target.value })} placeholder="2021" />
        <Field label="End date" value={item.endDate} onChange={(e) => update({ ...item, endDate: e.target.value })} placeholder="2025 or Present" />
        <Field label="CGPA" value={item.cgpa} onChange={(e) => update({ ...item, cgpa: e.target.value })} placeholder="3.8/4.0" />
      </div>
    )}
  />
);

const ExperienceStep = ({ data, onChange }) => (
  <RepeatableSection
    title="Experience"
    subtitle="Optional. If you add an entry, company, position, and start date are required."
    items={data}
    onChange={onChange}
    addLabel="Add experience"
    emptyItem={{ company: "", position: "", startDate: "", endDate: "", description: "" }}
    renderFields={(item, update) => (
      <div className="grid sm:grid-cols-2 gap-4 pr-16">
        <Field label="Company *" value={item.company} onChange={(e) => update({ ...item, company: e.target.value })} placeholder="Company name" />
        <Field label="Position *" value={item.position} onChange={(e) => update({ ...item, position: e.target.value })} placeholder="Frontend Developer" />
        <Field label="Start date *" value={item.startDate} onChange={(e) => update({ ...item, startDate: e.target.value })} placeholder="Jan 2023" />
        <Field label="End date" value={item.endDate} onChange={(e) => update({ ...item, endDate: e.target.value })} placeholder="Present" />
        <div className="sm:col-span-2">
          <Field label="Description" value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} placeholder="What did you work on?" area />
        </div>
      </div>
    )}
  />
);

const SkillsStep = ({ data, onChange }) => {
  const [input, setInput] = useState("");

  const addSkill = (e) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    if (data.includes(value)) {
      setInput("");
      return;
    }
    onChange([...data, value]);
    setInput("");
  };

  const removeSkill = (skill) => onChange(data.filter((s) => s !== skill));

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">Skills</h2>
      <p className="text-slate-500 text-sm mb-6">
        Add at least one skill. Type it and press Enter.
      </p>

      <form onSubmit={addSkill} className="flex gap-3 mb-5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. React"
          className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition"
        >
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {data.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 text-cyan-700 text-sm font-medium"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-cyan-500 hover:text-cyan-700 font-bold leading-none"
            >
              ×
            </button>
          </span>
        ))}
        {data.length === 0 && (
          <p className="text-slate-400 text-sm italic">No skills added yet.</p>
        )}
      </div>
    </div>
  );
};

const ProjectsStep = ({ data, onChange }) => (
  <RepeatableSection
    title="Projects"
    subtitle="Optional. If you add an entry, project name is required."
    items={data}
    onChange={onChange}
    addLabel="Add project"
    emptyItem={{ name: "", technologies: "", description: "", githubLink: "", liveLink: "" }}
    renderFields={(item, update) => (
      <div className="grid sm:grid-cols-2 gap-4 pr-16">
        <Field label="Project name *" value={item.name} onChange={(e) => update({ ...item, name: e.target.value })} placeholder="Resume Builder" />
        <Field label="Technologies" value={item.technologies} onChange={(e) => update({ ...item, technologies: e.target.value })} placeholder="React, Node, MongoDB" />
        <Field label="GitHub link" value={item.githubLink} onChange={(e) => update({ ...item, githubLink: e.target.value })} placeholder="github.com/..." />
        <Field label="Live link" value={item.liveLink} onChange={(e) => update({ ...item, liveLink: e.target.value })} placeholder="yourproject.com" />
        <div className="sm:col-span-2">
          <Field label="Description" value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} placeholder="What does this project do?" area />
        </div>
      </div>
    )}
  />
);

export default ResumeForm;

*/


import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { loadSingleResume, updateResume } from "../redux/actions/resume";
import ResumePreviewContent from "./ResumePreviewContent";

const STEPS = [
  { id: "personal", label: "Personal Info" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
];

const emptyPersonal = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  linkedin: "",
  github: "",
  portfolio: "",
  summary: "",
};

const ResumeForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeResume } = useSelector((state) => state.resume);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stepIndex, setStepIndex] = useState(() => {
    const saved = sessionStorage.getItem(`resume-step-${id}`);
    return saved !== null ? Number(saved) : 0;
  });
  const [resumeName, setResumeName] = useState("");
  const [personalInfo, setPersonalInfo] = useState(emptyPersonal);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  // load existing resume data on mount
  useEffect(() => {
    let isMounted = true;
    const fetchResume = async () => {
      try {
        const resume = await dispatch(loadSingleResume(id));
        if (!isMounted) return;
        setResumeName(resume?.resumeName || "");
        setPersonalInfo({ ...emptyPersonal, ...(resume?.personalInfo || {}) });
        setEducation(Array.isArray(resume?.education) ? resume.education : []);
        setExperience(Array.isArray(resume?.experience) ? resume.experience : []);
        setSkills(Array.isArray(resume?.skills) ? resume.skills : []);
        setProjects(Array.isArray(resume?.projects) ? resume.projects : []);
      } catch (err) {
        if (!isMounted) return;
        toast.error(err.response?.data?.message || "Could not load resume", {
          toastId: "resume-load-error",
        });
        navigate("/dashboard");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchResume();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  useEffect(() => {
    sessionStorage.setItem(`resume-step-${id}`, stepIndex);
  }, [stepIndex, id]);

  /* ---------- validation ---------- */
  // Only ever called explicitly from a button click — never during render.
  const validateStep = useCallback(
    (stepId) => {
      if (stepId === "personal") {
        if (!resumeName.trim()) {
          toast.error("Please give your resume a name", { toastId: "err-resumeName" });
          return false;
        }
        if (!personalInfo.fullName.trim()) {
          toast.error("Full name is required", { toastId: "err-fullName" });
          return false;
        }
        if (!personalInfo.email.trim()) {
          toast.error("Email is required", { toastId: "err-email" });
          return false;
        }
        if (!personalInfo.phone.trim()) {
          toast.error("Phone number is required", { toastId: "err-phone" });
          return false;
        }
        if (!personalInfo.linkedin.trim()) {
          toast.error("LinkedIn profile is required", { toastId: "err-linkedin" });
          return false;
        }
        return true;
      }

      if (stepId === "education") {
        if (education.length === 0) {
          toast.error("Please add at least one education entry", { toastId: "err-education" });
          return false;
        }
        for (let i = 0; i < education.length; i++) {
          const e = education[i];
          if (!e.degree?.trim() || !e.institute?.trim() || !e.startDate?.trim()) {
            toast.error(`Education #${i + 1}: degree, institute, and start date are required`, {
              toastId: "err-education-fields",
            });
            return false;
          }
        }
        return true;
      }

      if (stepId === "experience") {
        for (let i = 0; i < experience.length; i++) {
          const e = experience[i];
          if (!e.company?.trim() || !e.position?.trim() || !e.startDate?.trim()) {
            toast.error(`Experience #${i + 1}: company, position, and start date are required`, {
              toastId: "err-experience-fields",
            });
            return false;
          }
        }
        return true;
      }
      if (stepId === "skills") {
        if (skills.length === 0) {
          toast.error("Please add at least one skill", { toastId: "err-skills" });
          return false;
        }
        return true;
      }
      if (stepId === "projects") {
        for (let i = 0; i < projects.length; i++) {
          if (!projects[i].name?.trim()) {
            toast.error(`Project #${i + 1}: project name is required`, {
              toastId: "err-projects-fields",
            });
            return false;
          }
        }
        return true;
      }
      return true;
    },
    [resumeName, personalInfo, education, experience, skills, projects]
  );

  const validateAllSteps = () => {
    for (const step of STEPS) {
      if (!validateStep(step.id)) {
        setStepIndex(STEPS.findIndex((s) => s.id === step.id));
        return false;
      }
    }
    return true;
  };

  const buildPayload = (isComplete = false) => ({
    resumeName,
    personalInfo,
    education,
    experience,
    skills,
    projects,
    isComplete,
  });

  const handleSave = async ({ andExit = false, silent = false, isComplete = false } = {}) => {
    if (saving) return false;
    setSaving(true);
    try {
      await dispatch(updateResume(id, buildPayload(isComplete)));
      if (!silent) {
        toast.success("Resume saved!", { toastId: "resume-save-success" });
      }
      if (andExit) navigate("/dashboard");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed", {
        toastId: "resume-save-error",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const currentStep = STEPS[stepIndex].id;

  // Fires ONLY when the "Save & continue" button is clicked.
  const goNext = async () => {
    if (saving) return;
    if (!validateStep(currentStep)) return;
    const ok = await handleSave({ silent: true });
    if (!ok) return; // stop navigation if save failed
    toast.success("Saved. Moving to next step.", { toastId: "resume-step-saved" });
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  // Going back never validates or saves — just moves the view.
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleFinish = async () => {
    if (saving) return;
    if (!validateAllSteps()) return;
    const ok = await handleSave({ andExit: true, isComplete: true });
    if (ok) sessionStorage.removeItem(`resume-step-${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">
          Loading resume...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <input
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            placeholder="Resume name *"
            className="text-xl font-bold text-slate-900 bg-transparent outline-none border-b-2 border-transparent focus:border-cyan-500 transition"
          />
          <button
            type="button"
            onClick={() => navigate(`/resume/${id}/preview`)}
            className="lg:hidden text-sm font-semibold text-cyan-700 hover:text-cyan-800"
          >
            Preview →
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {/* ---------- left column: the form ---------- */}
          <div>
           <div className="mb-8">
  {/* progress bar + current step label */}
  <div className="flex items-center justify-between mb-2">
    <span className="text-xs font-semibold text-slate-500">
      Step {stepIndex + 1} of {STEPS.length}
    </span>
    <span className="text-xs font-semibold text-cyan-600">
      {STEPS[stepIndex].label}
    </span>
  </div>
  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
    <div
      className="h-full bg-cyan-600 rounded-full transition-all duration-300"
      style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
    />
  </div>

  {/* step pills — wrap instead of horizontal scroll */}
  <div className="flex flex-wrap gap-2">
    {STEPS.map((step, i) => {
      const isActive = i === stepIndex;
      const isDone = i < stepIndex;
      const isLocked = i > stepIndex;

      return (
        <button
          key={step.id}
          type="button"
          onClick={() => {
            if (i <= stepIndex) setStepIndex(i);
          }}
          disabled={isLocked}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
            isActive
              ? "bg-cyan-600 text-white shadow-sm"
              : isDone
              ? "bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isDone && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
          <span>{i + 1}. {step.label}</span>
        </button>
      );
    })}
  </div>
</div>

            {/* active step content */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              {currentStep === "personal" && (
                <PersonalInfoStep data={personalInfo} onChange={setPersonalInfo} />
              )}
              {currentStep === "education" && (
                <EducationStep data={education} onChange={setEducation} />
              )}
              {currentStep === "experience" && (
                <ExperienceStep data={experience} onChange={setExperience} />
              )}
              {currentStep === "skills" && (
                <SkillsStep data={skills} onChange={setSkills} />
              )}
              {currentStep === "projects" && (
                <ProjectsStep data={projects} onChange={setProjects} />
              )}

              {/* nav buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={stepIndex === 0 || saving}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Back
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep(currentStep)) handleSave({ andExit: true });
                    }}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium text-cyan-700 border border-cyan-200 hover:bg-cyan-50 transition disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save & exit"}
                  </button>

                  {stepIndex < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={saving}
                      className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save & continue →"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinish}
                      disabled={saving}
                      className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Finish"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ---------- right column: live preview (desktop only) ---------- */}
          <div className="hidden lg:block sticky top-8 self-start">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-8 py-10 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <ResumePreviewContent
                personalInfo={personalInfo}
                education={education}
                experience={experience}
                skills={skills}
                projects={projects}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- shared small input ---------- */
const Field = ({ label, value, onChange, placeholder, type = "text", area }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label}
    </label>
    {area ? (
      <textarea
        rows={3}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition resize-none"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition"
      />
    )}
  </div>
);

/* ---------- Step 1: Personal Info ---------- */
const PersonalInfoStep = ({ data, onChange }) => {
  const set = (key) => (e) => onChange({ ...data, [key]: e.target.value });

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">Personal Information</h2>
      <p className="text-slate-500 text-sm mb-6">
        Fields marked * are required to save your resume.
      </p>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name *" value={data.fullName} onChange={set("fullName")} placeholder="Hafsa Aziz" />
        <Field label="Email *" value={data.email} onChange={set("email")} placeholder="you@example.com" type="email" />
        <Field label="Phone *" value={data.phone} onChange={set("phone")} placeholder="+92 300 1234567" />
        <Field label="LinkedIn *" value={data.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/..." />
        <Field label="Address" value={data.address} onChange={set("address")} placeholder="Lahore, Pakistan" />
        <Field label="GitHub" value={data.github} onChange={set("github")} placeholder="github.com/..." />
        <Field label="Portfolio" value={data.portfolio} onChange={set("portfolio")} placeholder="yourportfolio.com" />
      </div>
      <div className="mt-5">
        <Field
          label="Professional summary"
          value={data.summary}
          onChange={set("summary")}
          placeholder="2-3 sentences about who you are and what you do"
          area
        />
      </div>
    </div>
  );
};

/* ---------- generic repeatable-section helper ---------- */
const RepeatableSection = ({ title, subtitle, items, onChange, emptyItem, renderFields, addLabel }) => {
  const updateItem = (index, updated) => {
    const next = [...items];
    next[index] = updated;
    onChange(next);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addItem = () => onChange([...items, { ...emptyItem }]);

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">{title}</h2>
      <p className="text-slate-500 text-sm mb-6">{subtitle}</p>

      <div className="space-y-5">
        {items.map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-xl p-5 relative">
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="absolute top-3 right-3 text-xs font-semibold text-red-500 hover:text-red-600"
            >
              Remove
            </button>
            {renderFields(item, (updated) => updateItem(i, updated))}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-slate-400 text-sm italic mb-4">Nothing added yet.</p>
      )}

      <button
        type="button"
        onClick={addItem}
        className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold text-cyan-700 border border-cyan-200 bg-cyan-50 hover:bg-cyan-100 transition"
      >
        + {addLabel}
      </button>
    </div>
  );
};

/* ---------- Step 2: Education (required — at least 1) ---------- */
const EducationStep = ({ data, onChange }) => (
  <RepeatableSection
    title="Education"
    subtitle="Add at least one entry. Degree, institute, and start date are required."
    items={data}
    onChange={onChange}
    addLabel="Add education"
    emptyItem={{ degree: "", institute: "", startDate: "", endDate: "", cgpa: "" }}
    renderFields={(item, update) => (
      <div className="grid sm:grid-cols-2 gap-4 pr-16">
        <Field label="Degree *" value={item.degree} onChange={(e) => update({ ...item, degree: e.target.value })} placeholder="BS Computer Science" />
        <Field label="Institute *" value={item.institute} onChange={(e) => update({ ...item, institute: e.target.value })} placeholder="University name" />
        <Field label="Start date *" value={item.startDate} onChange={(e) => update({ ...item, startDate: e.target.value })} placeholder="2021" />
        <Field label="End date" value={item.endDate} onChange={(e) => update({ ...item, endDate: e.target.value })} placeholder="2025 or Present" />
        <Field label="CGPA" value={item.cgpa} onChange={(e) => update({ ...item, cgpa: e.target.value })} placeholder="3.8/4.0" />
      </div>
    )}
  />
);

/* ---------- Step 3: Experience (optional overall) ---------- */
const ExperienceStep = ({ data, onChange }) => (
  <RepeatableSection
    title="Experience"
    subtitle="Optional. If you add an entry, company, position, and start date are required."
    items={data}
    onChange={onChange}
    addLabel="Add experience"
    emptyItem={{ company: "", position: "", startDate: "", endDate: "", description: "" }}
    renderFields={(item, update) => (
      <div className="grid sm:grid-cols-2 gap-4 pr-16">
        <Field label="Company *" value={item.company} onChange={(e) => update({ ...item, company: e.target.value })} placeholder="Company name" />
        <Field label="Position *" value={item.position} onChange={(e) => update({ ...item, position: e.target.value })} placeholder="Frontend Developer" />
        <Field label="Start date *" value={item.startDate} onChange={(e) => update({ ...item, startDate: e.target.value })} placeholder="Jan 2023" />
        <Field label="End date" value={item.endDate} onChange={(e) => update({ ...item, endDate: e.target.value })} placeholder="Present" />
        <div className="sm:col-span-2">
          <Field label="Description" value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} placeholder="What did you work on?" area />
        </div>
      </div>
    )}
  />
);

/* ---------- Step 4: Skills (required — at least 1) ---------- */
const SkillsStep = ({ data, onChange }) => {
  const [input, setInput] = useState("");

  const addSkill = (e) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    if (data.includes(value)) {
      setInput("");
      return;
    }
    onChange([...data, value]);
    setInput("");
  };

  const removeSkill = (skill) => onChange(data.filter((s) => s !== skill));

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">Skills</h2>
      <p className="text-slate-500 text-sm mb-6">
        Add at least one skill. Type it and press Enter.
      </p>

      <form onSubmit={addSkill} className="flex gap-3 mb-5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. React"
          className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition"
        >
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {data.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 text-cyan-700 text-sm font-medium"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-cyan-500 hover:text-cyan-700 font-bold leading-none"
            >
              ×
            </button>
          </span>
        ))}
        {data.length === 0 && (
          <p className="text-slate-400 text-sm italic">No skills added yet.</p>
        )}
      </div>
    </div>
  );
};

/* ---------- Step 5: Projects (optional overall) ---------- */
const ProjectsStep = ({ data, onChange }) => (
  <RepeatableSection
    title="Projects"
    subtitle="Optional. If you add an entry, project name is required."
    items={data}
    onChange={onChange}
    addLabel="Add project"
    emptyItem={{ name: "", technologies: "", description: "", githubLink: "", liveLink: "" }}
    renderFields={(item, update) => (
      <div className="grid sm:grid-cols-2 gap-4 pr-16">
        <Field label="Project name *" value={item.name} onChange={(e) => update({ ...item, name: e.target.value })} placeholder="Resume Builder" />
        <Field label="Technologies" value={item.technologies} onChange={(e) => update({ ...item, technologies: e.target.value })} placeholder="React, Node, MongoDB" />
        <Field label="GitHub link" value={item.githubLink} onChange={(e) => update({ ...item, githubLink: e.target.value })} placeholder="github.com/..." />
        <Field label="Live link" value={item.liveLink} onChange={(e) => update({ ...item, liveLink: e.target.value })} placeholder="yourproject.com" />
        <div className="sm:col-span-2">
          <Field label="Description" value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} placeholder="What does this project do?" area />
        </div>
      </div>
    )}
  />
);

export default ResumeForm;
