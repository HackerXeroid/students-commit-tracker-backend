const {Router} = require("express");
const router = Router();
const userControllers = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");

router.delete("/", authMiddleware, userControllers.deleteUser);

module.exports = router;