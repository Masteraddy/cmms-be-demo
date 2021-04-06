const express = require("express");
const auth = require("../config/auth");
const router = express.Router();
const IHSData = require("../service/ihsdata.service");

// Get All IHSData
router.get("/", IHSData.find);

// Get A IHSData
router.get("/:id", IHSData.findOne);

// Add A IHSData
router.post("/", auth, IHSData.post);

// Update A IHSData
router.patch("/:id", auth, IHSData.update);

// Delete A IHSData
router.delete("/:id", auth, IHSData.delete);

module.exports = router;
