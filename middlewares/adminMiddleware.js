const User = require("../models/UserModel");

module.exports = async function adminMiddleware(req, res, next) {
  try {
    const user = await User.findById(req.body.userId);
    if (user.role !== "admin") throw new Error("You are not authorized to access this route");
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "You are not authorized to access this route",
    });
  }
};
