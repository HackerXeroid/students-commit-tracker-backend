const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRouter = require("./routes/authRoutes");
const leaderboardRouter = require("./routes/leaderboardRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/leaderboard/", leaderboardRouter);

module.exports = app;
