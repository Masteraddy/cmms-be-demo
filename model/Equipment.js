const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    available: {
      type: Number,
      required: true,
    },
    users: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        number: { type: Number },
      },
    ],
  },
  { timestamps: true },
);

const Equipment = mongoose.model('equipment', EquipmentSchema);

module.exports = Equipment;
