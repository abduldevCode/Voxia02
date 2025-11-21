import React from "react";
import img02 from "../../Assets/img02.png"

const onFriends = [
    { id: 1, name: "Emma Watson", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 2, name: "Tom Hardy", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 3, name: "Scarlett Johansson", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 4, name: "Chris Hemsworth", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 5, name: "Natalie Portman", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 6, name: "Emma Watson", avatar: "/placeholder.svg?height=32&width=32" },
 
];

function OnFriends() {
    return (
        <div className="online-friends" >
            <div className="header05
            ">
                <h2 className="title009">Online Friends</h2>
            </div>
          <div  className="flow">
                {onFriends.map((friend) => (
                    <div key={friend.id} className="friend-item02">
                        <div className="avatar-second">
                            <div className="avatar-sec">
                                <img src={img02} alt="Avatar" />
                            </div>
                            <span className="online-statues"></span>
                        </div>

                        <div className="friend-info">
                            <p className="friend-name009">{friend.name}</p>
                            <div className="status">

                                <p className="status-text">Online</p>
                            </div>
                        </div>
                    </div>
                ))}
           </div> 
           </div>
    
    );
}

export default OnFriends;


function Avatar({ src, alt, name }) {
    return (
        <div className="avatar">
            <img src={src} alt={alt} className="avatar-image" />
            <div className="avatar-fallback">{name.split(" ").map(n => n[0]).join("")}</div>
        </div>
    );
}
function ScrollArea({ children, className }) {
    return <div className={`scroll-area ${className}`}>{children}</div>;
}  