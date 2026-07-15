import React, { useRef } from "react";
import { useResume } from "../../context/ResumeContext";
import Editable from "../Editable";

export default function SidebarTemplate() {
  const { resumeData, updateField, updateArrayItem, addArrayItem, removeArrayItem, updateSkill, addSkill, removeSkill } = useResume();
  const d = resumeData;
  const fileInputRef = useRef(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateField("photo", reader.result);
    };
    reader.readAsDataURL(file);

    // reset so selecting the same file again still fires onChange
    e.target.value = "";
  };

  return (
    <div style={{ display: "flex", fontFamily: "Poppins, sans-serif", background: "#fff", width: 800, boxSizing: "border-box", margin: "0 auto", minHeight: 600 }}>
      <div style={{ width: "32%", boxSizing: "border-box", background: "#0F6C5C", color: "#fff", padding: 24, minWidth: 0 }}>
        <div
          onClick={handlePhotoClick}
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            marginBottom: 16,
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            background: d.photo ? `url(${d.photo}) center/cover no-repeat` : "rgba(255,255,255,0.3)",
          }}
        >
          {!d.photo && (
            <span className="no-export" style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 11, textAlign: "center", padding: 4, opacity: 0.9,
            }}>
              Click to add photo
            </span>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="no-export"
          style={{ display: "none" }}
        />

        <Editable value={d.name} onSave={(v) => updateField("name", v)} placeholder="Your Name"
          style={{ fontSize: 20, fontWeight: 700, wordBreak: "break-word" }} />
        <Editable value={d.title} onSave={(v) => updateField("title", v)} placeholder="Professional title"
          style={{ opacity: 0.85, fontSize: 13, marginBottom: 12, wordBreak: "break-word" }} />

        <h4 style={{ marginTop: 24 }}>Contact</h4>
        <Editable value={d.email} onSave={(v) => updateField("email", v)} placeholder="Email" style={{ fontSize: 13, display: "block", wordBreak: "break-word" }} />
        <Editable value={d.phone} onSave={(v) => updateField("phone", v)} placeholder="Phone" style={{ fontSize: 13, display: "block" }} />
        <Editable value={d.address} onSave={(v) => updateField("address", v)} placeholder="Address" style={{ fontSize: 13, display: "block", wordBreak: "break-word" }} />

        <h4>Skills</h4>
        {d.skills.map((skill, i) => (
          <div key={i} style={{ fontSize: 13, marginBottom: 4, display: "flex", justifyContent: "space-between", gap: 6 }}>
            <span style={{ wordBreak: "break-word", minWidth: 0 }}>• <Editable value={skill} onSave={(v) => updateSkill(i, v)} placeholder="Skill" tag="span" /></span>
            <span className="no-export" onClick={() => removeSkill(i)} style={{ cursor: "pointer", opacity: 0.7, flexShrink: 0 }}>✕</span>
          </div>
        ))}
        <button className="no-export" onClick={addSkill} style={{
          background: "rgba(255,255,255,0.2)", color: "#fff", border: "none",
          borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer", marginTop: 4,
        }}>+ Add Skill</button>
      </div>

      <div style={{ flex: 1, minWidth: 0, boxSizing: "border-box", padding: 28 }}>
        <h3 style={{ color: "#0F6C5C" }}>Summary</h3>
        <Editable value={d.pitch} onSave={(v) => updateField("pitch", v)} placeholder="Short summary about yourself"
          style={{ fontSize: 14, display: "block", wordBreak: "break-word" }} />

        <h3 style={{ color: "#0F6C5C" }}>Experience</h3>
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
                placeholder="Duration" tag="span" style={{ fontSize: 12, color: "#888", flexShrink: 0, whiteSpace: "nowrap" }} />
            </div>
            <Editable value={exp.description} onSave={(v) => updateArrayItem("experience", i, "description", v)}
              placeholder="Description" style={{ fontSize: 13, wordBreak: "break-word" }} />
            {d.experience.length > 1 && (
              <span className="no-export" onClick={() => removeArrayItem("experience", i)}
                style={{ position: "absolute", top: 0, right: 0, cursor: "pointer", color: "#e57373", fontSize: 12 }}>✕</span>
            )}
          </div>
        ))}
        <button className="no-export" onClick={() => addArrayItem("experience", { role: "", company: "", duration: "", description: "" })} style={{
          background: "#E6F4F1", color: "#0F6C5C", border: "none",
          borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", marginBottom: 10,
        }}>+ Add Experience</button>

        <h3 style={{ color: "#0F6C5C" }}>Education</h3>
        {d.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 6, position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Editable value={edu.degree} onSave={(v) => updateArrayItem("education", i, "degree", v)}
                placeholder="Degree" tag="span" style={{ fontWeight: 700, wordBreak: "break-word" }} />
              {" — "}
              <Editable value={edu.school} onSave={(v) => updateArrayItem("education", i, "school", v)}
                placeholder="School" tag="span" style={{ wordBreak: "break-word" }} />
            </div>
            <Editable value={edu.duration} onSave={(v) => updateArrayItem("education", i, "duration", v)}
              placeholder="Duration" tag="span" style={{ fontSize: 12, color: "#888", flexShrink: 0, whiteSpace: "nowrap" }} />
            {d.education.length > 1 && (
              <span className="no-export" onClick={() => removeArrayItem("education", i)}
                style={{ position: "absolute", top: 0, right: 0, cursor: "pointer", color: "#e57373", fontSize: 12 }}>✕</span>
            )}
          </div>
        ))}
        <button className="no-export" onClick={() => addArrayItem("education", { degree: "", school: "", duration: "" })} style={{
          background: "#E6F4F1", color: "#0F6C5C", border: "none",
          borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", marginBottom: 10,
        }}>+ Add Education</button>

        <h3 style={{ color: "#0F6C5C" }}>Projects</h3>
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
              placeholder="Description" style={{ fontSize: 13, wordBreak: "break-word" }} />
            {d.projects.length > 1 && (
              <span className="no-export" onClick={() => removeArrayItem("projects", i)}
                style={{ position: "absolute", top: 0, right: 0, cursor: "pointer", color: "#e57373", fontSize: 12 }}>✕</span>
            )}
          </div>
        ))}
        <button className="no-export" onClick={() => addArrayItem("projects", { name: "", stack: "", description: "" })} style={{
          background: "#E6F4F1", color: "#0F6C5C", border: "none",
          borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer",
        }}>+ Add Project</button>
      </div>
    </div>
  );
}


