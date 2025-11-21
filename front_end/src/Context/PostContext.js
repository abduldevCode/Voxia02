
import React, { createContext, useEffect, useState } from 'react';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {

    const [posts, setPosts] = useState([]);
    const currProfiler = JSON.parse(localStorage.getItem('CurrProfiler'));
    const [postToEdit, setPostToEdit] = useState(null)
    const [loadPost, setLoadPost] = useState(true)
    const [loadComt, setLoadComt] = useState(false); // To track loading state
    const [userPosts,setUserPost]=useState([])
/*
    const GetPosts = async () => {
        const token = localStorage.getItem('authToken');
        setLoadPost(false)
        try {
            const response = await fetch("http://localhost:8000/api/v1/users/getPosts", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("posts are ", data.data)
                setLoadPost(true)
                setPosts(data.data)

            }

        } catch (error) {
            console.error("Error fetching Posts: ", error);
        }
    };*/


    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [displayMedia, setDisplayMedia] = useState([]);
  


    const GetPosts = async (pageNum = 1, limit = 3) => {
        const token = localStorage.getItem('authToken');
        
        if (pageNum === 1) {
            setLoadPost(false);
        }
        
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/getPosts?page=${pageNum}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`Page ${pageNum} posts:`, data.data);
                
                if (pageNum === 1) {
                    // Replace all posts if it's the first page
                    setPosts(data.data);
                } else {
                    // Append posts if loading more pages
                    setPosts(prevPosts => [...prevPosts, ...data.data]);
                }
                
                setLoadPost(true);
                return {
                    data: data.data,
                    hasMore: data.hasMore || false,
                    page: pageNum
                };
            } else {
                console.error("Failed to fetch posts");
                setLoadPost(true);
                return { data: [], hasMore: false };
            }
        } catch (error) {
            console.error("Error fetching Posts: ", error);
            setLoadPost(true);
            return { data: [], hasMore: false };
        }
    };

    const GetUserPosts = async (userId) => {
        const token = localStorage.getItem('authToken');
        setLoadPost(false)
        try {
            const response = await fetch("http://localhost:8000/api/v1/users//userPosts", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
                ,body: JSON.stringify({ userId })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("specific user posts are ", data)
                setLoadPost(true)
                setUserPost(data.data)

            }

        } catch (error) {
            console.error("Error fetching Posts: ", error);
        }
    };

    const HandlePost = async (text, videos, images) => {

        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        if (text) {
            formData.append('content', text);
        }
        images?.forEach((image) => formData.append('image', image));
        videos?.forEach((video) => formData.append('video', video));

        for (let pair of formData.entries()) {
            console.log(pair[1]);
        }

        try {
            const response = await fetch("http://localhost:8000/api/v1/users/createPost", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (response.ok) {
                const data = await response.json();
                console.log("post create successfully ", data)
            }

        } catch (error) {
            console.error("error is", error)
        }

    };

    const deletPost = async (id) => {

        console.log("id", id)
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/DeletePost/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                setPosts((Posts) => Posts.filter((post) => post._id !== id))
                console.log("delete")
            }

        } catch (error) {
            console.error("error is ", error)
        }
    };


    const [commentList, setCommentList] = useState([])
    const [content, setContent] = useState("");

    const fetchComment = async (postId) => {
        console.log("comment")
        setLoadComt(true)
        // let find = setcommentlist.filter(commentlist[id]=>commentlist[id]===postid)

        // let find = setcommentlist.filter(commnetlist=>commentlist.posctid===postid)


        ///showComment(comment=>{...comment,[comment.id]:comment[comment.id]})
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/getComments`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ postId })
            })
            if (response.ok) {
                let data = await response.json();
              
                setCommentList(data.data)

                //approach#1
                //setcommentList({...commentlist,[data.id]:data.data})

                //approach#2
                //setcommentList(...commentlist,data.data)

                setLoadComt(false)
                console.log('comments are ', data)
            }

        } catch (error) {
            console.error("error is ", error)
            setLoadComt(false)
        }

    }

    const createComment = async (postId, comment) => {
    
        const token = localStorage.getItem('authToken');
        console.log("comment", comment);
        if(!comment || comment.trim() === ""){
            return
        }
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/CreateComment/${postId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: comment })  // Fixed: sending 'content' instead of 'comment'
            });
    
            if (response.ok) {
                let data = await response.json();
                setCommentList((comments) => [...comments, data.data]);
                
            } else {
                console.error('Error: ', response.statusText);
            }
        } catch (error) {
            console.error("Error is ", error);
        }
    };
    
    const deleteComment = async (commentId) => {
        const token = localStorage.getItem('authToken');
       console.log("id" ,commentId )
        try {
          const response = await fetch(`http://localhost:8000/api/v1/users/DeleteComment/${commentId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
      
          if (response.ok) {
            console.log("Comment deleted successfully");
      
            
            setCommentList((comments) => comments.filter((comment) => comment._id !== commentId));
            
          } else {
            console.error("Failed to delete comment:", response.statusText);
          }
        } catch (error) {
          console.error("Error deleting comment:", error);
        }
      };
      



    const HandleLike = async (postId) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/likePost`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ postId })
            })
            if (response.ok) {
                const data = await response.json();
                console.log("like")
                setPosts(Posts => Posts.map((post) =>
                    post._id === postId
                        ? (data?.data ? { ...post, isLiked: !post.isLiked, likeCount: post.likeCount + 1 } : { ...post, isLiked: !post.isLiked, likeCount: post.likeCount - 1 })
                        : post))

            }

        } catch (error) {
            console.error("error is ", error)
        }
    }


    const [query, setQuery] = useState("");
    const [filteredData, setFilteredData] = useState({});

    const searchQuery= async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/query?search=${query}`
                , {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },

                })
            if (response.ok) {
                const data = await response.json();
                setFilteredData(data)
                console.log("user is", data)
            }

        } catch (error) {
            console.error("error is ", error)
        }
    }
    
    useEffect(() => {
        if (query.trim() && !query.startsWith(' ')) {
            searchQuery(query);
        }
    }, [query]);   






 // State for the post detail screen
 const [isDetailOpen, setIsDetailOpen] = useState(false);
 const [selectedImageIndex, setSelectedImageIndex] = useState(0);
 const [selectedPost, setSelectedPost] = useState(null);

 // Function to handle image clicks and open the detail view
 const handleImageClick = (index, post) => {
   setSelectedImageIndex(index);
   setSelectedPost(post);
   setIsDetailOpen(true);
 };


    return (
        <PostContext.Provider value={{
            posts,
            setPosts,
            GetPosts,
            HandlePost,
            postToEdit,
            setPostToEdit,
            loadPost,
            deletPost,
            HandleLike,
            fetchComment,
            commentList,loadComt,deleteComment,
            createComment,setCommentList,userPosts,GetUserPosts,
            content, setContent,searchQuery,query, setQuery,filteredData, setFilteredData,
            text,setText,images,setImages,videos,setVideos,setDisplayMedia,displayMedia,
            isDetailOpen, setIsDetailOpen,selectedImageIndex, setSelectedImageIndex,handleImageClick,selectedPost, setSelectedPost
        }}>
            {children}
        </PostContext.Provider>
    );
};
