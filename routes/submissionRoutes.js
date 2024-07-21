const express = require("express");
const router = express.Router();
const submissionControllers = require("../controllers/submissionController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, submissionControllers.createSubmission);
router.get("/", authMiddleware, submissionControllers.getSubmissions);
router.get("/:id", authMiddleware, submissionControllers.getSubmissionById);
router.put("/:id", authMiddleware, submissionControllers.updateSubmission);
router.delete("/:id", authMiddleware, submissionControllers.deleteSubmission);
