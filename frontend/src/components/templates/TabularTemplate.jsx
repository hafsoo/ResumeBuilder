import React from "react";
import { useResume } from "../../context/ResumeContext";
import Editable from "../Editable";

export default function TabularTemplate() {
  const { resumeData, updateField, updateArrayItem, addArrayItem, removeArrayItem, updateSkill, addSkill, removeSkill } = useResume();
  const d = resumeData;

  return (
    <div style={{ padding: 40, fontFamily: "Georgia, serif", background: "#fff", width: 800, boxSizing: "border-box", margin: "0 auto" }}>
      <Editable value={d.name} onSave={(v) => updateField("name", v)} placeholder="Your Name"
        style={{ fontSize: 26, fontWeight: 700 }} />
      <Editable value={d.title} onSave={(v) => updateField("title", v)} placeholder="Professional Title"
        style={{ color: "#0F6C5C", fontWeight: 600, marginBottom: 10 }} />

      <div style={{ display: "flex", gap: 24, marginTop: 10 }}>
        <div style={{ flex: 2, minWidth: 0 }}>
          <h4 style={{ background: "#0F6C5C", color: "#fff", padding: "4px 8px" }}>Work Experience</h4>
          {d.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12, position: "relative" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Editable value={exp.role} onSave={(v) => updateArrayItem("experience", i, "role", v)}
                    placeholder="Role" tag="span" style={{ fontWeight: 700, wordBreak: "break-word" }} />
                  {", "}
                  <Editable value={exp.company} onSave={(v) => updateArrayItem("experience", i, "company", v)}
                    placeholder="Company" tag="span" style={{ wordBreak: "break-word" }} />
                </div>
                <Editable value={exp.duration} onSave={(v) => updateArrayItem("experience", i, "duration", v)}
                  placeholder="Duration" tag="span" style={{ fontSize: 12, color: "#666", flexShrink: 0, whiteSpace: "nowrap" }} />
              </div>
              <Editable value={exp.description} onSave={(v) => updateArrayItem("experience", i, "description", v)}
                placeholder="Description" style={{ fontSize: 13, wordBreak: "break-word" }} />
              {d.experience.length > 1 && <RemoveBtn onClick={() => removeArrayItem("experience", i)} />}
            </div>
          ))}
          <AddBtn onClick={() => addArrayItem("experience", { role: "", company: "", duration: "", description: "" })}>
            + Add Experience
          </AddBtn>

          <h4 style={{ background: "#0F6C5C", color: "#fff", padding: "4px 8px" }}>Education</h4>
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
                placeholder="Duration" tag="span" style={{ fontSize: 12, color: "#666", flexShrink: 0, whiteSpace: "nowrap" }} />
              {d.education.length > 1 && <RemoveBtn onClick={() => removeArrayItem("education", i)} />}
            </div>
          ))}
          <AddBtn onClick={() => addArrayItem("education", { degree: "", school: "", duration: "" })}>
            + Add Education
          </AddBtn>

          <h4 style={{ background: "#0F6C5C", color: "#fff", padding: "4px 8px" }}>Projects</h4>
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
              {d.projects.length > 1 && <RemoveBtn onClick={() => removeArrayItem("projects", i)} />}
            </div>
          ))}
          <AddBtn onClick={() => addArrayItem("projects", { name: "", stack: "", description: "" })}>
            + Add Project
          </AddBtn>
        </div>

        <div style={{ flex: 1, minWidth: 0, background: "#F3F6F5", padding: 12, borderRadius: 6 }}>
          <h4 style={{ color: "#0F6C5C" }}>Skills</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {d.skills.map((skill, i) => (
              <div key={i} style={{ background: "#D6EAE6", padding: "4px 8px", borderRadius: 4, fontSize: 12, position: "relative" }}>
                <Editable value={skill} onSave={(v) => updateSkill(i, v)} placeholder="Skill" tag="span" />
                <span className="no-export" onClick={() => removeSkill(i)} style={{ marginLeft: 4, cursor: "pointer", color: "#999" }}>✕</span>
              </div>
            ))}
          </div>
          <AddBtn onClick={addSkill}>+ Add Skill</AddBtn>

          <h4 style={{ color: "#0F6C5C" }}>Contact</h4>
          <Editable value={d.email} onSave={(v) => updateField("email", v)} placeholder="Email" style={{ fontSize: 12, display: "block", wordBreak: "break-word" }} />
          <Editable value={d.phone} onSave={(v) => updateField("phone", v)} placeholder="Phone" style={{ fontSize: 12, display: "block" }} />
          <Editable value={d.address} onSave={(v) => updateField("address", v)} placeholder="Address" style={{ fontSize: 12, display: "block", wordBreak: "break-word" }} />
        </div>
      </div>
    </div>
  );
}

