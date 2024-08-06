const mongoose = require("mongoose");
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

async function getAllSubmissions(req, res) {
  try {
    const submissions = await Submission.find().sort({ submissionDate: -1 });

    const formattedSubmissions = submissions.map((submission) => ({
      id: submission._id.toString(),
      assignmentId: submission.assignment,
      studentId: submission.student,
      ...submission.toObject(),
    }));

    console.log(formattedSubmissions);

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

async function getStudentSubmissions(req, res) {
  try {
    const submissions = await Submission.find({
      student: req.params.userId,
    })
      .populate("assignment")
      .sort({ submissionDate: -1 });

    const formattedSubmissions = submissions.map((submission) => ({
      id: submission._id.toString(),
      studentId: submission.student,
      assignmentId: submission.assignment,
      ...submission.toObject(),
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

    const submission = await Submission.findOne({
      student: studentId,
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error retrieving submission",
      error: err.message,
    });
  }
}

async function createAndGradeSubmission(req, res) {
  try {
    const { assignmentId, githubLink } = req.body;
    const studentId = req.body.studentId;

    // Find the assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    if (assignment.dueDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "The deadline for this assignment has passed",
      });
    }

    const { grader } = await import("../services/gradingService.mjs");
    const extraDetails = await grader(
      githubLink,
      assignment.description,
      assignment.totalScore
    );

    if (!extraDetails) throw new Error("Unable to grade your submission");

    // Create and save the submission
    const submission = new Submission({
      student: studentId,
      assignment: assignmentId,
      submissionDate: new Date(),
      githubLink: githubLink,
      score: extraDetails.score,
      feedback: extraDetails.feedback,
    });

    await submission.save();
    res.status(201).json({
      success: true,
      message: "Submission created and graded successfully",
      data: {
        submissionId: submission._id,
        score: extraDetails.score,
        feedback: extraDetails.feedback,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error creating and grading submission",
      error: err.message,
    });
  }
}

async function gradeSubmission(req, res) {
  try {
    console.log(req.body, "req.body");
    const { submissionId, githubLink } = req.body;

    // Find the existing submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Find the associated assignment
    const assignment = await Assignment.findById(submission.assignment);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    if (assignment.dueDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "The deadline for this assignment has passed",
      });
    }

    const { grader } = await import("../services/gradingService.mjs");
    const extraDetails = await grader(
      githubLink,
      assignment.description,
      assignment.totalScore
    );

    if (!extraDetails) throw new Error("Unable to grade your submission");

    submission.score = extraDetails.score;
    submission.feedback = extraDetails.feedback;
    submission.githubLink = githubLink;

    await submission.save();

    res.status(200).json({
      success: true,
      message: "Submission graded successfully",
      data: {
        submissionId: submission._id,
        score: extraDetails.score,
        feedback: extraDetails.feedback,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error grading submission",
      error: err.message,
    });
  }
}

module.exports = {
  submitOrUpdateAssignment,
  createSubmission,
  getAllSubmissions,
  getStudentSubmissions,
  getSubmissionById,
  createAndGradeSubmission,
  gradeSubmission,
};
