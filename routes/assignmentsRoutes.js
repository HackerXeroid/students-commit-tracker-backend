const express = require("express");
const router = express.Router();

const assignmentsControllers = require("../controllers/assignmentsControllers");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, assignmentsControllers.getAssignments);

module.exports = router;
