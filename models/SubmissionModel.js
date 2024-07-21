const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  submissionDate: {
    type: Date,
    required: true,
  },
  githubLink: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  feedback: {
    type: String,
  },
});

const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;
