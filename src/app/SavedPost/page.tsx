"use client"

import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";

interface SavedPost {
  postId: string;
  image: string | null;
  text:string;
  friendName: string;
  commentName: string;
}

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "savedPosts"));
      const savedPostsData: SavedPost[] = [];

      querySnapshot.forEach((doc) => {
        savedPostsData.push(doc.data() as SavedPost);
      });

      setSavedPosts(savedPostsData);
    } catch (err) {
      console.error("Error fetching saved posts: ", err);
    }
  };

  const renderImage = (image: string | null) => {
    if (image) {
      return <img src={image} alt="Post Image" className="saved-posts-image"/>;
    }
    return null;
  };

  return (
    <div className="saved-posts-container">
      <h1 className="saved-posts-title">Saved Posts</h1>
      {savedPosts.map((post) => (
        <div key={post.postId} className="saved-post-card">
          <h3>Friend: {post.friendName}</h3>
          <p>Saved by: {post.commentName}</p>
          <p>{post.text}</p>
          <div className="saved-posts-image-container">
          {renderImage(post.image)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedPosts;