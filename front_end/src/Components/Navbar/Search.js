import React from "react";
import { FaTimes } from "react-icons/fa"; // Using react-icons for the X button
import img02 from "../../Assets/img02.png"; // Importing the image
import { useContext } from "react"; // Importing the useContext hook
import { StoryContext } from "../../Context/StoryContext"; // Importing the StoryContext
import { PostContext } from "../../Context/PostContext";
import "./Search.css";
// Data
const users = [
  { name: "John Doe", username: "johndoe" },
  { name: "Jane Smith", username: "janesmith" },
  { name: "Bob Johnson", username: "bobjohnson" },
];

const posts = [
  {
    title: "Introduction to Next.js",
    description: "Learn the basics of Next.js and how to build fast web applications.",
    author: "John Doe",
  },
  {
    title: "Mastering Tailwind CSS",
    description: "Discover advanced techniques for using Tailwind CSS in your projects.",
    author: "Jane Smith",
  },
  {
    title: "Server Components in React",
    description: "Explore the power of server components and how they improve performance.",
    author: "Bob Johnson",
  },
];
const truncateWords = (text = "", limit = 30) => {
  const words = text.split(/\s+/);
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") + "...";
};

export default function SearchResults() {
  const { search, setSearch } = useContext(StoryContext);
  const { query, setQuery, filteredData } = useContext(PostContext);


  return (
    <div>
      {query && (
        <div className="card09">
          <div className="header06">
            <h2>Search Results</h2>

          </div>
          <div className="content001">
            <div className="section">
              <h3>Users</h3>
              <div className="list">
                {
                  filteredData?.users && filteredData?.users.length > 0
                    ? filteredData?.users.map((user) => (
                      <div key={user?.username} className="list-item">
                        <img src={user?.avatar || img02} alt="avatar" className="avatar03" />
                        <div>
                          <p className="user-name03">{user?.username}</p>
                          <div className="username">Employee</div>
                        </div>
                      </div>
                    ))
                    : <p style={{ color: "grey" }}>No users found</p>
                }
              </div>
            </div>

            <div className="section">
              <h3>Posts</h3>
              <div className="list">
                {
                  filteredData?.posts && filteredData?.posts.length > 0
                    ? filteredData?.posts.map((post) => (
                      <div key={post?.title} className="list-items">
                        <div style={{ minWidth: "80%" }}>
                          <p className="post-description">{truncateWords(post?.content,20)}</p>
                          <p className="post-author">
                            <span style={{ color: "#888" }}>By</span> User
                          </p>
                        </div>

                        {/* Check if post?.media exists and has at least one item */}
                        <img
                          src={post?.media && post?.media.length > 0 ? post?.media[0] : img02}
                          alt="post"
                          className="Simage"
                        />
                      </div>
                    ))
                    : <p style={{ color: "grey" }}>No posts found</p>
                }
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}