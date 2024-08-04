const User = require("../models/UserModel");

module.exports = async function teacherMiddleware(req, res, next) {
  try {
    const user = await User.findById(req.body.userId);
    if (user.role.toLowerCase().startsWith("teacher") && req.method === "DELETE") return next(); 
    if (user.role !== "teacher") throw new Error("You are not authorized to access this route");
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "You are not authorized to access this route",
    });
  }
};
