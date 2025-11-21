import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messageType: { 
      type: String,
      enum: ['like', 'newMessage'], 
      required: true,
    },
    isRead: { 
      type: Boolean,
      default: false, 
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: false, 
    },
    chatId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat', 
      required: false, 
    }
  },
  {
    timestamps: true, 
  }
);

export const Notification = mongoose.model('Notification', NotificationSchema);