/*
import React from "react";
import { useResume } from "../../context/ResumeContext";
import Editable from "../Editable";

export default function SidebarTemplate() {
  const { resumeData, updateField, updateArrayItem, addArrayItem, removeArrayItem, updateSkill, addSkill, removeSkill } = useResume();
  const d = resumeData;

  return (
    <div style={{ display: "flex", fontFamily: "Poppins, sans-serif", background: "#fff", width: 800, boxSizing: "border-box", margin: "0 auto", minHeight: 600 }}>
      <div style={{ width: "32%", boxSizing: "border-box", background: "#0F6C5C", color: "#fff", padding: 24, minWidth: 0 }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.3)", marginBottom: 16 }} />

        <Editable value={d.name} onSave={(v) => updateField("name", v)} placeholder="Your Name"
          style={{ fontSize: 20, fontWeight: 700, wordBreak: "break-word" }} />
        <Editable value={d.title} onSave={(v) => updateField("title", v)} placeholder="Professional title"
          style={{ opacity: 0.85, fontSize: 13, marginBottom: 12, wordBreak: "break-word" }} />

        <h4 style={{ marginTop: 24 }}>Contact</h4>
        <Editable value={d.email} onSave={(v) => updateField("email", v)} placeholder="Email" style={{ fontSize: 13, display: "block", wordBreak: "break-word" }} />
        <Editable value={d.phone} onSave={(v) => updateField("phone", v)} placeholder="Phone" style={{ fontSize: 13, display: "block" }} />
        <Editable value={d.address} onSave={(v) => updateField("address", v)} placeholder="Address" style={{ fontSize: 13, display: "block", wordBreak: "break-word" }} />

        <h4>Skills</h4>
        {d.skills.map((skill, i) => (
          <div key={i} style={{ fontSize: 13, marginBottom: 4, display: "flex", justifyContent: "space-between", gap: 6 }}>
            <span style={{ wordBreak: "break-word", minWidth: 0 }}>• <Editable value={skill} onSave={(v) => updateSkill(i, v)} placeholder="Skill" tag="span" /></span>
            <span className="no-export" onClick={() => removeSkill(i)} style={{ cursor: "pointer", opacity: 0.7, flexShrink: 0 }}>✕</span>
          </div>
        ))}
        <button className="no-export" onClick={addSkill} style={{
          background: "rgba(255,255,255,0.2)", color: "#fff", border: "none",
          borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer", marginTop: 4,
        }}>+ Add Skill</button>
      </div>

      <div style={{ flex: 1, minWidth: 0, boxSizing: "border-box", padding: 28 }}>
        <h3 style={{ color: "#0F6C5C" }}>Summary</h3>
        <Editable value={d.pitch} onSave={(v) => updateField("pitch", v)} placeholder="Short summary about yourself"
          style={{ fontSize: 14, display: "block", wordBreak: "break-word" }} />

        <h3 style={{ color: "#0F6C5C" }}>Experience</h3>
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
                placeholder="Duration" tag="span" style={{ fontSize: 12, color: "#888", flexShrink: 0, whiteSpace: "nowrap" }} />
            </div>
            <Editable value={exp.description} onSave={(v) => updateArrayItem("experience", i, "description", v)}
              placeholder="Description" style={{ fontSize: 13, wordBreak: "break-word" }} />
            {d.experience.length > 1 && (
              <span className="no-export" onClick={() => removeArrayItem("experience", i)}
                style={{ position: "absolute", top: 0, right: 0, cursor: "pointer", color: "#e57373", fontSize: 12 }}>✕</span>
            )}
          </div>
        ))}
        <button className="no-export" onClick={() => addArrayItem("experience", { role: "", company: "", duration: "", description: "" })} style={{
          background: "#E6F4F1", color: "#0F6C5C", border: "none",
          borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", marginBottom: 10,
        }}>+ Add Experience</button>

        <h3 style={{ color: "#0F6C5C" }}>Education</h3>
        {d.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 6, position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Editable value={edu.degree} onSave={(v) => updateArrayItem("education", i, "degree", v)}
                placeholder="Degree" tag="span" style={{ fontWeight: 700, wordBreak: "break-word" }} />
              {" — "}
              <Editable value={edu.school} onSave={(v) => updateArrayItem("education", i, "school", v)}
                placeholder="School" tag="span" style={{ wordBreak: "break-word" }} />
            </div>
            <Editable value={edu.duration} onSave={(v) => updateArrayItem("education", i, "duration", v)}
              placeholder="Duration" tag="span" style={{ fontSize: 12, color: "#888", flexShrink: 0, whiteSpace: "nowrap" }} />
          </div>
        ))}
        <button className="no-export" onClick={() => addArrayItem("education", { degree: "", school: "", duration: "" })} style={{
          background: "#E6F4F1", color: "#0F6C5C", border: "none",
          borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer",
        }}>+ Add Education</button>
      </div>
    </div>
  );
}
  */