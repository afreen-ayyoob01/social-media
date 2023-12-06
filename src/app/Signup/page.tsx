"use client"
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { Auth } from "./Components/AuthContext";
import { db, auth } from "../config/firebase";


function SignUp(): JSX.Element {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNo, setMobileNo] = useState<number>(0);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState("");

  const usersCollectionRef = collection(db, "users");

  const getUsers = async (): Promise<void> => {
    try {
      const data = await getDocs(usersCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUsers(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const onSubmitSignup = async (): Promise<void> => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      let imageUrl = "";
      if (image) {
        const storageRef = ref(getStorage(), `images/${user?.uid}/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(usersCollectionRef, {
        name: name,
        email: email,
        password: password,
        dateOfBirth: dateOfBirth,
        address: address,
        mobileNo: mobileNo,
        userId: user?.uid,
        imageUrl: imageUrl,
      });

      getUsers();

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      console.error(err);
    }
   
  };

  

//   const handleLogin = () => {
    
//   };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file);
  };

  return (
    <div data-testid="sign-up-form" className="register-container">
      <div className="form-container">
        <h1 className="register">Register Here!</h1>
        <div>
          <div className="input-field">
            <label className="input-label" htmlFor="name">
              Name:
            </label>
            <input
              className="input-area"
              id="name"
              type="text"
              placeholder="Enter your name"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="input-label" htmlFor="image">
              Image:
            </label>
            <input
              className="input-area"
              id="image"
              type="file"
              required
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div>
            <label className="input-label" htmlFor="email">
              Email:
            </label>
            <input
              className="input-area"
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={handleEmailChange}
            />
            {/* {emailError && <span={error}>{emailError}</span>} */}
          </div>
          <div>
            <label className="input-label" htmlFor="password">
              Password:
            </label>
      
            <input
              className="input-area"
              id="password"
              type="password"
              required
              placeholder="Enter your password"
              onChange={handlePasswordChange}
            />
            {passwordError && <span>{passwordError}</span>}
          </div>
          <div>
            <label className="input-label" htmlFor="confirmPassword">
              Confirm Password:
            </label>
            <input
              className="input-area"
              id="confirmPassword"
              type="password"
              required
              placeholder="Confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="input-label" htmlFor="dateOfBirth">
              Date of Birth:
            </label>
            <input
              className="input-area"
              id="dateOfBirth"
              type="date"
              required
              placeholder="Date of Birth"
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
          <div>
            <label className="input-label" htmlFor="address">
              Address:
            </label>
            <input
              className="input-area"
              id="address"
              required
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="input-label" htmlFor="mobileNo">
              Mobile No:
            </label>
            <input
              className="input-area"
              id="mobileNo"
              type="tel"
              required
              placeholder="Mobile No"
              onChange={(e) => setMobileNo(parseInt(e.target.value))}
            />
          </div>
          <div className="btn-container">
            <button onClick={onSubmitSignup} className="register-btn">
              Sign Up
            </button>
          </div>
       
        </div>
      </div>
      <ToastContainer />
     
    </div>
  );
}

export default SignUp;