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

// interface SidebarProps {
//   activateCreatePost: () => void;
// }

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

const Sidebar: React.FC= () => {
  const [storedUserImage, setStoredUserImage] = useState<string | null>(null);
  const [storedName, setStoredName] = useState<string | null>(null);
 

  useEffect(() => {
    let currentUserId: string | null = null;

    if (typeof window !== "undefined") {
      currentUserId = sessionStorage.getItem("userId");
    }
    setStoredUserImage(sessionStorage.getItem("userImage"));
    setStoredName(sessionStorage.getItem("name"));

    const storedName = sessionStorage.getItem("name");
    const storedUserImage = sessionStorage.getItem("userImage");

    console.log("Stored name:", storedName);
    console.log("Stored image:", storedUserImage);
  }, []);


  


  return (
    <div className="leftSection">
      <div className="userProfileWidget">
        <div className="profileImage">
          <div className="profileWrapper">
            {storedUserImage && (
              <img src={storedUserImage} alt="User Profile" />
            )}
          </div>
        </div>
        <div className="userDetails">
          <Link href={"/Profile"} className="profileLink" passHref>
            <div className="profileData">
              <div className="name">
                {storedName && <p className="para">{storedName}</p>}
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="inSidebar">
        {links.map((link, index) => (
          <div className="link" key={index}>
            <div className="icon">{link.icon}</div>
            <h3>{link.name}</h3>
          </div>
        ))}
      </div>

      <label htmlFor="createNewPost" className="inBtn sidebarCreateBtn"  >
        Create Post
      </label>
    </div>
  );
};

export default Sidebar;
