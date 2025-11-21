import mongoose, { Schema } from "mongoose";

const StorySchema = new Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    image: {
      type: String, 
      required: false,
    },
    video: {
      type: String, 
      required: false,
    },
    text: {
      type: String, 
      required: false,
    },
    timestamp: {
      type: Date, 
      default: Date.now,
    },
    expiresAt: {
      type: Date, 
      required: true,
    },
  },
  {
    timestamps: true, 
  });

export const Story = mongoose.model("Story", StorySchema);

