const express = require("express");
const auth = require("../config/auth");
const router = express.Router();
const RegionInfo = require("../service/regioninfo.service");

// Get All RegionInfo
router.get("/", RegionInfo.find);

// Get A RegionInfo
router.get("/:id", RegionInfo.findOne);

// Add A RegionInfo
router.post("/", auth, RegionInfo.post);

// Update A RegionInfo
router.patch("/:id", auth, RegionInfo.update);

// Delete A RegionInfo
router.delete("/:id", auth, RegionInfo.delete);

module.exports = router;
