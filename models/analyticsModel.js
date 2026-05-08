import mongoose from "mongoose";

const clickEventSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
      index: true,
    },

    ipAddress: {
      type: String,
      required: true,
    },

    userAgent: {
      type: String,
    },

    referrer: {
      type: String,
      default: null,
    },

    country: {
      type: String,
      default: "Unknown",
      index: true,
    },

    clickedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Compound index for analytics queries
clickEventSchema.index({ urlId: 1, clickedAt: -1 });

export default mongoose.model("ClickEvent", clickEventSchema);