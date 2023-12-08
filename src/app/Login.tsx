import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "./config/firebase";
import { getDocs, query, collection, where } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import Link from "next/link";

function Login(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleForgotPassword = async () => {
    setForgotPasswordError("");
    setForgotPasswordSuccess("");

    try {
      await sendPasswordResetEmail(auth, email);
      setForgotPasswordSuccess("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setForgotPasswordError("Failed to send password reset email. Please try again.");
    }
  };
 
  const fetchUserDetails = async (userId: string) => {
    try {
      const userSnapshot = await getDocs(
        query(collection(db, "users"), where("userId", "==", userId))
      );
 
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        console.log("userData", userData);
 
        const name = userData.name;
        const image = userData.imageUrl;
        console.log("name", name);
        console.log("image", image);
 
 
        sessionStorage.setItem("name", name);
       
     
        if (image) {
          sessionStorage.setItem("userImage", image);
        } else {
          console.log("Image is undefined or not present in userData");
        }
      } else {
        console.log("No user data found");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
 
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
 
      sessionStorage.setItem("userId", userCredential.user.uid);
      await fetchUserDetails(userCredential.user.uid);
 
      router.push('/Dashboard');
    } catch (err) {
      setError("Invalid email or password");
    }
  };
 
  useEffect(() => {
    const name = sessionStorage.getItem("name");
    const image = sessionStorage.getItem("userImage");
    console.log("Stored name:", name);
    console.log("Stored image:", image);
  }, []);
 
  return (
    <div className="container">
     <div className="logo-container">
        <div className="logo">
      <img src="assets/image/ss-logo-new.png" alt="Logo" />
      </div>
      </div>
      <div className="formContainer">
        <h2 className="title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={"inputField"}>
            {/* <label htmlFor="email" className={"inputLabel"}>Email:</label> */}
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={handleEmailChange}
              className={"inputArea"}
            />
          </div>
          <div className={"inputField"}>
            {/* <label htmlFor="password" className={"inputLabel"}>Password:</label> */}
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={handlePasswordChange}
              className={"inputArea"}
            />
          </div>

      
        {forgotPasswordError && <span className="error">{forgotPasswordError}</span>}
          {/* {forgotPasswordSuccess && <span className="success">{forgotPasswordSuccess}</span>} */}
          <div className="forgotPassword">
            {/* <span className="forgotPasswordText">Forgot your password?</span> */}
            <Link 
              className="forgotPasswordLink" href="/forgot-password">Forgot Password?
            </Link>
          </div>
          <div className="checkbox-inputField">
          <label htmlFor="rememberMe" className="checkbox-inputLabel">
            Remember me:
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="checkboxLabel input"
            />
          </label>
        </div>
          {error && <span className={error}>{error}</span>}
          <div className={"btnContainer"}>
            <button type="submit"
            className={"submitBtn"}
            // className="inBtn"
            >Login</button>
 
          </div>
 
        </form>
        <div>
        <Link className="Link-login" href='/Signup'>Doesn't have an account yet?</Link>
        <Link className="Signup-link" href='/Signup'>Signup.</Link>
        </div>
      </div>
    </div>
  );
}
 
export default Login;