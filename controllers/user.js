const createError = require("../utils/createError");
const db = require("../config/db");

exports.listUsers = async (req, res, next) => {
  try {
    console.log("list all users");
    // console.log(req.user.email);
    const { email } = req.user;
    const users = await db.profile.findMany({
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    console.log(users);

    res.json({ message: "list all users", result: users });
  } catch (error) {
    next(next);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const { id, role } = req.body;
    // console.log(id, role);
    const updatedRole = await db.profile.update({
      where: {
        id: Number(id),
      },
      data: {
        role: role,
      },
    });

    res.json({ message: "Update Role Success!!!" });
  } catch (error) {
    next(next);
  }
};

exports.removeUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log(req.params.id);
    const deleted = await db.profile.delete({
      where: {
        id: Number(id),
      },
    });
    res.json({ message: "Delete User Success!!" });
  } catch (error) {
    next(error);
  }
};
