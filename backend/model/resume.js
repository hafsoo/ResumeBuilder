const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeName: {
      type: String,
      required: [true, "Please enter a resume name"],
      trim: true,
    },

    // personalInfo sub-fields keep their own "required" — that's fine,
    // because a personalInfo object is only ever sent once the user has
    // filled the whole Personal Info step. Mongoose only validates the
    // sub-fields that are present in the object being saved.
    personalInfo: {
      fullName: { type: String, default: "", trim: true },
      email: { type: String, default: "", trim: true },
      phone: { type: String, default: "", trim: true },
      linkedin: { type: String, default: "", trim: true },
      address: { type: String, default: "", trim: true },
      github: { type: String, default: "", trim: true },
      portfolio: { type: String, default: "", trim: true },
      summary: { type: String, default: "", trim: true },
    },

    // education is optional AT THE SCHEMA LEVEL — the multi-step form
    // saves progress incrementally (education may legitimately be an
    // empty array while the user is still on the Personal Info step).
    // The "must have at least one entry" rule is a FINISH-time business
    // rule, already enforced client-side in validateAllSteps() and
    // re-checked server-side in the /finish route below.
    // Individual entries, if present, still require degree/institute/startDate.
    education: [
      {
        degree: {
          type: String,
          required: [true, "Degree is required"],
          trim: true,
        },
        institute: {
          type: String,
          required: [true, "Institute is required"],
          trim: true,
        },
        startDate: {
          type: String,
          required: [true, "Start date is required"],
          trim: true,
        },
        endDate: { type: String, default: "", trim: true },
        cgpa: { type: String, default: "", trim: true },
      },
    ],

    // experience is optional overall — any entry added must have
    // company, position, and start date
    experience: [
      {
        company: {
          type: String,
          required: [true, "Company is required"],
          trim: true,
        },
        position: {
          type: String,
          required: [true, "Position is required"],
          trim: true,
        },
        startDate: {
          type: String,
          required: [true, "Start date is required"],
          trim: true,
        },
        endDate: { type: String, default: "", trim: true },
        description: { type: String, default: "", trim: true },
      },
    ],

    // same story as education: no overall "must be non-empty" validator
    // at schema level. That's a finish-time rule, not a save-time rule.
    skills: [{ type: String, trim: true }],

    // projects is optional overall — any entry added must at least have
    // a project name
    projects: [
      {
        name: {
          type: String,
          required: [true, "Project name is required"],
          trim: true,
        },
        technologies: { type: String, default: "", trim: true },
        description: { type: String, default: "", trim: true },
        githubLink: { type: String, default: "", trim: true },
        liveLink: { type: String, default: "", trim: true },
      },
    ],

    // tracks whether the user has completed all required steps and
    // clicked "Finish" — useful for dashboard badges, filtering, etc.
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
