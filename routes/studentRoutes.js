const express = require("express");
const router = express.Router();
const studentControllers = require("../controllers/studentControllers");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, studentControllers.getAllStudents);
router.get("/assignments", authMiddleware, studentControllers.getAssignments);


module.exports = router;
