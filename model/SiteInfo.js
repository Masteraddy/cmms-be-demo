const mongoose = require("mongoose");

const SiteInfoSchema = new mongoose.Schema({
  site_id: {
    type: String,
    required: true,
  },
  site_classification: {
    type: String,
    required: true,
  },
  atc_site_id: {
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
  company: {
    type: String,
    required: true,
  },
  gen_capacity: {
    type: String,
    required: true,
  },
  maintenance_type: {
    type: String,
    required: true,
  },
  site_type: {
    type: String,
    required: true,
  },
  cluster: {
    type: String,
    required: true,
  },
  HVAC_Info: {
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
});

const SiteInfo = mongoose.model("siteinfo", SiteInfoSchema);

module.exports = SiteInfo;
