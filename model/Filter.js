const mongoose = require("mongoose");

const FilterSchema = new mongoose.Schema({
  kva: {
    type: String,
    required: true,
  },
  oil_filter: {
    type: String,
    required: true,
  },
  fuel_filter: {
    type: String,
    required: true,
  },
  oil_required: {
    type: String,
    required: true,
  },
  air_filter: {
    type: String,
    required: true,
  },
});

const Filter = mongoose.model("filters", FilterSchema);

module.exports = Filter;
