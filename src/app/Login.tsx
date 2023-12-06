import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./config/firebase";
import { getDocs, query, collection, where } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import Link from "next/link";

function Login(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
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
    <div className={"container"}>
      <div className={"formContainer"}>
        <h2 className={"title"}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={"inputField"}>
            <label htmlFor="email" className={"inputLabel"}>Email:</label>
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
            <label htmlFor="password" className={"inputLabel"}>Password:</label>
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
          {error && <span className={error}>{error}</span>}
          <div className={"btnContainer"}>
            <button type="submit" className={"submitBtn"}>Login</button>

          </div>

        </form>
        <div>
        <Link href='/Signup'>Don't have an account! Signup here.</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;