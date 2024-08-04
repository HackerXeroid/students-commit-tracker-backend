const User = require('../models/UserModel');

const getAllTeacherStatus = async (req, res) => {
  try {
    const results = await User.aggregate([
      {
        $match: {
          role: { $in: ["teacher_pending", "teacher_rejected", "teacher"] }
        }
      },
      {
        $project: {
          id: "$_id",
          name: 1,
          email: 1,
          status: {
            $switch: {
              branches: [
                { case: { $eq: ["$role", "teacher_pending"] }, then: "Pending" },
                { case: { $eq: ["$role", "teacher_rejected"] }, then: "Rejected" },
                { case: { $eq: ["$role", "teacher"] }, then: "Approved" }
              ],
              default: "Unknown"
            }
          },
          dateApplied: "$createdAt"
        }
      },
      {
        $sort: { dateApplied: -1 } // Optional: Sort by dateApplied if needed
      }
    ]);

    res.json(results);
  } catch (error) {
    console.error("Error aggregating user statuses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const approveTeacher = async (req, res) => {
  const { teacherId: id } = req.params;

  try {
    const result = await User.findByIdAndUpdate(
      id,
      { role: 'teacher' },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error approving teacher:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const rejectTeacher = async (req, res) => {
  const { teacherId: id } = req.params;
  
  try {
    const result = await User.findByIdAndUpdate(
      id,
      { role: 'teacher_rejected' },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error rejecting teacher:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  getAllTeacherStatus,
  approveTeacher,
  rejectTeacher
};
