const createError = require("../utils/createError");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    // Step 1 req.body
    const { email, password, firstname, lastname, confirmPassword } = req.body;
    console.log(email, password, firstname, lastname, confirmPassword);
    // Step 2 validation
    // if (!email) {
    //   return createError(400, "Email is require!!!");
    // }
    // if (!username) {
    //   return createError(400, "username is require!!!");
    // }
    // if (!password) {
    //   return createError(400, "password is require!!!");
    // }
    // Step 3 Check already
    const checkEmail = await db.profile.findFirst({
      where: {
        email: email,
      },
    });
    console.log(checkEmail);
    if (checkEmail) {
      return createError(400, "Email is already exit!!");
    }
    // Step 4 Encrypt password
    const salt = bcrypt.genSaltSync(10);
    const hashPasword = bcrypt.hashSync(password, salt);
    // console.log(hashPasword)
    // Step 5 Insert into DB
    const profile = await db.profile.create({
      data: {
        email: email,
        password: hashPasword,
        firstname: firstname,
        lastname: lastname,
      },
    });
    // Step 6 Response

    res.json({ message: "Register Successfully" });
  } catch (error) {
    console.log("Step 2 catch");
    next(error);
  }
};
exports.login = async (req, res, next) => {
  try {
    // Step 1 Check username
    const { email, password } = req.body;
    console.log(email, password);
    // Step 2 Check email and password
    const profile = await db.profile.findFirst({
      where: {
        email: email,
      },
    });
    if (!profile) {
      return createError(400, "Email,Password is invalid!!");
    }

    const isMatch = bcrypt.compareSync(password, profile.password);
    if (!isMatch) {
      return createError(400, "Email,Password is invalid!!");
    }
    // Step 3 Generate Token
    const payload = {
      email: email,
      firstname: profile.firstname,
      lastname: profile.lastname,
      role: profile.role,
    };
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "1d",
    });
    // console.log(token);

    // Step 4 Response to front-end
    res.json({ message: "Hello Login", result: payload, token: token });
  } catch (error) {
    next(error);
  }
};


exports.currentUser = async (req, res, next) => {
    try {
      console.log(req.user);
      console.log("current User");
      res.json({ message: "Hello, current user" });
    } catch (error) {
      next(error);
    }
  };
  