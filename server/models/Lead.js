const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  company: {
    type: String,
    default: "",
  },

  requirement: {
    type: String,
    required: true,
  },

  trackingId: {
    type: String,
    unique: true,
  },

  emailSent: {
    type: Boolean,
    default: false,
  },

  opened: {
    type: Boolean,
    default: false,
  },

  clicked: {
    type: Boolean,
    default: false,
  },

  openedAt: Date,

  clickedAt: Date,

}, {
  timestamps: true,
});

module.exports = mongoose.model("Lead", LeadSchema);