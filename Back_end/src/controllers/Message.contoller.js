import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Message } from "../models/Chat_model/Massage.model.js";
import { Chat } from "../models/Chat_model/Chat.model.js";
import { Notification } from "../models/Notif.model.js";
import { onlineUsers } from "../index.js";
//create massage
//update massage
//delete massage
//get all massage of chat \
const CreateMessage = AsyncHandler(async (req, res) => {
    const { content } = req.body;
    const { id } = req.params; // Corrected: use `req.params` to get the chatId

    if (!content || !id) {
        throw new ApiError(400, "Content and chat ID are required");
    }

    try {
        // Create new message
        const newMessage = await Message.create({
            sender: req.user._id,  // Ensure that `req.user` is set by AuthJWT middleware
            content: content,
            chat: id
        })

        if (!newMessage) {
            throw new ApiError(400, "Message not created");
        }
        const populatedMessage = await newMessage.populate('sender', 'username')
        const populatedMessage02 = await populatedMessage.populate('chat')

        // Update chat with new message ID
        const updatedChat = await Chat.findByIdAndUpdate(
            id,  // Use `id` from `req.params`
            {
                $set: {
                    lastMessage: newMessage._id,
                }
            },
            { new: true }
        );

        if (!updatedChat) {
            throw new ApiError(400, "Chat not updated with latest message");
        }


        ///for notify i need
        // sender: senderid = authjwt,
        //receiver: req.user._id = websket map,
        // isRead: false,
        //chatId = getChat[0]._id =  updatedChat() ;
        //participants: [userId, req.user._id],
      
        const recipient = updatedChat.participants.find(
            user => user._id.toString() !== req.user._id.toString()
        );
 
        if (!recipient) {
            throw new ApiError(400, "Recipient not found in chat");
        }

        // 5. Check if recipient is online
        const recipientSocketId = onlineUsers.get(recipient._id.toString());

        console.log('this is xxxxxxxxxxxxxxxxxx', recipientSocketId)


        if (!recipientSocketId) {
       
            console.log("recipientSocketId ",recipientSocketId)
         const notify=   await Notification.create({
                sender: req.user._id,
                receiver: recipient._id,
                isRead: false,
                messageType: "newMessage",
                chatId:updatedChat
            });

            console.log("notify is//////////////////////// ",notify)
        }



        return res.json({
            statuscode: 200,
            message: "Message stored successfully",
            data: populatedMessage02
        });

    } catch (error) {
        throw new ApiError(500, "Internal server error");
    }
});


const DeleteMessage = AsyncHandler(async (req, res) => {

    const { id } = req.params
    try {
        const result = await Message.findByIdAndDelete(id)

        if (!result) {
            throw new ApiError(404, "not found")
        }

        return res.json({
            statuscode: 200,
            message: "Massage delete successfully",
        })
    } catch (error) {
        throw new ApiError(500, "internal server error")
    }

})

const GetAllMessage = AsyncHandler(async (req, res) => {
    const { chatId } = req.body

    if (!chatId) {
        throw new ApiError(400, "Chat ID is required");
    }

    try {
        const allMessages = await Message.find({ chat: chatId })
            .populate("sender", "avatar username")


        if (allMessages.length > 0) {
            return res.json({
                statuscode: 200,
                message: "Fetched all messages successfully",
                data: allMessages || []
            });
        } else {
            return res.json({
                statuscode: 299,
                message: "no chat found",

            });
        }


    } catch (error) {
        throw new ApiError(500, "Internal server error");
    }
});

const CreateNotification = AsyncHandler(async (req, res) => {
    const { senderid, eventType, postId } = req.body;
    try {

        if (!senderid || !eventType) {
            throw new ApiError(400, "Missing required fields");
        }


        let notificationData = {
            sender: senderid,
            receiver: req.user._id,
            isRead: false,
        };

        if (eventType === "like") {
            notificationData.messageType = "like";
            notificationData.postId = postId;
        }
        else if (eventType === "newMessage") {
            notificationData.messageType = "newMessage";
            let getChat = await Chat.find({
                $and: [
                    { participants: { $elemMatch: { $eq: req.user._id } } },
                    { participants: { $elemMatch: { $eq: senderid } } }
                ]
            });

            if (getChat[0].length === 0) {
                throw new ApiError("chat not found")
            }

            console.log('Found chats:', getChat);
            notificationData.chatId = getChat[0]._id;
        }

        else {
            throw new ApiError(400, "Invalid event type");
        }

        const newNotify = await Notification.create(notificationData);
        const populatedNotification = await newNotify.populate({
            path: 'sender',
            select: '_id avatar username',
        });

        res.status(200).json({ message: "Notification created successfully", data: populatedNotification });
    } catch (error) {
        console.error('Error in CreateNotification:', error);
        throw new ApiError(500, "Internal server error");
    }
});

const getNotifications = AsyncHandler(async (req, res) => {
    try {
        const notifications = await Notification.find({ receiver: req.user._id })
            .populate('sender', '_id avatar username')
            .sort({ createdAt: -1 });

        res.status(200)
            .json({
                message: "Notifications fetched successfully",
                data: notifications,
            });
    } catch (error) {
        console.error('Error in getNotifications:', error);
        throw new ApiError(500, "Internal server error");
    }
});

const readAllNotification = AsyncHandler(async (req, res) => {
    const userId = req.user.id;
    try {

        const result = await Notification.updateMany(
            { receiver: userId, isRead: false },
            { $set: { isRead: true } }
        );
        if (result.matchedCount === 0) {
            return res.status(200).json({ data: 'No unreads notifications found' });
        }
        res.status(200).json({
            message: 'All notifications marked as read',
            data: result.modifiedCount,
        });
    } catch (error) {
        throw new ApiError(500, "Internal server error")
    }
});





export {
    CreateMessage,
    DeleteMessage,
    GetAllMessage,
    CreateNotification,
    getNotifications,
    readAllNotification
}