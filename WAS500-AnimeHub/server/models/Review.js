import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    titleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Title",
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    text: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// reviewSchema.index({ titleId: 1, userId: 1 });

export const Review = mongoose.model("Review", reviewSchema);
