const express = require("express");
const router = express.Router();
const submissionsControllers = require("../controllers/submissionsControllers");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, submissionsControllers.createSubmission);
router.get("/", authMiddleware, submissionsControllers.getSubmissions);
router.get("/:id", authMiddleware, submissionsControllers.getSubmissionById);
// router.put("/:id", authMiddleware, submissionControllers.updateSubmission);
// router.delete("/:id", authMiddleware, submissionControllers.deleteSubmission);

router.post(
  "/:assignmentId",
  authMiddleware,
  submissionsControllers.submitOrUpdateAssignment
);

module.exports = router;
