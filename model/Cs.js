const mongoose = require('mongoose');

const CsSchema = new mongoose.Schema(
  {
    serial: {
      type: Number,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    projectsite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'property',
      required: true,
    },
    ticket: {
      type: String,
      required: true,
    },
    quality: {
      type: Number,
      required: true,
    },
    appearance: {
      type: Number,
      required: true,
    },
    timing: {
      type: Number,
      required: true,
    },
    professionalism: {
      type: Number,
      required: true,
    },
    ticketclose: {
      type: Boolean,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Cs = mongoose.model('cs', CsSchema);

module.exports = Cs;
