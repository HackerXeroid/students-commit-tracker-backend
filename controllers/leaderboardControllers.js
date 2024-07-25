const Submission = require("../models/SubmissionModel");

async function getDateSpecificLeaderboard(req, res) {
  try {
    const date = req.query.date;
    if (!date) throw new Error("Date parameter is required");

    const submissions = await Submission.find({
      submissionDate: {
        $gte: new Date(date + "T00:00:00Z"),
        $lte: new Date(date + "T23:59:59Z"),
      },
    })
      .populate("student", "name email")
      .sort({
        score: -1,
      });

    const leaderboard = submissions.map((submission, index) => {
      const { _id, student, ...rest } = submission.toObject({
        versionKey: false,
      });
      console.log(submission.toObject());
      const { _id: studentId, ...restStudent } = student;

      const newStudent = {
        id: studentId,
        ...restStudent,
      };

      return {
        id: _id,
        student: newStudent,
        rank: index + 1,
        ...rest,
      };
    });

    res.status(200).json({
      success: true,
      length: leaderboard.length,
      data: leaderboard,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

async function getAllTimeLeaderboard(req, res) {
  try {
    let leaderboard = await Submission.aggregate([
      {
        $group: {
          _id: "$student",
          totalScore: { $sum: "$score" },
          submissions: { $sum: 1 },
        },
      },
      {
        $sort: { totalScore: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      {
        $unwind: "$studentDetails",
      },
      {
        $project: {
          _id: 1,
          totalScore: 1,
          submissions: 1,
          name: "$studentDetails.name",
          email: "$studentDetails.email",
        },
      },
    ]);
    leaderboard = leaderboard.map((studentData, i) => {
      const { _id, ...rest } = studentData;
      const newStudentData = {
        id: _id,
        rank: i + 1,
        ...rest,
      };
      console.log(newStudentData);
      return newStudentData;
    });

    res.status(200).json({
      success: true,
      length: leaderboard.length,
      data: leaderboard,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getDateSpecificLeaderboard,
  getAllTimeLeaderboard,
};

module.exports = { getDateSpecificLeaderboard, getAllTimeLeaderboard };
