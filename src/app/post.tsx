import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  where,
  setDoc,
} from "firebase/firestore";
import { db } from "./config/firebase";
import { FaEllipsisH } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa6";
import { FiShare2 } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";

interface Post {
  id: string;
  postId?: string;
  name: string;
  text: string;
  commentName: string;
  image?: string;
  userImage?: string;
  comment: string;
  commentUserName: string;
  friendName?: string;
  commentNameImage?: string;
  bookmarked?: boolean;
  likes:number;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [textInput, setTextInput] = useState("");
  const [commentuserName, setcommentuserName] = useState("");
  const [comments, setComments] = useState<
    { postId: string; comment: string; commentName: string }[]
  >([]);
  const [savePost, setSavePost] = useState<
    { postId: string; comment: string; commentName: string }[]
  >([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, "posts");
        const querySnapshot = await getDocs(
          query(postsRef, orderBy("timestamp", "desc"))
        );
        const postData = querySnapshot.docs.map((doc) => {
          const post = doc.data() as Post;
          return { ...post, postId: doc.id,likes:0 };
        });
        setPosts(postData);

        const commentsSnapshot = await getDocs(collection(db, "comments"));
        const commentsData = commentsSnapshot.docs.map((doc) => {
          const comment = doc.data() as {
            postId: string;
            comment: string;
            commentName: string;
          };
          return { ...comment, commentId: doc.id };
        });
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching posts and comments: ", err);
      }
    };

    

    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        const updatedPosts = snapshot.docs.map((doc) => {
          const post = doc.data() as Post;
          return {
            ...post,
            postId: doc.id,
            commentName: commentUserName,
            friendName: post.name,
          };
        });
        setPosts(updatedPosts);
      }
    );

    fetchPosts();

    return () => unsubscribe();
  }, []);

  
  const handleBookmark = async (
    postId: string,
    image: string,
    commentName: string
  ) => {
    try {
      const postRef = doc(db, "posts", postId);
      await setDoc(postRef, { bookmarked: true, likes: 1 }, { merge: true });

      await addDoc(collection(db, "savedPosts"), {
        postId,
        image,
        commentName,
      });
    } catch (err) {
      console.error("Error saving bookmark: ", err);
    }
  };

  const commentUserName = sessionStorage.getItem("name");
  const commentUserImage = sessionStorage.getItem("userImage");


  const handleSubmit = async (postId: string, friendName: string) => {
    try {
      if (!commentUserName) {
        console.error("Error: commentUserName is undefined");
        return;
      }

      const newComment = {
        comment: textInput,
        postId: postId,
        commentName: commentUserName,
        friendName: friendName,
        commentNameImage: commentUserImage,
      };

      await addDoc(collection(db, "comments"), newComment);

      setTextInput("");
      setComments([
        ...comments,
        {
          postId: postId,
          comment: textInput,
          commentName: commentUserName,
        },
      ]);
    } catch (err) {
      console.error("Error saving comment: ", err);
    }
  };

  const toggleCommentBox = () => {
    setShowCommentBox((prevShowCommentBox) => !prevShowCommentBox);
  };

  
  const handleLike = async () => {
    try {
      const updatedLikeCount = liked ? likeCount - 1 : likeCount + 1;
      setLikeCount(updatedLikeCount);
      setLiked(!liked);

      const postRef = doc(db, "posts", postId!);
      await updateDoc(postRef, { likes: updatedLikeCount });
    } catch (err) {
      console.error("Error updating like: ", err);
    }
  };

  return (
    <>
      <div className="postWrapper">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="header">
              <div className="left-profile">
                {post.userImage && (
                  <img
                    src={post.userImage}
                    alt="User Profile"
                    className="profilepicture"
                  />
                )}
                <div className="name">
                  <h4>{post.name}</h4>
                  <span>{post.friendName}</span>
                </div>
              </div>
              <div className="right">
                <FaEllipsisH />
              </div>
            </div>
            <div className="post-content">
              <p>{post.text}</p>
              {post.image && (
                <img src={post.image} alt="Post" className="post-image" />
              )}
            </div>
            <div className="post-actions">
              <div className="left-icons">
                <div className="icons">
              <FaRegHeart />
              {/* <FaHeart /> */}
              </div>
              <div className="icons"> 
              <FaRegCommentDots 
                  onClick={toggleCommentBox}
                />
                </div>
                <div className="icons">
                <FiShare2 />
                </div>
              </div>
              <div className="right">
                {!post.bookmarked ? (
                  <FaRegBookmark
                    onClick={() =>
                      handleBookmark(post.postId, post.image, post.commentName)
                    }
                  />
                ) : (
                  <FaBookmark
                    className="bookmarked"
                    onClick={() =>
                      handleBookmark(post.postId, post.image, post.commentName)
                    }
                  />
                )}
              </div>
            </div>
            {showCommentBox && (
              <div className="comment-box">
                <div className="comment-box-header">
                  <h4>Comments</h4>
                  <button onClick={toggleCommentBox}><AiOutlineClose /></button>
                </div>
                <div className="comment-list">
                  {comments
                    .filter((comment) => comment.postId === post.postId)
                    .map((comment) => (
                      <div key={comment.commentId} className="comment-item">
                        {comment.commentNameImage && (
                          <img
                            src={comment.commentNameImage}
                            alt="Comment User Profile"
                            className="comment-profile-picture"
                          />
                        )}
                        <div className="comment-content">
                          <h5>{comment.commentName}</h5>
                          <p>{comment.comment}</p>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="comment-input">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                  />
                  <button
                    onClick={() => handleSubmit(post.postId, post.name)}
                    disabled={textInput === ""}
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default PostList;