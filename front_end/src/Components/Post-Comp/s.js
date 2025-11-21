const Posts = () => {

    const { GetPosts, posts, setPostToEdit, loadPost, HandleLike, fetchComment, loadComt, commentList, createComment, setCommentList } = useContext(PostContext);
    const [showComment, setShowComment] = useState({}); // Initialize as an object
    const { setIsModalOpen } = useContext(UserContext);
    const currProfiler = JSON.parse(localStorage.getItem('CurrProfiler'));
    const [content, setContent] = useState("");

    const handleSubmit = (data) => {
        setPostToEdit(data)
        setIsModalOpen(true)
    }

    useEffect(() => {
        GetPosts();
    }, []);

    const toggleComment = (postId) => {

        if (!showComment[postId]) {
            setShowComment({})
            setCommentList([])
            fetchComment(postId)
        }
        setShowComment((prevState) => ({ ...prevState, [postId]: !prevState[postId] }))

    }



    const submitComment = (id, content) => {
        createComment(id, content)
        setContent('')
    }







    return (
        <>
            {
                loadPost ?
                    posts.map((post) => {
                        const isMultiMedia = post.media && post.media.length > 2; // Check if more than 2 media items

                        return (
                            <div key={post.id} className="video-post-container">
                                <div className="video-post-header">
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <div className="post-header">
                                            <img src={post?.user?.avatar || img02

                                            } className='avatar' style={{ width: "45px", height: "45px", marginRight: "12px", marginTop: "5px" }} />
                                            <div className="sub-header">
                                                <h3>{post?.user?.username} </h3>
                                                <p className="subtext">Web Developer at Webestica • 2hr</p>
                                            </div>
                                        </div>

                                        {post?.user?._id == currProfiler?._id
                                            ?
                                            <p className="more-button" onClick={() => handleSubmit(post)} ><PiDotsThreeOutlineVerticalFill /> </p>
                                            :
                                            <></>

                                        }


                                    </div>
                                    <p style={{ paddingLeft: "5px", lineHeight: "20px", marginTop: "15px", marginLeft: "5px" }} className='jump'>
                                        {post?.content}
                                    </p>
                                </div>

                                <div className={`video-container ${isMultiMedia ? 'multi-media' : 'single-media'}`}>
                                    {post.media && post.media.length > 0 && post.media.map((media, index) => {
                                        const isImage = media.endsWith('.png') || media.endsWith('.jpg') || media.endsWith('.jpeg') || media.endsWith('.gif');
                                        const isVideo = media.endsWith('.mp4');

                                        if (isImage) {
                                            return (
                                                <img
                                                    key={index}
                                                    src={media}
                                                    alt={`Media ${index}`}
                                                    className="post-img"
                                                    style={{
                                                        padding: "1px",
                                                        backgroundColor: "#f0f0f0",
                                                        objectFit: "cover"
                                                    }}
                                                />
                                            );
                                        }

                                        if (isVideo) {
                                            return (
                                                <video
                                                    className="post-img"
                                                    key={index}
                                                    controls
                                                    width="100%"
                                                    style={{
                                                        padding: "1px",
                                                        backgroundColor: "#f0f0f0",
                                                        objectFit: "cover"
                                                    }}
                                                >
                                                    <source src={media} type="video/mp4" />

                                                </video>
                                            );
                                        }

                                        return null; // In case the media is neither an image nor a video
                                    })}
                                </div>

                                <div className="post-footer">
                                    <button className="like-btn" onClick={() => HandleLike(post._id)}>
                                        {post?.isLiked ?
                                            <>
                                                <IoIosHeart className='red'
                                                /> <span>Like</span>
                                                {post?.likeCount > 0 && (
                                                    <span style={{ color: "grey" }}> ({post?.likeCount})</span>
                                                )}
                                            </>
                                            :
                                            <>
                                                <IoIosHeartEmpty className='nom'
                                                />
                                                <span>Like</span>
                                                {post?.likeCount > 0 && (
                                                    <span > ({post?.likeCount})</span>
                                                )}
                                            </>
                                        }
                                    </button>

                                    <button className="comment-btn" onClick={() => toggleComment(post._id)}>
                                        <span>Comments</span>
                                    </button>
                                    <button className="share-btn">
                                        <IoMdShareAlt style={{ color: "lightgrey" }} /><span>Share</span>
                                    </button>
                                </div>

                                {showComment[post._id] && (
                                    <>
                                        <div className="input-section" style={{ width: "90%", margin: "0 auto", marginBottom: "0", marginTop: "10px" }}>
                                            <div className="avatar" style={{ marginRight: "15px" }}>
                                                <img src={pf} alt="User" className="avatar-image02" />
                                            </div>
                                            <input
                                                type="text"
                                                className="post-input"
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder="Share your thoughts..."
                                                style={{ border: "1px solid lightgrey", marginRight: "20px", marginLeft: "0", borderRadius: "10px", height: "35px" }}

                                            />
                                            <IoMdSend className='send' onClick={() => submitComment(post._id, content)} />
                                        </div>
                                        <div className='c-section' style={{ margin: "0", padding: "0" }}>
                                            <div className="com-list">
                                                {loadComt &&   <p style={{ textAlign: "center", padding: "15px", color: "grey", marginLeft: "0", marginRight: "0" }}>  <FontAwesomeIcon icon={faCircleNotch}  spin /></p>} 
                                                {commentList.length === 0 && !loadComt && <p  style={{ textAlign: "center", padding: "15px", color: "grey", marginLeft: "0", marginRight: "0" }}>( No comments available )</p>}
                                                {


                                                    commentList?.map((comment) => {
                                                        const formattedDate = new Date(comment?.createdAt).toISOString().split('T')[0];
                                                        const currProfiler = JSON.parse(localStorage.getItem('CurrProfiler'));
                                                        const showDelete = comment?.user?._id === currProfiler?._id;




                                                        return (
                                                            <>
                                                                <div className='comment'>
                                                                    <img src={comment?.user?.avatar} alt="Profile" />
                                                                    <div className='comt'>


                                                                        <p>
                                                                            {comment?.user?.username} •
                                                                            <span style={{ fontSize: "12px", color: "grey", marginLeft: "3px", fontWeight: "light" }}>
                                                                                {formattedDate}
                                                                            </span>
                                                                        </p>
                                                                        <h3>{comment?.content}</h3>



                                                                    </div>
                                                                    {showDelete &&
                                                                        <p style={{ alignSelf: "center", color: "grey" }} className='del02'
                                                                        ><AiOutlineDelete />
                                                                        </p>}
                                                                </div>


                                                            </>



                                                        )
                                                    }

                                                    )

                                                }
                                            </div>
                                        </div>
                                    </>
                                )}


                            </div>
                        );
                    })
                    :
                    (<>
                        <div className="video-post-container">
                            <div className="video-post-header">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div className="post-header">
                                        <Skeleton animation="wave" variant="circular" width={45} height={45} />
                                        <div className="sub-header" style={{ marginLeft: "10px" }}>
                                            <Skeleton
                                                animation="wave"
                                                height={15}
                                                width={80}
                                                style={{ marginBottom: 6 }}
                                            />
                                            <Skeleton animation="wave" height={15} width={140} />
                                        </div>
                                    </div>

                                    <p className="more-button"
                                    ><PiDotsThreeOutlineVerticalFill /> </p>
                                </div>
                                <p style={{ paddingLeft: "5px", lineHeight: "20px", marginTop: "15px", marginLeft: "5px" }} className='jump'>
                                    <Skeleton animation="wave" height={18} style={{ marginBottom: 6 }} />
                                    <Skeleton animation="wave" height={18} />
                                </p>
                            </div>

                            <div className={`video-container single-media'}`}>
                                <div className='post-img'>
                                    <Skeleton sx={{ height: 390 }} animation="wave" variant="rectangular" />
                                </div>
                            </div>

                            <div className="post-footer">
                                <button className="like-btn">
                                    <IoIosHeartEmpty /> <span>Likes</span>
                                </button>
                                <button className="comment-btn" >
                                    <span>Comments</span>
                                </button>
                                <button className="share-btn">
                                    <IoMdShareAlt style={{ color: "lightgrey" }} /><span>Share</span>
                                </button>
                            </div>


                        </div>
                        <div className="video-post-container">
                            <div className="video-post-header">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div className="post-header">
                                        <Skeleton animation="wave" variant="circular" width={45} height={45} />
                                        <div className="sub-header" style={{ marginLeft: "10px" }}>
                                            <Skeleton
                                                animation="wave"
                                                height={15}
                                                width={80}
                                                style={{ marginBottom: 6 }}
                                            />
                                            <Skeleton animation="wave" height={15} width={140} />
                                        </div>
                                    </div>

                                    <p className="more-button"
                                    ><PiDotsThreeOutlineVerticalFill /> </p>
                                </div>
                                <p style={{ paddingLeft: "5px", lineHeight: "20px", marginTop: "15px", marginLeft: "5px" }} className='jump'>
                                    <Skeleton animation="wave" height={18} style={{ marginBottom: 6 }} />
                                    <Skeleton animation="wave" height={18} />
                                </p>
                            </div>

                            <div className={`video-container single-media'}`}>
                                <div className='post-img'>
                                    <Skeleton sx={{ height: 390 }} animation="wave" variant="rectangular" />
                                </div>
                            </div>

                            <div className="post-footer">
                                <button className="like-btn">
                                    <IoIosHeartEmpty /> <span>Likes</span>
                                </button>
                                <button className="comment-btn" >
                                    <span>Comments</span>
                                </button>
                                <button className="share-btn">
                                    <IoMdShareAlt style={{ color: "lightgrey" }} /><span>Share</span>
                                </button>
                            </div>


                        </div>
                        <div className="video-post-container">
                            <div className="video-post-header">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div className="post-header">
                                        <Skeleton animation="wave" variant="circular" width={45} height={45} />
                                        <div className="sub-header" style={{ marginLeft: "10px" }}>
                                            <Skeleton
                                                animation="wave"
                                                height={15}
                                                width={80}
                                                style={{ marginBottom: 6 }}
                                            />
                                            <Skeleton animation="wave" height={15} width={140} />
                                        </div>
                                    </div>

                                    <p className="more-button"
                                    ><PiDotsThreeOutlineVerticalFill /> </p>
                                </div>
                                <p style={{ paddingLeft: "5px", lineHeight: "20px", marginTop: "15px", marginLeft: "5px" }} className='jump'>
                                    <Skeleton animation="wave" height={18} style={{ marginBottom: 6 }} />
                                    <Skeleton animation="wave" height={18} />
                                </p>
                            </div>

                            <div className={`video-container single-media'}`}>
                                <div className='post-img'>
                                    <Skeleton sx={{ height: 390 }} animation="wave" variant="rectangular" />
                                </div>
                            </div>

                            <div className="post-footer">
                                <button className="like-btn">
                                    <IoIosHeartEmpty /> <span>Likes</span>
                                </button>
                                <button className="comment-btn" >
                                    <span>Comments</span>
                                </button>
                                <button className="share-btn">
                                    <IoMdShareAlt style={{ color: "lightgrey" }} /><span>Share</span>
                                </button>
                            </div>


                        </div>
                    </>
                    )

            }
        </>
    );
};

export default Posts;