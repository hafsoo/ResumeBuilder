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

/*
const express = require("express");
const router = express.Router();
const Resume = require("../model/resume");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated } = require("../middleware/auth");

// create a new resume (just the name — Use Case 2, step 1)
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
    // make sure this resume belongs to the logged-in user
    if (resume.userId.toString() !== req.user.id.toString()) {
      return next(new ErrorHandler("Not authorized to view this resume", 403));
    }
    res.status(200).json({
      success: true,
      resume,
    });
  })
);

// helper: only used when the client tells us this save represents a
// "Finish" click (req.body.isComplete === true). Regular incremental
// saves (one step at a time) skip this — they're allowed to have empty
// education/skills/etc. because the user simply hasn't gotten there yet.
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
    // use "!== undefined" (not truthy) so an intentionally-emptied array
    // (e.g. user removed their last skill) still gets saved correctly
    if (education !== undefined) resume.education = education;
    if (experience !== undefined) resume.experience = experience;
    if (skills !== undefined) resume.skills = skills;
    if (projects !== undefined) resume.projects = projects;

    // only enforce "must be complete" rules when the client says this
    // save is meant to finalize the resume (Finish button)
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
      throw error; // let catchAsyncErrors handle anything unexpected
    }
    res.status(200).json({
      success: true,
      resume,
    });
  })
);

// delete resume
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