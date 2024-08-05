const express = require("express");
const router = express.Router();
const submissionControllers = require("../controllers/submissionControllers");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/grade",
  authMiddleware,
  submissionControllers.createAndGradeSubmission
);
router.post("/", authMiddleware, submissionControllers.createSubmission);
router.get("/", authMiddleware, submissionControllers.getSubmissions);
router.get("/:id", authMiddleware, submissionControllers.getSubmissionById);
// router.put("/:id", authMiddleware, submissionControllers.updateSubmission);
// router.delete("/:id", authMiddleware, submissionControllers.deleteSubmission);

router.post(
  "/:assignmentId",
  authMiddleware,
  submissionControllers.submitOrUpdateAssignment
);

module.exports = router;
