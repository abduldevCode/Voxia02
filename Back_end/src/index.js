import { config } from 'dotenv';
import connectDB from './db/index.js';
import { app } from './App.js';
import { createServer } from 'http';
import { Server } from 'socket.io';



config();
const PORT = process.env.PORT || 8001;
const server = createServer(app);



const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
})

export const onlineUsers = new Map();

// Set up Socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        onlineUsers.set(userData._id, socket.id);
        socket.emit("communication");
    });

    socket.on("join chat", (room) => {
        socket.join(room);

    });

    socket.on("new message", (newMessageRecieved) => {

        let chat = newMessageRecieved.chat;
        if (!chat.participants) return console.log("no user found")

        chat.participants.forEach(user => {
            if (user === newMessageRecieved.sender._id) return

            socket.in(user).emit("message recieved", newMessageRecieved)
        });
    })


    socket.on("new notification", (notificationData) => {

        const receiverId = notificationData.receiver;
          console.log("notifion is xxxxxx",notificationData)
        socket.in(receiverId).emit("notification received", notificationData);
    });

    socket.on("disconnect", () => {
        for (let [key, value] of onlineUsers.entries()) {
            if (value === socket.id) {
                onlineUsers.delete(key);
                break;
            }
        }
        console.log("User disconnected: ", socket.id);
    });
});


// Connect to the database and start the server
connectDB()
    .then(() => {
        // Start the server on the desired port
        server.listen(PORT, () => {
            console.log(`Server is running at  http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Error in DB connection:", error);
    });


app.get('/', (req, res) => {
    res.send('Socket.io is running!');
});