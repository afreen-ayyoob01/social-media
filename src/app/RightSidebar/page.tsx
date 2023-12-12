'use client'
import React, { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

interface User {
  id: string;
  name: string;
  imageUrl?: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const updatedUsers = snapshot.docs.map((doc) => doc.data() as User);
      setUsers(updatedUsers);
    });


    return () => unsubscribe();
  }, []);

  console.log("users", users);

  return (
    <>
      <div className="RightSide">
        <h2 className="usersHeading">Users</h2>
        {users.map((user) => (
          <div key={user.id} className="RightSide-card">
            <div className="Right-image">
              {user.imageUrl && (
                <img src={user.imageUrl} alt="User Profile" className="profileImg" />
              )}
              <div className="Right-userDetails">
                <p className="Right-name">{user.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserList;