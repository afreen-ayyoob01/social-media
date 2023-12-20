"use client";

import React, { useRef, useState } from "react";
import { GrGallery } from "react-icons/gr";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase";
import { getFirestore, DocumentReference } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import PostList from "../post";
import Sidebar from "../sidebar/page";
import Header from "../header/page";
import RootLayout from "../layout";
import { useClickOutside } from "../useOutsideClick";
import RightSidebar from "../RightSidebar/page";

const Card: React.FC = () => {

  // console.log("cardpostcbfvhkfehvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [isFocused, setIsFocused] = useState(false);
  const reff = useRef(null);
  useClickOutside(reff, () => setIsFocused(false));


  // const [isCreatePostActive, setIsCreatePostActive] = useState<boolean>(false);

  // const activateCreatePost = () => {
  //   setIsCreatePostActive(true);
  // };


  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    const { native } = emoji;
    setInput(input + native);
    setShowEmojis(false);
  };

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    setInput(date ? input + date.toLocaleDateString() : input);
    setShowCalendar(false);
  };

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
  };

  const handleButtonClick = async () => {
    const id = sessionStorage.getItem("userId");
    const name = sessionStorage.getItem("name");
    let userImag = sessionStorage.getItem("userImage");

    // const userDocRef = doc(db, `users/${id}`);
    //   const userDocSnap = await getDoc(userDocRef);


    try {
      let image = null;
      let userImage = null;

      const userDocRef = doc(db, `users/${id}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        // console.log("sxsdsssssssssssssssssssssssssssssss00000000000000000",userDocSnap)


        if (userData.userImage) {
          userImage = userData.userImage;
        }
      }

      if (selectedImage) {
        const storageRef = ref(storage, `images/${id}/${selectedImage.name}`);
        const snapshot = await uploadBytes(storageRef, selectedImage);
        image = await getDownloadURL(snapshot.ref);
      }

      const docRef = await addDoc(collection(db, "posts"), {
        userId: id,
        name: name,
        text: input,
        image: image,
        userImage: userImag,
        timestamp: serverTimestamp(),
      });

      console.log("Post created with ID: ", docRef.id);

      setInput("");
      setSelectedImage(null);
      console.log("userimage", userImage);
      console.log("post image", image);
    } catch (err) {
      console.error("Error creating post: ", err);
    }
  };

  // console.log("xshgggggggggggggggggggggggggggggggggxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")

  return (
    <div className="dashboard">
      <div className="headerContainer">
        <Header />
      </div>
      <div className="mainContainer">

        <div className="leftSidebarContainer">
          <Sidebar />
        </div>


        <div className="mainSection">
          <div
            ref={reff}
            className={`createPostWidget ${isFocused ? "active" : ""}`}
          >
            <div className="createInput">
              <textarea
                rows={2}
                className="textarea"
                placeholder="What's Happening?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                id="createNewPost"
                onFocus={() => setIsFocused(true)}
              />
              <label htmlFor="file-input" className="file-input-label">
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    className="selected-image"
                  />
                ) : null}
              </label>
              <div className="button-icon">
                <GrGallery
                  // style={{ color: "green" }}
                  className="gallery-icon"
                  onClick={handleImageUpload}
                />
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileInputChange}
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
                <MdOutlineEmojiEmotions
                  className="emoji-icon"
                  onClick={() => setShowEmojis(!showEmojis)}
                />
                <IoCalendarNumberOutline
                  className="calendar-icon"
                  onClick={handleCalendarToggle}
                />
                <HiOutlineLocationMarker className="location-icon" />

                <button
                  className="inBtn"
                  disabled={!input.trim() && !selectedImage}
                  onClick={handleButtonClick}
                >
                  Post
                </button>
              </div>
            </div>
            {showEmojis && (
              <div>
                <Picker
                  onEmojiSelect={handleEmojiSelect}
                  data={data}
                  theme="light"
                />
              </div>
            )}
            {showCalendar && (
              <div className="calendar-container">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateSelect}
                  inline
                />
              </div>
            )}
          </div>

          <div className="postContainer">
            <PostList />
          </div>
        </div>
        <div className="rightSidebarContainer">
          <RightSidebar />
        </div>

      </div>
    </div>
  );
};

export default Card;
