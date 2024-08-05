const Submission = require("../models/SubmissionModel");

async function getDateSpecificLeaderboard(req, res) {
  try {
    const date = req.query.date;
    if (!date) throw new Error("Date parameter is required");

    const startDate = new Date(date + "T00:00:00Z");
    const endDate = new Date(date + "T23:59:59Z");

    const leaderboard = await Submission.aggregate([
      {
        $match: {
          submissionDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$student",
          score: { $sum: "$score" },
          submissions: { $sum: 1 },
        },
      },
      {
        $sort: { score: -1 },
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
          _id: 0,
          id: "$_id",
          score: 1,
          submissions: 1,
          student: {
            id: "$studentDetails._id",
            name: "$studentDetails.name",
            email: "$studentDetails.email",
          },
        },
      },
    ]);

    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    console.log(rankedLeaderboard);

    res.status(200).json({
      success: true,
      length: rankedLeaderboard.length,
      data: rankedLeaderboard,
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
