# Server

## Step 1 Create package.json

```bash
npm init -y
```

## Step 2 Install Package..

```bash
npm install express cors morgan prisma nodemon jsonwebtoken bcryptjs zod
```

## Step 4 Create index.js

```js
const express = require("express");
const app = express();

// Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
```

## Step 5 Edit package.json

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  }
}
```

## Step 6 Routing and Controllers

index.js

```js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// import Routing
const landmarkRouter = require("./routes/landmark");
const userRouter = require("./routes/user");

const handleErrors = require("./middlewares/error");
const app = express();

// Middlewares
app.use(cors()); // Allows Cross origin
app.use(morgan("dev")); // Show log
app.use(express.json()); // For Read JSON

// Routing
app.use("/api", landmarkRouter);
app.use("/api", userRouter);

// Handle Error
app.use(handleErrors);
// Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
```

/routes/user.js

```js
const express = require("express");
const userControllers = require("../controllers/user");
const router = express.Router();

// @ENDPOINT http://localhost:8000/api/register
router.post("/register", userControllers.register);
router.post("/login", userControllers.login);

module.exports = router;
```

/controllers/user.js

```js
exports.register = async (req, res, next) => {
  try {
    res.json({ message: "Hello Register" });
  } catch (error) {
    next(error);
  }
};
exports.login = async (req, res, next) => {
  try {
    res.json({ message: "Hello Login" });
  } catch (error) {
    next(error);
  }
};
```

## Step 7 Handle Error middlewares

create /middleweres/error.js

```js
const handleErrors = (err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Server Error!!!" });
};

module.exports = handleErrors;
```

and update index.js

```js
// import
const handleErrors = require("./middlewares/error");

// Handle Error
app.use(handleErrors);
```

## Step 8 Logic Register

/controllers/user.js
func register

```js
exports.register = async (req, res, next) => {
  try {
    // Step 1 req.body
    // Step 2 validation
    // Step 3 Check already
    // Step 4 Encrypt password
    // Step 5 Insert into DB
    // Step 6 Response

    res.json({ message: "Hello Register" });
  } catch (error) {
    next(error);
  }
};
```

next step

```js
exports.register = async (req, res, next) => {
  try {
    // Step 1 req.body
    const { email, username, password, confirmPassword } = req.body;
    console.log(email, username, password, confirmPassword);
    // Step 2 validation
    if (!email) {
      return res.status(400).json({ message: "Email is required!!!" });
    }
    // Step 3 Check already
    // Step 4 Encrypt password
    // Step 5 Insert into DB
    // Step 6 Response

    res.json({ message: "Hello Register" });
  } catch (error) {
    next(error);
  }
};
```

next

```js
exports.register = async (req, res, next) => {
  try {
    // Step 1 req.body
    const { email, username, password, confirmPassword } = req.body;
    console.log(email, username, password, confirmPassword);
    // Step 2 validation
    if (!email) {
      return res.status(400).json({ message: "Email is require!!!" });
    }
    if (!username) {
      return res.status(400).json({ message: "username is require!!!" });
    }
    if (!password) {
      // return res.status(400).json({ message: "password is required!!!" });
      throw new Error("password is required!!!");
    }
    // Step 3 Check already
    // Step 4 Encrypt password
    // Step 5 Insert into DB
    // Step 6 Response

    res.json({ message: "Hello Register" });
  } catch (error) {
    next(error);
  }
};
```

## Step 9 Create Error func

create folder /utils/createError.js

```js
const createError = (code, message) => {
  console.log("Step 1 create Error");
  const error = new Error(message);
  error.statusCode = code;
  throw error;
};

module.exports = createError;
```

update /controllers/user.js

```js
exports.register = async (req, res, next) => {
  try {
    // Step 1 req.body
    const { email, username, password, confirmPassword } = req.body;
    console.log(email, username, password, confirmPassword);
    // Step 2 validation
    if (!email) {
      return createError(400, "Email is require!!!");
    }
    if (!username) {
      return createError(400, "username is require!!!");
    }
    if (!password) {
      return createError(400, "password is require!!!");
    }
    // Step 3 Check already
    // Step 4 Encrypt password
    // Step 5 Insert into DB
    // Step 6 Response

    res.json({ message: "Hello Register" });
  } catch (error) {
    console.log("Step 2 catch");
    next(error);
  }
};
```

update /middlewares/error.js

```js
const handleErrors = (err, req, res, next) => {
  console.log("Step 3 handle Error");
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Server Error!!!" });
};

