"use client";
import React, {
  FC,
  useEffect,
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
} from "react";
import { MdSearch, MdClose, MdSettings } from "react-icons/md";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import { FaFaceFrown } from "react-icons/fa6";
import { RiQuestionFill } from "react-icons/ri";

import { motion } from "framer-motion";

import Link from "next/link";
// import { db } from "../../../firebase";
import { db } from "../config/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useClickOutside } from "../useOutsideClick";

export interface User {
  userId: string;
  name: string;
  email: string;
  imageUrl: string;
}

export interface UserError {
  error: string;
}

const Header: FC = () => {
 

  const [ProfileMenu, setProfileMenu] = useState<boolean>(false);

  const profileMenuRef = useRef(null);
  useClickOutside(profileMenuRef, () => setProfileMenu(false));

  const [storedUserImage, setStoredUserImage] = useState<string | null>(null);
  const [storedName, setStoredName] = useState<string | null>(null);

  useEffect(() => {
  let currentUserId: string | null;

  if (typeof window !== "undefined") {
    currentUserId = sessionStorage.getItem("userId");
  }
  setStoredUserImage(sessionStorage.getItem('userImage') );
    setStoredName(sessionStorage.getItem('name'));

  const storedName = sessionStorage.getItem("name");
  const storedUserImage = sessionStorage.getItem("userImage");

  
  console.log("Stored name:", storedName);
  console.log("Stored image:", storedUserImage);
  
}, []);
 

  return (
    <>
      <div className="inNavbar">
        {/* <Link href={"/Dashbord"}> */}
        <img
          className="inLogo"
          src={"/assets/image/ss-logo-new.png"}
          alt="Logo"
        />
        {/* </Link> */}

        <div className="inNavRightOptions">
          <label className="inBtn" htmlFor="createNewPost">
            Create
          </label>
          <div className="userProfile" ref={profileMenuRef}>
            <div
              className="userImage"
              onClick={() => setProfileMenu(!ProfileMenu)}
            >
                {storedUserImage && (
                  <img src={storedUserImage || "/assets/image/profile-logo.png"} alt="User Profile" />
                )}
             
            </div>
            <motion.div
              className="userProfileDropdown"
              initial={{ y: 40, opacity: 0, pointerEvents: "none" }}
              animate={{
                y: !ProfileMenu ? -30 : [0, 30, 10],
                opacity: ProfileMenu ? 1 : 0,
                pointerEvents: ProfileMenu ? "auto" : "none",
                zIndex: 999999,
              }}
              transition={{ duration: 0.48 }}
            >
              <div className="profileWrapper">
                {storedUserImage && (
                  <img src={storedUserImage} alt="User Profile" />
                )}
                <div className="profileData">
                    <div className="name">{storedName && <p>{storedName}</p>}</div>
                    <span className="seeProfile">See Profile</span>
                  </div>
               
              </div>
              

              <div className="linksWrapper">
                <div className="link">
                  <div className="leftSide">
                    <span className="icon">
                      <MdSettings />
                    </span>
                    <span className="name">Settings & Privacy</span>
                  </div>
                  <span className="actionIcon">
                    <FaAngleRight />
                  </span>
                </div>
                <div className="link">
                  <div className="leftSide">
                    <span className="icon">
                      <RiQuestionFill />
                    </span>
                    <span className="name">Help & Support</span>
                  </div>
                  <span className="actionIcon">
                    <FaAngleRight />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
