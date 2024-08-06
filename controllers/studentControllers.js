const Assignment = require("../models/AssignmentModel");
const Submission = require("../models/SubmissionModel");
const User = require("../models/UserModel");

// Student perspective assignments
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
      let feedback = "";
      let totalScore = assignment.totalScore;
      let githubLink = undefined;

      if (now > assignment.dueDate && !submission) {
        status = "Missed";
        yourScore = 0;
      }

      if (submission) {
        status = "Completed";
        yourScore = submission.score;
        feedback = submission.feedback;
        githubLink = submission.githubLink;
      }

      return {
        id: assignment._id.toString(),
        submissionId: submission?._id?.toString() || null,
        title: assignment.title,
        description: assignment.description,
        status,
        feedback,
        dueDate: assignment.dueDate.toISOString(),
        yourScore,
        totalScore,
      };
    });

    console.log(formattedAssignments);

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

// Get all students
async function getAllStudents(req, res) {
  try {
    const students = await User.find({ role: "student" }).sort({ name: 1 });

    const formattedStudents = students.map((student) => ({
      id: student._id.toString(), // Convert _id to a string
      ...student.toObject(),
    }));

    res.status(200).json({
      success: true,
      data: formattedStudents,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: err.message,
    });
  }
}

module.exports = { getAssignments, getAllStudents };
