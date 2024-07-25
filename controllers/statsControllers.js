const Assignment = require("../models/AssignmentModel");
const Submission = require("../models/SubmissionModel");
const User = require("../models/UserModel");

async function getStats(req, res) {
  try {
    const userId = req.body.userId;

    const totalAssignments = await Assignment.countDocuments();

    const completedAssignments = await Submission.countDocuments({
      student: userId,
      score: { $ne: null },
    });

    const submissions = await Submission.find({
      student: userId,
      score: { $ne: null },
    });

    const totalScore = submissions.reduce(
      (sum, submission) => sum + submission.score,
      0
    );

    const averageScore =
      submissions.length > 0 ? totalScore / submissions.length : 0;

    res.status(200).json({
      success: true,
      data: {
        totalAssignments,
        completedAssignments,
        averageScore,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching stats",
      error: err.message,
    });
  }
}

module.exports = { getStats };
