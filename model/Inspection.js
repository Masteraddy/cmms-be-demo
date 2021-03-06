const mongoose = require('mongoose');

const InspectionSchema = new mongoose.Schema(
  {
    serial: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    projectsite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'property',
      required: false,
    },
    building: {
      type: String,
      required: false,
    },
    floor: {
      type: String,
      required: false,
    },
    wing: {
      type: String,
      required: false,
    },
    room: {
      type: String,
      required: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'service',
      required: false,
    },
    observation: {
      type: String,
      required: false,
    },
    workcategory: {
      type: String,
      required: false,
    },
    solution: {
      type: String,
      required: false,
    },
    actionby: {
      type: String,
      required: false,
    },
    estimatecost: {
      type: Number,
      required: false,
    },
    dimension: {
      type: String,
      required: false,
    },
    picture: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: 'pending',
    },
    timecompleted: {
      type: Date,
    },
    timescheduled: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Inspection = mongoose.model('inspection', InspectionSchema);

module.exports = Inspection;
