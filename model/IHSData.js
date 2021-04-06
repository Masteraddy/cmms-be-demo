const mongoose = require("mongoose");

const IHSDataSchema = new mongoose.Schema({
  site_id: {
    type: String,
    required: true,
  },
  ihs_id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  dg_solution: {
    type: String,
    required: true,
  },
  genset_maintenance: {
    type: String,
    required: true,
  },
  clusters: {
    type: String,
    required: true,
  },
  site_address: {
    type: String,
    required: true,
  },
  contacts: {
    type: String,
    required: true,
  },
  technician: {
    type: String,
    required: true,
  },
  dg1_capacity: {
    type: String,
    required: true,
  },
  dg2_capacity: {
    type: String,
    required: true,
  },
  oil_filter15_18: {
    type: String,
    required: true,
  },
  fuel_filter15_18: {
    type: String,
    required: true,
  },
  oil_filter27: {
    type: String,
    required: true,
  },
  fuel_filter163_eco: {
    type: String,
    required: true,
  },
  fuel_filter_eco: {
    type: String,
    required: true,
  },
  dc_oil_filter: {
    type: String,
    required: true,
  },
  dc_fuel_filter_pry: {
    type: String,
    required: true,
  },
  dc_fuel_filter_sec: {
    type: String,
    required: true,
  },
  oil_filter407: {
    type: String,
    required: true,
  },
  fuel_filter1117_eco: {
    type: String,
    required: true,
  },
  mikano_york_eng_pry_ff: {
    type: String,
    required: true,
  },
  mikano_york_eng_scdr_ff: {
    type: String,
    required: true,
  },
  mikano_york_eng_oil_fltr: {
    type: String,
    required: true,
  },
});

const IHSData = mongoose.model("ihsdatas", IHSDataSchema);

module.exports = IHSData;
