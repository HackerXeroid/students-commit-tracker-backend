const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/adminControllers');
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.get('/all-teacher-status', authMiddleware, adminMiddleware, adminControllers.getAllTeacherStatus);

router.patch('/approve/:teacherId', authMiddleware, adminMiddleware, adminControllers.approveTeacher);

router.patch('/reject/:teacherId', authMiddleware, adminMiddleware, adminControllers.rejectTeacher);

module.exports = router;
