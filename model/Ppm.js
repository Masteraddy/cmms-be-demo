const mongoose = require('mongoose');

const PpmSchema = new mongoose.Schema(
  {
    serial: {
      type: Number,
      required: true,
    },
    ppmname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    projectsite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'property',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'service',
      required: true,
    },
    startdate: {
      type: Date,
    },
    nextdate: {
      type: Date,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Ppm = mongoose.model('ppm', PpmSchema);

module.exports = Ppm;
