const { Router } = require("express");
const authControllers = require("../controllers/authControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();

router.post("/register", async (req, res) => {
  await authControllers.registerUser(req, res);
});

router.post("/login", async (req, res) => {
  await authControllers.loginUser(req, res);
});

router.get("/me", authMiddleware, async (req, res) => {
  await authControllers.getCurrentUser(req, res);
});

module.exports = router;
