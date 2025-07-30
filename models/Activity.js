const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    targetUser: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      enum: ["follow", "like", "comment", "mention"],
      required: true,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "post",
    },
    comment: {
      type: mongoose.Types.ObjectId,
      ref: "comment",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
ActivitySchema.index({ targetUser: 1, read: 1, createdAt: -1 });
ActivitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("activity", ActivitySchema); 