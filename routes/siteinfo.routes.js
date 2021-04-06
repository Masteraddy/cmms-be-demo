const express = require("express");
const auth = require("../config/auth");
const router = express.Router();
const SiteInfo = require("../service/siteinfo.service");

// Get All SiteInfo
router.get("/", SiteInfo.find);

// Get A SiteInfo
router.get("/:id", SiteInfo.findOne);

// Add A SiteInfo
router.post("/", auth, SiteInfo.post);

// Update A SiteInfo
router.patch("/:id", auth, SiteInfo.update);

// Delete A SiteInfo
router.delete("/:id", auth, SiteInfo.delete);

module.exports = router;
