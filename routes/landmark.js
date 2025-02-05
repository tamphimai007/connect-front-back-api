const express = require("express");
const landmarkControllers = require("../controllers/landmark");
const router = express.Router();

// @ENDPOINT http://localhost:8000/api/landmarks
router.get("/landmarks", landmarkControllers.listLandmark);
router.get("/landmark/:id", landmarkControllers.readLandmark);
router.post("/landmark", landmarkControllers.createLandmark);
router.put("/landmark/:id", landmarkControllers.editLandmark);
router.delete("/landmark/:id", landmarkControllers.deleteLandmark);

module.exports = router;
