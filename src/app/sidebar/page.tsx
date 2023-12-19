"use client";

import React, { useEffect, useState } from "react";
import { MdSettings } from "react-icons/md";
import {
  FaBell,
  FaBookmark,
  FaBrush,
  FaCompass,
  FaEnvelope,
  FaHome,
} from "react-icons/fa";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";

import { db } from "../config/firebase";

interface LinkItem {
  name: string;
  icon: JSX.Element;
}

export interface User {
  name: string;
  username: string;
  profilePic: string;
  storyImage: string;
  postImg: string;
}

const links: LinkItem[] = [
  {
    name: "Home",
    icon: <FaHome />,
  },
  {
    name: "Explore",
    icon: <FaCompass />,
  },
  {
    name: "Notifications",
    icon: <FaBell />,
  },
  {
    name: "Messages",
    icon: <FaEnvelope />,
  },
  {
    name: "Bookmarks",
    icon: <FaBookmark />,
  },
  {
    name: "Theme",
    icon: <FaBrush />,
  },
  {
    name: "Settings",
    icon: <MdSettings />,
  },
];

const Sidebar: React.FC = () => {
  let currentUserId: string | null;

  if (typeof window !== "undefined") {
    currentUserId = sessionStorage.getItem("userId");
  }

  const storedName = sessionStorage.getItem("name");
  const storedUserImage = sessionStorage.getItem("userImage");
  console.log("Stored name:", storedName);
  console.log("Stored image:", storedUserImage);
  // const [userData, setUserData] = useState<User[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "user"));
  //       const usersData = querySnapshot.docs.map((doc) => doc.data() as User);
  //       console.log("useeffect hook in sidebar");
  //       console.log(usersData);
  //       setUserData(usersData);
  //     } catch (error) {
  //       console.error("Error fetching data from Firestore:", error);
  //     }
  //   };

  //   fetchData();
  // }, [db]);

  return (
    <div className="leftSection">
      <div className="userProfileWidget">
        <div className="profileImage">
          {/* Loop through the fetched user data */}
          {/* {userData.map((user, index) => (
            <div className="profileWrapper" key={index}>
              <img
                src={user.profilePic || "/assets/image/profile-logo.png"}
                alt="User Profile Pic"
              />
            </div>
          ))} */}

          <div className="profileWrapper">
            {storedUserImage && (
              <img src={storedUserImage} alt="User Profile" />
            )}
            {/* <div className="profileData">
                    <div className="name">{storedName && <p>{storedName}</p>}</div>
                    <span className="seeProfile">See Profile</span>
                  </div> */}
          </div>
        </div>
        <div className="userDetails">
          <Link href={"/Profile"}
          className="profileLink"
          passHref>
            {/* {userData.map((user, index) => (
              <div className="profileData" key={index}>
                <div className="name">{user.name}</div>
              </div>
            ))} */}
            <div className="profileData">
              <div className="name">{storedName && <p className="para">{storedName}</p>}</div>
              {/* <span className="seeProfile">See Profile</span> */}
            </div>
          </Link>
          {/* {userData.map((user, index) => (
            <div className="username" key={index}>
              {user.username}
            </div>
          ))} */}
        </div>
      </div>

      <div className="inSidebar">
        {links.map((link, index) => (
          <div className="link" key={index}>
            <div className="icon">{link.icon}</div>
            <h3>{link.name}</h3>
          </div>
        ))}

        {/* <label htmlFor="createNewPost" className="inBtn sidebarCreateBtn">
          Create Post
        </label> */}
      </div>

      <label htmlFor="createNewPost" className="inBtn sidebarCreateBtn">
        Create Post
      </label>
    </div>
  );
};

export default Sidebar;
