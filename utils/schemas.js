const { z } = require("zod");
const createError = require("./createError");

exports.registerSchema = z
  .object({
    email: z.string().email("Email ไม่ถูกต้อง"),
    password: z.string().min(6, "Password ต้องมีอย่างน้อย 6 ตัวอักษร"),
    firstname: z.string().min(3, "Firstname ต้องมีอย่างน้อย 3 ตัวอักษร"),
    lastname: z.string().min(3, "Lastname ต้องมีอย่างน้อย 3 ตัวอักษร"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password ต้องมีอย่างน้อย 6 ตัวอักษร"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password และ Confirm Password ต้องตรงกัน",
    path: ["confirmPassword"], // ระบุ path ที่ error ควรแสดง
  });

exports.loginSchema = z.object({
  email: z.string().min(3, "email ไม่ถูกต้อง"),
  password: z.string().min(6, "password ต้องมีอย่างน้อย 6 ตัวอักษร"),
});

exports.validateWithZod = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // Check body
    next();
  } catch (error) {
    console.log(error.errors[0].message);
    // Easy
    const errMsg = error.errors.map((item) => item.message);
    // console.log(err)
    // return res.status(400).json({ error: error.errors });
    const mergeError = new Error(errMsg.join(","));
    // createError(400, mergeError);
    next(mergeError);
  }
};
