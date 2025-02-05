const handleErrors = (err, req, res, next) => {
  console.log("Step 3 handle Error");
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Server Error!!!" });
};

module.exports = handleErrors;