module.exports = handleErrors;
```

## Step 10 Validate with zod

https://www.npmjs.com/package/zod

```bash
npm i zod
```

update code
/routes/user.js

```js
const express = require("express");
const userControllers = require("../controllers/user");
const router = express.Router();

const { z } = require("zod");
const registerSchema = z.object({
  username: z.string().min(3, "Username ต้องมีอย่างน้อย 3 ตัวอักษร"),
  email: z.string().email("Email ไม่ถูกต้อง"),
  password: z.string().min(6, "Password ต้องมีอย่างน้อย 6 ตัวอักษร"),
});
const validateWithZod = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // Check body
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
};

// @ENDPOINT http://localhost:8000/api/register
router.post(
  "/register",
  validateWithZod(registerSchema),
  userControllers.register
);
router.post("/login", userControllers.login);

module.exports = router;
```

### Custom logic validate

https://zod.dev/?id=refine

```js
const registerSchema = z
  .object({
    username: z.string().min(3, "Username ต้องมีอย่างน้อย 3 ตัวอักษร"),
    email: z.string().email("Email ไม่ถูกต้อง"),
    password: z.string().min(6, "Password ต้องมีอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password ต้องมีอย่างน้อย 6 ตัวอักษร"),
  })
  .refine((data) => console.log("custom with refine", data));
```

update

```js
const registerSchema = z
  .object({
    username: z.string().min(3, "Username ต้องมีอย่างน้อย 3 ตัวอักษร"),
    email: z.string().email("Email ไม่ถูกต้อง"),
    password: z.string().min(6, "Password ต้องมีอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password ต้องมีอย่างน้อย 6 ตัวอักษร"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password และ Confirm Password ต้องตรงกัน",
    path: ["confirmPassword"], // ระบุ path ที่ error จะแสดง
  });
```

next Step handle Error

```js
const validateWithZod = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // Check body
    next();
  } catch (error) {
    console.log(error.errors[0].message);
    console.log(error.errors[1].message);
    return res.status(400).json({ error: error.errors });
  }
};
```

ทดสอบ in jsitor

```js
const error = {
  errors: [
    { message: "username ต้องมีอย่างน้อย 3 ตัวอักษร" },
    { message: "email ไม่ถูกต้อง" },
    { message: "password ต้องมีอย่างน้อย 3 ตัวอักษร" },
  ],
};

console.log(error.errors[0].message);
```

next step jsitor

```js
const error = {
  errors: [
    { message: "username ต้องมีอย่างน้อย 3 ตัวอักษร" },
    { message: "email ไม่ถูกต้อง" },
    { message: "password ต้องมีอย่างน้อย 3 ตัวอักษร" },
  ],
};

// console.log(error.errors[0].message)

const errMsg = error.errors.map((item) => {
  // console.log(item)
  // console.log(item.message)
  return item.message;
});
const errTxt = errMsg.join(",");
console.log(errTxt);
const mergeError = new Error(errMsg.join(","));
console.log(mergeError);
```

update routes/user.js

```js
const validateWithZod = (schema) => (req, res, next) => {
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
    next(mergeError);
  }
};
```

### Separate file

create /utils/schemas.js

```js
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
    createError(400, mergeError);
    next(mergeError);
  }
};
```

update /routes/user.js

```js
const express = require("express");
const userControllers = require("../controllers/user");
const { validateWithZod, registerSchema } = require("../utils/schemas");
const router = express.Router();

// @ENDPOINT http://localhost:8000/api/register
router.post(
  "/register",
  validateWithZod(registerSchema),
  userControllers.register
);
router.post("/login", userControllers.login);

