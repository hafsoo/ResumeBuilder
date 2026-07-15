import React from "react";
import { useResume } from "../../context/ResumeContext";
import Editable from "../Editable";

export default function ATSTemplate() {
  const { resumeData, updateField, updateArrayItem, addArrayItem, removeArrayItem, updateSkill, addSkill, removeSkill } = useResume();
  const d = resumeData;

  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif", color: "#1a1a1a", background: "#fff", width: 800, boxSizing: "border-box", margin: "0 auto" }}>
      <Editable value={d.name} onSave={(v) => updateField("name", v)} placeholder="Your Name"
        style={{ fontSize: 26, fontWeight: 700 }} />
      <Editable value={d.title} onSave={(v) => updateField("title", v)} placeholder="Professional Title"
        style={{ fontSize: 15, color: "#555", marginBottom: 4 }} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 13, color: "#555" }}>
        <Editable value={d.email} onSave={(v) => updateField("email", v)} placeholder="email@example.com" />
        <span>|</span>
        <Editable value={d.phone} onSave={(v) => updateField("phone", v)} placeholder="Phone" />
        <span>|</span>
        <Editable value={d.address} onSave={(v) => updateField("address", v)} placeholder="Address" />
      </div>

      <h3 style={{ borderBottom: "1px solid #333", paddingBottom: 4, marginTop: 20 }}>Summary</h3>
      <Editable value={d.pitch} onSave={(v) => updateField("pitch", v)} placeholder="Write a short summary about yourself"
        style={{ fontSize: 14, display: "block", wordBreak: "break-word" }} />

      <h3 style={{ borderBottom: "1px solid #333", paddingBottom: 4 }}>Experience</h3>
      {d.experience.map((exp, i) => (
        <div key={i} style={{ marginBottom: 12, position: "relative" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Editable value={exp.role} onSave={(v) => updateArrayItem("experience", i, "role", v)}
                placeholder="Role" tag="span" style={{ fontWeight: 700, wordBreak: "break-word" }} />
              {" — "}
              <Editable value={exp.company} onSave={(v) => updateArrayItem("experience", i, "company", v)}
                placeholder="Company" tag="span" style={{ wordBreak: "break-word" }} />
            </div>
            <Editable value={exp.duration} onSave={(v) => updateArrayItem("experience", i, "duration", v)}
              placeholder="mm/yyyy - mm/yyyy" tag="span" style={{ fontSize: 12, color: "#777", flexShrink: 0, whiteSpace: "nowrap" }} />
          </div>
          <Editable value={exp.description} onSave={(v) => updateArrayItem("experience", i, "description", v)}
            placeholder="Describe what you did" style={{ fontSize: 13, marginTop: 4, wordBreak: "break-word" }} />
          {d.experience.length > 1 && <RemoveBtn onClick={() => removeArrayItem("experience", i)} />}
        </div>
      ))}
      <AddBtn onClick={() => addArrayItem("experience", { role: "", company: "", duration: "", description: "" })}>
        + Add Experience
      </AddBtn>

      <h3 style={{ borderBottom: "1px solid #333", paddingBottom: 4 }}>Education</h3>
      {d.education.map((edu, i) => (
        <div key={i} style={{ marginBottom: 8, position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Editable value={edu.degree} onSave={(v) => updateArrayItem("education", i, "degree", v)}
              placeholder="Degree" tag="span" style={{ fontWeight: 700, wordBreak: "break-word" }} />
            {" — "}
            <Editable value={edu.school} onSave={(v) => updateArrayItem("education", i, "school", v)}
              placeholder="School" tag="span" style={{ wordBreak: "break-word" }} />
          </div>
          <Editable value={edu.duration} onSave={(v) => updateArrayItem("education", i, "duration", v)}
            placeholder="Duration" tag="span" style={{ fontSize: 12, color: "#777", flexShrink: 0, whiteSpace: "nowrap" }} />
          {d.education.length > 1 && <RemoveBtn onClick={() => removeArrayItem("education", i)} />}
        </div>
      ))}
      <AddBtn onClick={() => addArrayItem("education", { degree: "", school: "", duration: "" })}>
        + Add Education
      </AddBtn>

      <h3 style={{ borderBottom: "1px solid #333", paddingBottom: 4 }}>Projects</h3>
      {d.projects.map((proj, i) => (
        <div key={i} style={{ marginBottom: 12, position: "relative" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Editable value={proj.name} onSave={(v) => updateArrayItem("projects", i, "name", v)}
              placeholder="Project Name" tag="span" style={{ fontWeight: 700, wordBreak: "break-word" }} />
            {" — "}
            <Editable value={proj.stack} onSave={(v) => updateArrayItem("projects", i, "stack", v)}
              placeholder="Tech Stack" tag="span" style={{ wordBreak: "break-word" }} />
          </div>
          <Editable value={proj.description} onSave={(v) => updateArrayItem("projects", i, "description", v)}
            placeholder="Describe the project" style={{ fontSize: 13, marginTop: 4, wordBreak: "break-word" }} />
          {d.projects.length > 1 && <RemoveBtn onClick={() => removeArrayItem("projects", i)} />}
        </div>
      ))}
      <AddBtn onClick={() => addArrayItem("projects", { name: "", stack: "", description: "" })}>
        + Add Project
      </AddBtn>

      <h3 style={{ borderBottom: "1px solid #333", paddingBottom: 4 }}>Skills</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {d.skills.map((skill, i) => (
          <div key={i} style={{ fontSize: 13 }}>
            <Editable value={skill} onSave={(v) => updateSkill(i, v)} placeholder="Skill" tag="span" />
            {i < d.skills.length - 1 ? ", " : ""}
            <span className="no-export" onClick={() => removeSkill(i)} style={{ cursor: "pointer", color: "#c00", fontSize: 11 }}> ✕</span>
          </div>
        ))}
      </div>
      <AddBtn onClick={addSkill}>+ Add Skill</AddBtn>
    </div>
  );
}

function AddBtn({ children, onClick }) {
  return (
    <button className="no-export" onClick={onClick} style={{
      background: "#f0f0f0", color: "#333", border: "none",
      borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", marginTop: 6,
    }}>{children}</button>
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button className="no-export" onClick={onClick} style={{
      position: "absolute", top: 0, right: 0,
      background: "transparent", border: "none", color: "#e57373", cursor: "pointer", fontSize: 12,
    }}>✕</button>
  );
}
