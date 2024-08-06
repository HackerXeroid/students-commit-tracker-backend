const express = require("express");
const router = express.Router();
const submissionControllers = require("../controllers/submissionControllers");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/create-and-grade",
  authMiddleware,
  submissionControllers.createAndGradeSubmission
);
router.post("/grade", authMiddleware, submissionControllers.gradeSubmission);
router.post("/", authMiddleware, submissionControllers.createSubmission);
router.get("/", authMiddleware, submissionControllers.getStudentSubmissions);
router.get("/all", authMiddleware, submissionControllers.getAllSubmissions);
router.get("/:id", authMiddleware, submissionControllers.getSubmissionById);

router.post(
  "/:assignmentId",
  authMiddleware,
  submissionControllers.submitOrUpdateAssignment
);

module.exports = router;
