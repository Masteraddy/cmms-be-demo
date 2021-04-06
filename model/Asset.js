const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema(
  {
    serial: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    used: {
      type: Number,
      default: 0,
    },
    available: {
      type: Number,
      required: true,
    },
    all: {
      type: Number,
      required: true,
    },
    request: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        number: { type: Number },
      },
    ],
  },
  { timestamps: true },
);

const Asset = mongoose.model('asset', AssetSchema);

module.exports = Asset;
