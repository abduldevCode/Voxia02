import mongoose, { Schema } from 'mongoose';

const ChatSchema = new Schema(
  {
  
    name: {
      type: String,
      trim: true, // For group chat or specific chat names
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    //isGroupChat: { type: Boolean, default: false },
     // groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model('Chat', ChatSchema);
