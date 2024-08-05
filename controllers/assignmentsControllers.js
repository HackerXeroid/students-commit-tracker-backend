const Assignment = require("../models/AssignmentModel");
const Submission = require("../models/SubmissionModel");

async function getAssignments(req, res) {
  try {
    const userId = req.body.userId;
    const assignments = await Assignment.find();
    const submissions = await Submission.find({
      student: userId,
    });

    const formattedAssignments = assignments.map((assignment) => {
      const submission = submissions.find(
        (sub) => sub.assignment.toString() === assignment._id.toString()
      );

      const now = new Date();
      let status = "Pending";
      let yourScore = null;
      let totalScore = assignment.totalScore;
      let githubLink = undefined;

      if (now > assignment.dueDate && !submission) {
        status = "Missed";
        yourScore = 0;
      }

      if (submission) {
        status = "Completed";
        yourScore = submission.score;
        githubLink = submission.githubLink;
      }

      return {
        id: assignment._id.toString(),
        title: assignment.title,
        description: assignment.description,
        status,
        dueDate: assignment.dueDate.toISOString(),
        yourScore,
        totalScore,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedAssignments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching assignments",
      error: err.message,
    });
  }
}

module.exports = { getAssignments };
