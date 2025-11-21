
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Message } from "../models/Chat_model/Massage.model.js";
import { Chat } from "../models/Chat_model/Chat.model.js";
import { User } from "../models/User.model.js";
//access chat & create  ><
//delete chat      
//get all chats 



const allUsers = AsyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });  // not include the curent user
    res.send(users);
  });

const AccessChat = AsyncHandler(async (req, res) => {
    const { userId } = req.body
    if (!userId) {
        throw new ApiError(400, "User ID is not provided");
    }

    try {
       
        let isChat = await Chat.find({
            $and: [
                { participants: { $elemMatch: { $eq: req.user._id } } },
                { participants: { $elemMatch: { $eq: userId } } }
            ]
        })
            .populate("participants", "avatar username")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })

    
        isChat = await Chat.populate(isChat, {
            path: "latestMessage.sender",
            select: " avatar"
        });

        if (isChat.length > 0) {

            res.status(200).json({
                statuscode: 200,
                message: "Chat fetched successfully",
                data: isChat
            });
        } else {
          
            const newChat = await Chat.create({
                name: "sender",
                participants: [userId, req.user._id],
            });

            const fullChat = await Chat.findOne({ _id: newChat._id })
                .populate("participants", "avatar username")

            res.status(200).json({
                statuscode: 200,
                message: "New chat created successfully",
                data: fullChat
            });
        }

    } catch (error) {
        throw new ApiError(500, "Server error");
    }
});


const DeleteChat = AsyncHandler(async (req, res) => {
    const { chatId } = req.body;

    try {
  
        await Message.deleteMany({ chat: chatId });

        const chat = await Chat.findByIdAndDelete(chatId);

        if (!chat) {
            return res.status(404).json({
                statuscode: 404,
                message: "Chat not found"
            });
        }

        res.status(200).json({
            statuscode: 200,
            message: "Chat and associated messages deleted successfully"
        });

    } catch (error) {
        throw new ApiError(500, "Server error");
    }
});


const GetAllChat = AsyncHandler(async (req, res) => {
    try {
         let chats = await Chat.find({
            participants: { $elemMatch: { $eq: req.user._id } }
        })
            .populate("participants", " username")



        if (chats.length === 0) {
            return res.status(200).json({
                statuscode: 200,
                message: "No chats found",
                data: []
            });
        }
      
        chats = await Chat.populate(chats, {
            path: "latestMessage.sender",
            select: "username email avatar"
        });

        res.status(200).json({
            statuscode: 200,
            message: "Chats fetched successfully",
            data: chats
        });

    } catch (error) {
        throw new ApiError(500, "Internal server error");
    }
});


export { AccessChat, DeleteChat, GetAllChat, allUsers}







