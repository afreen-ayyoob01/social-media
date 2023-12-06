import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './config/firebase';

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
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const data = querySnapshot.docs.map((doc) => doc.data() as Post);
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts: ', err);
      }
    };

    fetchPosts();
  }, []);

  console.log('posts', posts);

  return (
    <div>
      {/* Render the posts */}
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <h3>{post.name}</h3>
          <p>{post.text}</p>
          {post.image && <img src={post.image} alt="Post Image" />}
          {post.userImage && <img src={post.userImage} alt="User Image" />}
          {/* Render other post data */}
        </div>
      ))}
    </div>
  );
};

export default PostList;