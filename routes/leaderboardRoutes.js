const express = require("express");
const { Router } = express;
const leaderboardControllers = require("../controllers/leaderboardControllers");

const router = Router();

// GET /api/v1/leaderboard?date=YYYY-MM-DD
router.get("/", async (req, res) => {
  await leaderboardControllers.getDateSpecificLeaderboard(req, res);
});

// GET /api/v1/leaderboard/all-time
router.get("/all-time", async (req, res) => {
  await leaderboardControllers.getAllTimeLeaderboard(req, res);
});

module.exports = router;
