const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRouter = require("./routes/authRoutes");
const leaderboardRouter = require("./routes/leaderboardRoutes");
const submissionRouter = require("./routes/submissionRoutes");
const assignmentRouter = require("./routes/assignmentRoutes");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const teacherRouter = require("./routes/teacherRoutes");
const studentRouter = require("./routes/studentRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/leaderboard/", leaderboardRouter);
app.use("/api/v1/submission", submissionRouter);
app.use("/api/v1/assignment", assignmentRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/teacher", teacherRouter);
module.exports = app;