module.exports = router;
```

### login schema

/utils/schemas.js

```js
exports.loginSchema = z.object({
  email: z.string().min(3, "email ต้องมีอย่างน้อย 3 ตัวอักษร"),
  password: z.string().min(6, "password ต้องมีอย่างน้อย 6 ตัวอักษร"),
});
```

update
/routes/user.js

```js
const express = require("express");
const userControllers = require("../controllers/user");
const {
  validateWithZod,
  registerSchema,
  loginSchema,
} = require("../utils/schemas");
const router = express.Router();

// @ENDPOINT http://localhost:8000/api/register
router.post(
  "/register",
  validateWithZod(registerSchema),
  userControllers.register
);
router.post("/login", validateWithZod(loginSchema), userControllers.login);

module.exports = router;
```

## Step 11 Prisma

https://www.prisma.io/docs/getting-started/quickstart-sqlite

```bash
npm install prisma
npx prisma init
```

### Edit /prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Profile {
  id Int @id @default(autoincrement())
}

```

### Edit .env

```plaintext
DATABASE_URL="mysql://root:1234@localhost:3306/landmark"
```

### Migrate

```bash
npx prisma migrate dev --name "init"
```

### update model

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Profile {
  id        Int      @id @default(autoincrement())
  email     String
  password  String
  firstname String
  lastname  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}

```

## Step 12 Config

/config/db.js

```js
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

module.exports = db;
```

## Step 13 Controller Register

/controller/user.js

```js
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
```

## Step 14 Controller Login

```js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
```

## Step 15 CurrentUser

/routes/user.js

```js
const express = require("express");
const userControllers = require("../controllers/user");
const {
  validateWithZod,
  registerSchema,
  loginSchema,
} = require("../utils/schemas");
const router = express.Router();

// @ENDPOINT http://localhost:8000/api/register
router.post(
  "/register",
  validateWithZod(registerSchema),
  userControllers.register
);
router.post("/login", userControllers.login);

router.get("/current-user", userControllers.currentUser);

module.exports = router;
```

/controllers/user.js

```js
exports.currentUser = async (req, res, next) => {
  try {
    console.log("current User");
    res.json({ message: "Hello, current user" });
  } catch (error) {
    next(error);
  }
};
```

### middlewares auth

/middlewares/auth.js

```js
exports.auth = async (req, res, next) => {
  try {
    console.log("hello, middleware");
    next();
  } catch (error) {
    next(error);
  }
};
```

update code
/routes/user.js

```js
const { authCheck } = require("../middlewares/auth");

router.get("/current-user", authCheck, userControllers.currentUser);
```

### udpate

/middlewares/auth.js
ทดสอบ expire

```js
const jwt = require("jsonwebtoken");

exports.authCheck = async (req, res, next) => {
  try {
    const headers = req.headers.authorization;
    const token = headers.split(" ")[1];

    const user = jwt.verify(token, process.env.SECRET);
    console.log("tam", user);
    next();
  } catch (error) {
    next(error);
  }
};
```

udpate next Step handle error

```js
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
```

## Step 16 List all users

/controllers/user.js

```js
exports.listUsers = async (req, res, next) => {
  try {
    console.log("list all users");
    res.json({ message: "list all users" });
  } catch (error) {
    next(next);
  }
};
```

/routes/user.js

```js
// user
router.get("/users", userControllers.listUsers);
```

### middleware adminCheck

/middlewares/auth

```js
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
    console.log(user);
    next();
  } catch (error) {
    next(error);
  }
};
```

update code routes
/routes/user.js

```js
const express = require("express");
const userControllers = require("../controllers/user");
const { authCheck, adminCheck } = require("../middlewares/auth");
const router = express.Router();

// List all user
// @ENDPOINT http://localhost:8000/api/users
router.get("/users", authCheck, adminCheck, userControllers.listUsers);
module.exports = router;
```

update controller list all user

```js
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

    res.json({ message: "list all users" });
  } catch (error) {
    next(next);
  }
};
```

## Step 17 Update Role

/controllers/user.js

```js
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
```

update /routes/user.js

```js
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
module.exports = router;
```

## Step 18 Delete User

/controllers/user.js

```js
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
```

update /routes/user.js

```js
router.delete("/user/:id", authCheck, adminCheck, userControllers.removeUser);
```
