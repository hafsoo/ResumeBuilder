const express = require("express");
const router = express.Router();
const Resume = require("../model/resume");
const cloudinary = require("cloudinary"); // NEW
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated } = require("../middleware/auth");
const puppeteer = require("puppeteer");

const sendMail = require("../utils/sendMail");

// create a new resume
router.post(
  "/create",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { resumeName } = req.body;

    if (!resumeName || !resumeName.trim()) {
      return next(new ErrorHandler("Please enter a resume name", 400));
    }

    const resume = new Resume({
      userId: req.user.id,
      resumeName: resumeName.trim(),
      personalInfo: {},
      education: [],
      skills: [],
    });

    await resume.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      resume,
    });
  }),
);

// get all resumes for the logged-in user
router.get(
  "/",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const resumes = await Resume.find({ userId: req.user.id }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      resumes,
    });
  }),
);
// get one resume by id
router.get(
  "/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return next(new ErrorHandler("Resume not found", 404));
    }
    const isOwner = resume.userId.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return next(new ErrorHandler("Not authorized to view this resume", 403));
    }
    //if (resume.userId.toString() !== req.user.id.toString()) {
    // return next(new ErrorHandler("Not authorized to view this resume", 403));
    //}
    res.status(200).json({
      success: true,
      resume,
    });
  }),
);

//  upload / replace this resume's photo
router.put(
  "/:id/update-avatar",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return next(new ErrorHandler("Resume not found", 404));
    }
    if (resume.userId.toString() !== req.user.id.toString()) {
      return next(new ErrorHandler("Not authorized to edit this resume", 403));
    }

    if (!req.body.avatar) {
      return next(new ErrorHandler("No image provided", 400));
    }

    // remove the old resume photo from Cloudinary if one exists
    if (resume.avatar?.public_id) {
      await cloudinary.v2.uploader.destroy(resume.avatar.public_id);
    }

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "resume-avatars",
      width: 300,
    });

    resume.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    await resume.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      resume,
    });
  }),
);

function validateCompleteResume(resume) {
  const errors = [];
  const p = resume.personalInfo || {};

  if (!p.fullName?.trim()) errors.push("Full name is required");
  if (!p.email?.trim()) errors.push("Email is required");
  if (!p.phone?.trim()) errors.push("Phone number is required");
  if (!p.linkedin?.trim()) errors.push("LinkedIn profile is required");

  if (!Array.isArray(resume.education) || resume.education.length === 0) {
    errors.push("Please add at least one education entry");
  }

  if (!Array.isArray(resume.skills) || resume.skills.length === 0) {
    errors.push("Please add at least one skill");
  }

  return errors;
}

router.put(
  "/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    let resume = await Resume.findById(req.params.id);
    if (!resume) {
      return next(new ErrorHandler("Resume not found", 404));
    }
    if (resume.userId.toString() !== req.user.id.toString()) {
      return next(new ErrorHandler("Not authorized to edit this resume", 403));
    }
    const {
      resumeName,
      personalInfo,
      education,
      experience,
      skills,
      projects,
      accentColor, // <-- YEH LINE: accentColor ko request body se nikalo
      isComplete,
    } = req.body;

    if (resumeName) resume.resumeName = resumeName;

    if (accentColor) resume.accentColor = accentColor;

    if (personalInfo) resume.personalInfo = personalInfo;
    if (education !== undefined) resume.education = education;
    if (experience !== undefined) resume.experience = experience;
    if (skills !== undefined) resume.skills = skills;
    if (projects !== undefined) resume.projects = projects;

    if (isComplete) {
      const errors = validateCompleteResume(resume);
      if (errors.length > 0) {
        return next(new ErrorHandler(errors.join(", "), 400));
      }
      resume.isComplete = true;
    }

    try {
      await resume.save();
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((e) => e.message);
        return next(new ErrorHandler(messages.join(", "), 400));
      }
      throw error;
    }
    res.status(200).json({
      success: true,
      resume,
    });
  }),
);

router.delete(
  "/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return next(new ErrorHandler("Resume not found", 404));
    }
    if (resume.userId.toString() !== req.user.id.toString()) {
      return next(
        new ErrorHandler("Not authorized to delete this resume", 403),
      );
    }
    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  }),
);

