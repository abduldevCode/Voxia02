import React, { createContext, useEffect, useState } from 'react';
export const StoryContext = createContext();

export const StoryProvider = ({ children }) => {

    const [Stories, setStories] = useState([]);
    const [userStory, setUserStory] = useState(null);
    const [search, setSearch] = useState("");
    const [loadSet, setLoadSet]=useState(true)

    const currProfiler = JSON.parse(localStorage.getItem('CurrProfiler'));

    const UserStory = (stories) => {
        const GetStory = stories.find((story) => story.user._id === currProfiler._id);
        setUserStory(GetStory)
        console.log("i am running")
    };

    const GetStories = async () => {
        setLoadSet(false)
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch("http://localhost:8000/api/v1/users/getStories", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();setLoadSet(true)
                console.log("stories are ", data)
                setStories(data.data);
                UserStory(data.data); 
            }

        } catch (error) {
            console.error("Error fetching stories: ", error);
        }
    };
    const deleteStory = async (id) => {
        console.log("delete", id);
    
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/deleteStory/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok){
                const data= await  response.json();
                const filtedStories = Stories.filter((story) => story.user._id !== currProfiler._id);
                setUserStory(null);
                setStories(filtedStories)
            }

        } catch (error) {
            console.error("error is ", error)
        }
    };  
      
    return (
        <StoryContext.Provider value={{
            GetStories,
            userStory,
            Stories,
            deleteStory ,
            setStories,
            setUserStory,
            search,
            setSearch,loadSet
        }}>
            {children}
        </StoryContext.Provider>
    );
};
