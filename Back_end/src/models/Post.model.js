import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        media: [
            {
                type: String, // Can be cloudinary URL
            }
        ]
    },
    {
        timestamps: true,
    }
);
export const Post = mongoose.model("Post", PostSchema);
