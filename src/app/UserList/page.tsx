'use client'

import React, { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { FaEllipsisH } from "react-icons/fa";
import { HiOutlineBookmark, HiOutlineHeart, HiOutlineShare } from "react-icons/hi";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";

interface User {
  id: string;
  name: string;
  imageUrl?: string;
  // Add other fields as needed
}

const PostList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // const fetchUsers = async () => {
    //   try {
    //     const usersRef = collection(db, "users");
    //     const querySnapshot = await getDocs(usersRef);
    //     const data = querySnapshot.docs.map((doc) => doc.data() as User);
    //     setUsers(data);
    //   } catch (err) {
    //     console.error("Error fetching users: ", err);
    //   }
    // };

    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const updatedUsers = snapshot.docs.map((doc) => doc.data() as User);
      setUsers(updatedUsers);
    });

    // fetchUsers();

    return () => unsubscribe();
  }, []);

  console.log("users", users);

  return (
    <>
      <div className="userWrapper">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="header">
              <div className="left">
                {user.imageUrl && (
                  <img src={user.imageUrl} alt="User Profile" className="profileImg" />
                )}
                <div className="userDetails">
                  <div className="name">{user.name}</div>
                </div>
              </div>
              <div className="right">
                <div className="option">
                  <FaEllipsisH />
                </div>
              </div>
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