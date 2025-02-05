exports.listLandmark = async (req, res, next) => {
  try {
    // console.log(test);
    res.json({ message: "Hello List Landmark" });
  } catch (error) {
    next(error);
  }
};
exports.readLandmark = async (req, res, next) => {
  try {
    // console.log(test);
    res.json({ message: "Hello READ Landmark" });
  } catch (error) {
    next(error);
  }
};
exports.createLandmark = async (req, res, next) => {
  try {
    // console.log(test);
    res.json({ message: "Hello CREATE Landmark" });
  } catch (error) {
    next(error);
  }
};
exports.editLandmark = async (req, res, next) => {
  try {
    // console.log(test);
    res.json({ message: "Hello Edit Landmark" });
  } catch (error) {
    next(error);
  }
};
exports.deleteLandmark = async (req, res, next) => {
  try {
    // console.log(test);
    res.json({ message: "Hello Remove Landmark" });
  } catch (error) {
    next(error);
  }
};
