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
      trim: true,
    },

    userAgent: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    referrer: {
      type: String,
      default: null,
      trim: true,
      maxlength: 1000,
    },

    country: {
      type: String,
      default: "Unknown",
      trim: true,
      index: true,
    },

    city: {
      type: String,
      default: "Unknown",
      trim: true,
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

// Analytics query optimization
clickEventSchema.index({ urlId: 1, clickedAt: -1 });

// Optional auto-delete after 1 year
// clickEventSchema.index(
//   { clickedAt: 1 },
//   { expireAfterSeconds: 60 * 60 * 24 * 365 }
// );

export default mongoose.model("ClickEvent", clickEventSchema);