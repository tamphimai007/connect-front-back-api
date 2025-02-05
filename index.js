const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// import Routing
const landmarkRouter = require("./routes/landmark");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");

const handleErrors = require("./middlewares/error");
const notFound = require("./utils/notfound");
const app = express();

// Middlewares
app.use(cors()); // Allows Cross origin
app.use(morgan("dev")); // Show log
app.use(express.json()); // For Read JSON

// Routing
app.use("/api", landmarkRouter);
app.use("/api", authRouter);
app.use("/api", userRouter);

// Handle Error
app.use(handleErrors);
app.use("*", notFound);
// Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
