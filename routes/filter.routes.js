const express = require("express");
const auth = require("../config/auth");
const router = express.Router();
const Filter = require("../service/filter.service");

// Get All Filter
router.get("/", Filter.find);

// Get A Filter
router.get("/:id", Filter.findOne);

// Add A Filter
router.post("/", auth, Filter.post);

// Update A Filter
router.patch("/:id", auth, Filter.update);

// Delete A Filter
router.delete("/:id", auth, Filter.delete);

module.exports = router;