// ============================================================
// resume ko email ke through kisi ko bhejna
// ============================================================
router.post(
  "/:id/send-email",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const resume = await Resume.findById(req.params.id).populate(
      "userId",
      "name email",
    );

    if (!resume) {
      return next(new ErrorHandler("Resume not found", 404));
    }

    if (resume.userId._id.toString() !== req.user.id.toString()) {
      return next(new ErrorHandler("Not authorized to send this resume", 403));
    }

    const { recipientEmail, message } = req.body;

    // recipient email ka basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!recipientEmail || !emailRegex.test(recipientEmail)) {
      return next(
        new ErrorHandler("Please provide a valid recipient email", 400),
      );
    }

    const {
      personalInfo = {},
      education = [],
      experience = [],
      skills = [],
      projects = [],
    } = resume;
    const accentColor = resume.accentColor || "#0891b2";
    const senderName = resume.userId?.name || "A candidate";

    // ---------- helper: resume data ko HTML mein convert karta hai ----------
    // (email clients purane/limited CSS support karte hain, isliye yahan
    // Tailwind classes nahi, sirf inline styles use ho rahe hain)
    const buildResumeHtml = () => {
      const sectionTitle = (text) =>
        `<h2 style="font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#475569;margin:24px 0 8px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">${text}</h2>`;

      let html = `
        <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;background:#ffffff;">
          <div style="background:${accentColor};padding:28px 24px;border-radius:8px 8px 0 0;">
            <h1 style="color:#ffffff;margin:0;font-size:24px;">${personalInfo.fullName || "Resume"}</h1>
            <p style="color:#ffffff;opacity:0.9;margin:6px 0 0;font-size:13px;">
              ${[personalInfo.email, personalInfo.phone].filter(Boolean).join(" &nbsp;·&nbsp; ")}
            </p>
          </div>
          <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
      `;

      if (personalInfo.summary) {
        html += sectionTitle("Summary");
        html += `<p style="color:#334155;font-size:14px;line-height:1.6;">${personalInfo.summary}</p>`;
      }

      if (experience.length > 0) {
        html += sectionTitle("Experience");
        experience.forEach((exp) => {
          html += `
            <div style="margin-bottom:12px;">
              <p style="margin:0;font-weight:bold;font-size:14px;color:#0f172a;">
                ${exp.position} ${exp.company ? `— ${exp.company}` : ""}
              </p>
              <p style="margin:2px 0;color:#64748b;font-size:12px;">
                ${exp.startDate} ${exp.isPresent ? "— Present" : exp.endDate ? `— ${exp.endDate}` : ""}
              </p>
              ${exp.description ? `<p style="margin:4px 0;color:#334155;font-size:13px;">${exp.description}</p>` : ""}
            </div>
          `;
        });
      }

      if (education.length > 0) {
        html += sectionTitle("Education");
        education.forEach((edu) => {
          html += `
            <div style="margin-bottom:10px;">
              <p style="margin:0;font-weight:bold;font-size:14px;color:#0f172a;">
                ${edu.degree} ${edu.institute ? `— ${edu.institute}` : ""}
              </p>
              <p style="margin:2px 0;color:#64748b;font-size:12px;">
                ${edu.startDate} ${edu.isPresent ? "— Present" : edu.endDate ? `— ${edu.endDate}` : ""}
              </p>
            </div>
          `;
        });
      }

      if (projects.length > 0) {
        html += sectionTitle("Projects");
        projects.forEach((proj) => {
          html += `
            <div style="margin-bottom:10px;">
              <p style="margin:0;font-weight:bold;font-size:14px;color:#0f172a;">${proj.name}</p>
              ${proj.description ? `<p style="margin:4px 0;color:#334155;font-size:13px;">${proj.description}</p>` : ""}
            </div>
          `;
        });
      }

      if (skills.length > 0) {
        html += sectionTitle("Skills");
        html += `<p style="color:#334155;font-size:13px;">${skills.join(" &nbsp;|&nbsp; ")}</p>`;
      }

      html += `</div></div>`;
      return html;
    };

    // sender ke liye ek chhota personal message + resume HTML
    const emailBody = `
      <div style="font-family:Arial,sans-serif;">
        ${
          message
            ? `<p style="color:#334155;font-size:14px;margin-bottom:20px;">${message}</p>`
            : ""
        }
        ${buildResumeHtml()}
        <p style="color:#94a3b8;font-size:11px;margin-top:20px;text-align:center;">
          Sent via ResumeBuilder on behalf of ${senderName}
        </p>
      </div>
    `;

    // PDF generate karo resume HTML se
    ///const browser = await puppeteer.launch({
    // headless: "new",
    //args: ["--no-sandbox", "--disable-setuid-sandbox"],
    //});

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-software-rasterizer",
        "--window-position=-32000,-32000",
        "--window-size=1,1",
      ],
    });

    const page = await browser.newPage();
    await page.setContent(buildResumeHtml(), { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    try {
      const safeName = (personalInfo.fullName || "resume").replace(/\s+/g, "_");

      await sendMail({
        email: recipientEmail,
        subject: `Resume — ${personalInfo.fullName || senderName}`,
        html: emailBody,
        attachments: [
          {
            filename: `${safeName}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: `Resume sent to ${recipientEmail}`,
      });
    } catch (error) {
      console.error("SEND MAIL ERROR:", error); // TEMP: see the real reason
      return next(
        new ErrorHandler("Could not send email, please try again", 500),
      );
    }
  }),
);

module.exports = router;

/*
const express = require("express");
const router = express.Router();
const Resume = require("../model/resume");
const cloudinary = require("cloudinary"); // NEW
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated } = require("../middleware/auth");
// create a new resume
router.post(
  "/create",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { resumeName } = req.body;

    if (!resumeName || !resumeName.trim()) {
      return next(new ErrorHandler("Please enter a resume name", 400));
    }

    const resume = new Resume({
      userId: req.user.id,
      resumeName: resumeName.trim(),
      personalInfo: {},
      education: [],
      skills: [],
    });

    await resume.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      resume,
    });
  })
);

// get all resumes for the logged-in user
router.get(
  "/",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const resumes = await Resume.find({ userId: req.user.id }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      resumes,
    });
  })
);
// get one resume by id
router.get(
  "/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return next(new ErrorHandler("Resume not found", 404));
    }
    if (resume.userId.toString() !== req.user.id.toString()) {
      return next(new ErrorHandler("Not authorized to view this resume", 403));
    }
    res.status(200).json({
      success: true,
      resume,
    });
  })
);

//  upload / replace this resume's photo
router.put(
  "/:id/update-avatar",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return next(new ErrorHandler("Resume not found", 404));
    }
    if (resume.userId.toString() !== req.user.id.toString()) {
      return next(new ErrorHandler("Not authorized to edit this resume", 403));
    }

    if (!req.body.avatar) {
      return next(new ErrorHandler("No image provided", 400));
    }

    // remove the old resume photo from Cloudinary if one exists
    if (resume.avatar?.public_id) {
      await cloudinary.v2.uploader.destroy(resume.avatar.public_id);
    }

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "resume-avatars",
      width: 300,
    });

    resume.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    await resume.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      resume,
    });
  })
);

function validateCompleteResume(resume) {
  const errors = [];
  const p = resume.personalInfo || {};

  if (!p.fullName?.trim()) errors.push("Full name is required");
  if (!p.email?.trim()) errors.push("Email is required");
  if (!p.phone?.trim()) errors.push("Phone number is required");
  if (!p.linkedin?.trim()) errors.push("LinkedIn profile is required");

  if (!Array.isArray(resume.education) || resume.education.length === 0) {
    errors.push("Please add at least one education entry");
  }

  if (!Array.isArray(resume.skills) || resume.skills.length === 0) {
    errors.push("Please add at least one skill");
  }

  return errors;
}

router.put(
  "/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    let resume = await Resume.findById(req.params.id);
    if (!resume) {
      return next(new ErrorHandler("Resume not found", 404));
    }
    if (resume.userId.toString() !== req.user.id.toString()) {
      return next(new ErrorHandler("Not authorized to edit this resume", 403));
    }
    const {
      resumeName,
      personalInfo,
      education,
      experience,
      skills,
      projects,
      isComplete,
    } = req.body;

    if (resumeName) resume.resumeName = resumeName;
    if (personalInfo) resume.personalInfo = personalInfo;
    if (education !== undefined) resume.education = education;
    if (experience !== undefined) resume.experience = experience;
    if (skills !== undefined) resume.skills = skills;
    if (projects !== undefined) resume.projects = projects;

    if (isComplete) {
      const errors = validateCompleteResume(resume);
      if (errors.length > 0) {
        return next(new ErrorHandler(errors.join(", "), 400));
      }
      resume.isComplete = true;
    }

    try {
      await resume.save();
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((e) => e.message);
        return next(new ErrorHandler(messages.join(", "), 400));
      }
      throw error;
    }
    res.status(200).json({
      success: true,
      resume,
    });
  })
);

router.delete(
  "/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return next(new ErrorHandler("Resume not found", 404));
    }
    if (resume.userId.toString() !== req.user.id.toString()) {
      return next(new ErrorHandler("Not authorized to delete this resume", 403));
    }
    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  })
);

module.exports = router;

*/
