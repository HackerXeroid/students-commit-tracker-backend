const express = require("express");
const router = express.Router();

const assignmentControllers = require("../controllers/assignmentControllers");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, assignmentControllers.getAssignments);

// Create a new assignment
router.post("/", authMiddleware, assignmentControllers.createAssignment);

// Edit an assignment by ID
router.put("/:id", authMiddleware, assignmentControllers.editAssignment);

// Delete an assignment by ID
router.delete("/:id", authMiddleware, assignmentControllers.deleteAssignment);

module.exports = router;