function AddBtn({ children, onClick }) {
  return (
    <button className="no-export" onClick={onClick} style={{
      background: "#E6F4F1", color: "#0F6C5C", border: "none",
      borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", marginTop: 4, marginBottom: 8,
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


/*
import React from "react";
import { useResume } from "../../context/ResumeContext";
import Editable from "../Editable";

export default function TabularTemplate() {
  const { resumeData, updateField, updateArrayItem, addArrayItem, removeArrayItem, updateSkill, addSkill, removeSkill } = useResume();
  const d = resumeData;

  return (
    <div style={{ padding: 40, fontFamily: "Georgia, serif", background: "#fff", width: 800, boxSizing: "border-box", margin: "0 auto" }}>
      <Editable value={d.name} onSave={(v) => updateField("name", v)} placeholder="Your Name"
        style={{ fontSize: 26, fontWeight: 700 }} />
      <Editable value={d.title} onSave={(v) => updateField("title", v)} placeholder="Professional Title"
        style={{ color: "#0F6C5C", fontWeight: 600, marginBottom: 10 }} />

      <div style={{ display: "flex", gap: 24, marginTop: 10 }}>
        <div style={{ flex: 2, minWidth: 0 }}>
          <h4 style={{ background: "#0F6C5C", color: "#fff", padding: "4px 8px" }}>Work Experience</h4>
          {d.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12, position: "relative" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Editable value={exp.role} onSave={(v) => updateArrayItem("experience", i, "role", v)}
                    placeholder="Role" tag="span" style={{ fontWeight: 700, wordBreak: "break-word" }} />
                  {", "}
                  <Editable value={exp.company} onSave={(v) => updateArrayItem("experience", i, "company", v)}
                    placeholder="Company" tag="span" style={{ wordBreak: "break-word" }} />
                </div>
                <Editable value={exp.duration} onSave={(v) => updateArrayItem("experience", i, "duration", v)}
                  placeholder="Duration" tag="span" style={{ fontSize: 12, color: "#666", flexShrink: 0, whiteSpace: "nowrap" }} />
              </div>
              <Editable value={exp.description} onSave={(v) => updateArrayItem("experience", i, "description", v)}
                placeholder="Description" style={{ fontSize: 13, wordBreak: "break-word" }} />
              {d.experience.length > 1 && <RemoveBtn onClick={() => removeArrayItem("experience", i)} />}
            </div>
          ))}
          <AddBtn onClick={() => addArrayItem("experience", { role: "", company: "", duration: "", description: "" })}>
            + Add Experience
          </AddBtn>

          <h4 style={{ background: "#0F6C5C", color: "#fff", padding: "4px 8px" }}>Education</h4>
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
                placeholder="Duration" tag="span" style={{ fontSize: 12, color: "#666", flexShrink: 0, whiteSpace: "nowrap" }} />
              {d.education.length > 1 && <RemoveBtn onClick={() => removeArrayItem("education", i)} />}
            </div>
          ))}
          <AddBtn onClick={() => addArrayItem("education", { degree: "", school: "", duration: "" })}>
            + Add Education
          </AddBtn>
        </div>

        <div style={{ flex: 1, minWidth: 0, background: "#F3F6F5", padding: 12, borderRadius: 6 }}>
          <h4 style={{ color: "#0F6C5C" }}>Skills</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {d.skills.map((skill, i) => (
              <div key={i} style={{ background: "#D6EAE6", padding: "4px 8px", borderRadius: 4, fontSize: 12, position: "relative" }}>
                <Editable value={skill} onSave={(v) => updateSkill(i, v)} placeholder="Skill" tag="span" />
                <span className="no-export" onClick={() => removeSkill(i)} style={{ marginLeft: 4, cursor: "pointer", color: "#999" }}>✕</span>
              </div>
            ))}
          </div>
          <AddBtn onClick={addSkill}>+ Add Skill</AddBtn>

          <h4 style={{ color: "#0F6C5C" }}>Contact</h4>
          <Editable value={d.email} onSave={(v) => updateField("email", v)} placeholder="Email" style={{ fontSize: 12, display: "block", wordBreak: "break-word" }} />
          <Editable value={d.phone} onSave={(v) => updateField("phone", v)} placeholder="Phone" style={{ fontSize: 12, display: "block" }} />
          <Editable value={d.address} onSave={(v) => updateField("address", v)} placeholder="Address" style={{ fontSize: 12, display: "block", wordBreak: "break-word" }} />
        </div>
      </div>
    </div>
  );
}

function AddBtn({ children, onClick }) {
  return (
    <button className="no-export" onClick={onClick} style={{
      background: "#E6F4F1", color: "#0F6C5C", border: "none",
      borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", marginTop: 4, marginBottom: 8,
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

*/