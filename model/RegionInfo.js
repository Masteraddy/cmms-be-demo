const mongoose = require("mongoose");

const RegionInfoSchema = new mongoose.Schema({
  site_id: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  site_name: {
    type: String,
    required: true,
  },
  cluster: {
    type: String,
    required: true,
  },
  site_classification: {
    type: String,
    required: true,
  },
  mech_engr: {
    type: String,
    required: true,
  },
  elect_engr: {
    type: String,
    required: true,
  },
  driver: {
    type: String,
    required: true,
  },
  ac_technicial: {
    type: String,
    required: true,
  },
  project_manager: {
    type: String,
    required: true,
  },
  pm_contact: {
    type: String,
    required: true,
  },
  cluster_teamlead: {
    type: String,
    required: true,
  },
  ops_manager: {
    type: String,
    required: true,
  },
});

const RegionInfo = mongoose.model("regioninfo", RegionInfoSchema);

module.exports = RegionInfo;
