import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const ChatApp = () => {
    const [chat, setchat] = useState([]);
    const[massage,setMessage]=useState("")
    const [room , setRoom]=useState("")
    const [id, setId]=useState("")
    const socket = io("http://localhost:8000");

    useEffect(() => {
       
        socket.on("connect", () => {
            console.log("connected", socket.id);
            setId(socket.id)
        });

  
        socket.on("massage", (data) => {
            console.log(data);
            setchat((prev)=>[...prev,data])
        });

  
        return () => {
            socket.off("massage"); 
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("massage", {massage,room});
        setMessage("");
    };

    return (
        <div>
            <h1>Simple Form</h1>
            <h4>id is {id}</h4>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First name:</label>
                    <input
                        value={massage}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <div>
                    <label>room:</label>
                    <input
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                    />
                </div>

                <button type="submit">Submit</button>
            </form>
              {
                chat.map((msg)=>(
                  <h1>{msg}</h1>
                ))
              }
        </div>
    );
};

export default ChatApp;
