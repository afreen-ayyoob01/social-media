import React, { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./config/firebase";
import { FaEllipsisH } from "react-icons/fa";
import { HiOutlineBookmark, HiOutlineHeart, HiOutlineShare } from "react-icons/hi";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";

interface Post {
  id: string;
  name: string;
  text: string;
  image?: string;
  userImage?: string;
  // Add other fields as needed
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);



  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, "posts");
        const querySnapshot = await getDocs(query(postsRef, orderBy("timestamp", "desc")));
        const data = querySnapshot.docs.map((doc) => doc.data() as Post);
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts: ", err);
      }
    };

    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")), // Updated query
      (snapshot) => {
        const updatedPosts = snapshot.docs.map((doc) => doc.data() as Post);
        setPosts(updatedPosts);
      }
    );


    fetchPosts();

    return () => unsubscribe();
  }, []);

  console.log("posts", posts);

  return (
    <>
      <div className="postWrapper">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="header">
              <div className="left">
                {post.userImage && (
                  <img src={post.userImage} alt="User Profile" className="profileImg" />
                )}
                <div className="userDetails">
                  <div className="name">{post.name}</div>
                
                </div>
              </div>
              <div className="right">
                <div className="option">
                  <FaEllipsisH />
                </div>
              </div>
            </div>
            <div className="mainPostContent">
              <p>{post.text}</p>
              {post.image && <img src={post.image} alt="Post Image" className="postImage" />}
              {/* {post.userImage && <img src={post.userImage} alt="User Image" />} */}
            </div>
            <div className="postFooter">
              <div className="postActions">
                <div className="left">
                  <div className="likeBtn">
                    <HiOutlineHeart />
                  </div>
                  <div className="commentBtn">
                    <HiOutlineChatBubbleOvalLeftEllipsis />
                  </div>
                  <div className="shareBtn">
                    <HiOutlineShare />
                  </div>
                </div>
                <div className="right">
                  <div className="saveBtn">
                    <HiOutlineBookmark />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PostList;