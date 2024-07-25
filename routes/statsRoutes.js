const express = require("express");
const router = express.Router();
const statsControllers = require("../controllers/statsControllers");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, statsControllers.getStats);

module.exports = router;
