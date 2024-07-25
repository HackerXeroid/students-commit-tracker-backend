const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRouter = require("./routes/authRoutes");
const leaderboardRouter = require("./routes/leaderboardRoutes");
const submissionsRouter = require("./routes/submissionsRoutes");
const statsRouter = require("./routes/statsRoutes");
const assignmentsRouter = require("./routes/assignmentsRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/leaderboard/", leaderboardRouter);
app.use("/api/v1/submissions", submissionsRouter);
app.use("/api/v1/stats", statsRouter);
app.use("/api/v1/assignments", assignmentsRouter);

module.exports = app;
