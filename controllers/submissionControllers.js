const Submission = require("../models/SubmissionModel");

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

    res.status(200).json({
      success: true,
      length: submissions.length,
      data: submissions,
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
