const express = require("express");
const userControllers = require("../controllers/user");
const { authCheck, adminCheck } = require("../middlewares/auth");
const router = express.Router();

// List all user
// @ENDPOINT http://localhost:8000/api/users
router.get("/users", authCheck, adminCheck, userControllers.listUsers);
router.patch(
  "/user/update-role",
  authCheck,
  adminCheck,
  userControllers.updateRole
);
router.delete("/user/:id", authCheck, adminCheck, userControllers.removeUser);

module.exports = router;
