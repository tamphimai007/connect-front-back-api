const express = require("express");
const authControllers = require("../controllers/auth");
const {
  validateWithZod,
  registerSchema,
  loginSchema,
} = require("../utils/schemas");
const { authCheck, adminCheck } = require("../middlewares/auth");
const router = express.Router();

// @ENDPOINT http://localhost:8000/api/register
router.post(
  "/register",
  validateWithZod(registerSchema),
  authControllers.register
);
router.post("/login",validateWithZod(loginSchema), authControllers.login);
router.get("/current-user", authCheck, authControllers.currentUser);

module.exports = router;
