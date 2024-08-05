const Assignment = require("../models/AssignmentModel");
const Submission = require("../models/SubmissionModel");

async function submitOrUpdateAssignment(req, res) {
  try {
    const { assignmentId } = req.paramas;
    const { githubLink } = req.body;
    const userId = req.body.userId;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.statsu(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    if (new Date() > assignment.dueDate) {
      return res.status(400).json({
        success: false,
        message: "The deadline for this assignment has passed",
      });
    }

    let submission = await Submission.findOne({
      student: userId,
      assignment: assignmentId,
    });

    if (submission) {
      if (submission.score === 0) {
        submission.githubLink = githubLink;
        submission.submissionDate = new Date();
        await submission.save();

        return res.status(200).json({
          success: true,
          message: "Submission updated successfully",
        });
      } else {
        throw new Error(
          "This submission has already been graded and cannot be updated"
        );
      }
    } else {
      submission = new Submission({
        student: userId,
        assignment: assignmentId,
        submissionDate: new Date(),
        githubLink,
        score: 0,
      });

      await submission.save();

      return res.status(201).json({
        success: true,
        message: "Submission created successfully",
        data: submission,
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

async function createSubmission(req, res) {
  try {
    const { assignment, githubLink } = req.body;
    const submission = new Submission({
      student: req.body.userId,
      assignment,
      submissionDate: new Date(),
      githubLink,
      score: 0,
    });

    await submission.save();
    res.status(201).json({
      success: true,
      length: submission.length,
      data: submission,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

async function getSubmissions(req, res) {
  try {
    const submissions = await Submission.find({
      student: req.body.userId,
    })
      .populate("assignment")
      .sort({ submissionDate: -1 });

      const formattedSubmissions = submissions.map(submission => ({
        id: submission._id.toString(),
        studentId: submission.student,
        assignmentId: submission.assignment,
        ...submission.toObject()
      }));

    res.status(200).json({
      success: true,
      length: formattedSubmissions.length,
      data: formattedSubmissions,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

async function getSubmissionById(req, res) {
  try {
    const studentId = req.params.id;
    if (!studentId) throw new Error("No parameter specified");

    const submission = await Submission.findById({
      student: studentId,
    });
  } catch (err) {}
}

async function createAndGradeSubmission(req, res) {
  try {
    const { assignmentId, githubLink } = req.body;
    const userId = req.body.userId; // Assuming you have the user's ID from authentication

    // Find the assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Simulate a delay of 2 seconds for "grading"
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate a random score between 0 and the assignment's total score
    const randomScore = Math.floor(Math.random() * (assignment.totalScore + 1));

    // Generate a random description
    const descriptions = [
      "Great work!",
      "Needs improvement.",
      "Well done!",
      "Good attempt.",
      "Excellent effort!",
      "Review needed."
    ];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];

    // Create and save the submission
    const submission = new Submission({
      student: userId,
      assignment: assignmentId,
      submissionDate: new Date(),
      githubLink,
      score: randomScore,
      feedback: randomDescription,
    });

    await submission.save();

    res.status(201).json({
      success: true,
      message: "Submission created and graded successfully",
      data: {
        submissionId: submission._id,
        score: randomScore,
        feedback: randomDescription,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating and grading submission",
      error: err.message,
    });
  }
}

module.exports = {
  submitOrUpdateAssignment,
  createSubmission,
  getSubmissions,
  getSubmissionById,
  createAndGradeSubmission
};
