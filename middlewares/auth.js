const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const db = require("../config/db");

exports.authCheck = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer")) {
      return createError(400, "Missing Token!!!");
    }
    const token = authorization.split(" ")[1];
    // verify token
    // const user = jwt.verify(token, process.env.SECRET);
    jwt.verify(token, process.env.SECRET, (err, decode) => {
      //   console.log("middleware", err.message);
      //   console.log("middleware", decode);
      if (err) {
        return createError(401, "Unauthorized !!!");
      }
      req.user = decode;
      next();
    });
  } catch (error) {
    next(error);
  }
};

exports.adminCheck = async (req, res, next) => {
  try {
    console.log("admin Check");
    // console.log(req.user);
    const { email } = req.user;
    // console.log(email);
    const user = await db.profile.findFirst({
      where: {
        email: email,
      },
    });
    if (user.role !== "ADMIN") {
      return createError(403, "Forbidden!!!");
    }
    // console.log(user);
    next();
  } catch (error) {
    next(error);
  }
};
