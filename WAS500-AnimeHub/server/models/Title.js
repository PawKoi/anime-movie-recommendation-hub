import mongoose from "mongoose";

const titleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["Anime", "Movie"],
      required: true
    },
    genres: {
      type: [String],
      default: []
    },
    year: {
      type: Number
    },
    synopsis: {
      type: String
    },
    poster: {
      type: String
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }

  },
  { timestamps: true }
);

titleSchema.index({ genres: 1 });

export const Title = mongoose.model("Title", titleSchema);
