import React, { createContext, useContext, useState, useEffect } from "react";

const ResumeContext = createContext(null);
//localStorage  naam.
const STORAGE_KEY = "resume-builder-data";

const defaultData = {
  name: "John",
  title: "Professional title",
  pitch: "Short and engaging pitch about yourself",
  email: "you@email.com",
  phone: "+92 000 0000000",
  address: "City, Country",
  photo: "",
  experience: [{ role: "Title / Position", company: "Organization", duration: "mm/yyyy - mm/yyyy", description: "Accomplishment / Task" }],
  education: [{ degree: "Study Program", school: "Institution / Organization", duration: "" }],
  skills: ["Skill", "Skill", "Skill"],
  projects: [{ name: "Project Name", stack: "Tech Stack Used", description: "Short description of the project" }],
};

// Page load hote hi localStorage se pehle se saved data uthata hai (agar hai to)
function loadInitialData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error("Failed to load saved resume data:", err);
  }
  return defaultData;
}

export function ResumeProvider({ children }) {
  const [resumeData, setResumeData] = useState(loadInitialData);

  // Jab bhi resumeData change ho, automatically localStorage mein save ho jaata hai
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    } catch (err) {
      console.error("Failed to save resume data:", err);
    }
  }, [resumeData]);

  const updateField = (field, value) =>
    setResumeData((prev) => ({ ...prev, [field]: value }));

  const updateArrayItem = (field, index, key, value) =>
    setResumeData((prev) => {
      const updated = [...prev[field]];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, [field]: updated };
    });

  const addArrayItem = (field, emptyItem) =>
    setResumeData((prev) => ({ ...prev, [field]: [...prev[field], emptyItem] }));

  const removeArrayItem = (field, index) =>
    setResumeData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));

  const updateSkill = (index, value) =>
    setResumeData((prev) => {
      const updated = [...prev.skills];
      updated[index] = value;
      return { ...prev, skills: updated };
    });

  const addSkill = () =>
    setResumeData((prev) => ({ ...prev, skills: [...prev.skills, "New Skill"] }));

  const removeSkill = (index) =>
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));

  const resetResume = () => {
    localStorage.removeItem(STORAGE_KEY);
    setResumeData(defaultData);
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        updateField,
        updateArrayItem,
        addArrayItem,
        removeArrayItem,
        updateSkill,
        addSkill,
        removeSkill,
        resetResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext);


/*
import React, { createContext, useContext, useState } from "react";

const ResumeContext = createContext(null);

const initialData = {
  name: "Hafsa Riaz",
  title: "Professional title",
  pitch: "Short and engaging pitch about yourself",
  email: "you@email.com",
  phone: "+92 000 0000000",
  address: "City, Country",
  photo: "",
  experience: [{ role: "Title / Position", company: "Organization", duration: "mm/yyyy - mm/yyyy", description: "Accomplishment / Task" }],
  education: [{ degree: "Study Program", school: "Institution / Organization", duration: "" }],
  skills: ["Skill", "Skill", "Skill"],
  projects: [{ name: "Project Name", stack: "Tech Stack Used", description: "Short description of the project" }],
};

export function ResumeProvider({ children }) {
  const [resumeData, setResumeData] = useState(initialData);

  const updateField = (field, value) =>
    setResumeData((prev) => ({ ...prev, [field]: value }));

  const updateArrayItem = (field, index, key, value) =>
    setResumeData((prev) => {
      const updated = [...prev[field]];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, [field]: updated };
    });

  const addArrayItem = (field, emptyItem) =>
    setResumeData((prev) => ({ ...prev, [field]: [...prev[field], emptyItem] }));

  const removeArrayItem = (field, index) =>
    setResumeData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));

  const updateSkill = (index, value) =>
    setResumeData((prev) => {
      const updated = [...prev.skills];
      updated[index] = value;
      return { ...prev, skills: updated };
    });

  const addSkill = () =>
    setResumeData((prev) => ({ ...prev, skills: [...prev.skills, "New Skill"] }));

  const removeSkill = (index) =>
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        updateField,
        updateArrayItem,
        addArrayItem,
        removeArrayItem,
        updateSkill,
        addSkill,
        removeSkill,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext);


*/