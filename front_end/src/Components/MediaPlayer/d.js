[
    {
        "_id": "<PostID>",
        "title": "<Post Title>",
        "content": "<Post Content>",
        "author": {
            "_id": "<AuthorProfileID>",
            "owner": "<OwnerID>",
            "account": {
                "_id": "<UserID>",
                "avatar": "<AvatarURL>",
                "email": "<UserEmail>",
                "username": "<Username>"
            }
        },
        "comments": [
            {
                "_id": "<CommentID>",
                "content": "<Comment Content>",
                "author": {
                    "_id": "<CommentAuthorID>",
                    "username": "<CommentAuthorUsername>"
                },
                "createdAt": "<CommentCreatedAt>"
            }
        ],
        "likes": [
            {
                "_id": "<LikeID>",
                "likedBy": "<UserID>"
            }
        ],
        "isLiked": true,
        "isBookmarked": false,
        "likesCount": 10,
        "commentsCount": 5
    },
 
]
