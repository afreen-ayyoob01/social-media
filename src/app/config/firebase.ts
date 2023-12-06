import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAI2t4y6729FEMPVpFOLUtEXl3auSjJb7g",
  authDomain: "jsnext-17e63.firebaseapp.com",
  projectId: "jsnext-17e63",
  storageBucket: "jsnext-17e63.appspot.com",
  messagingSenderId: "426621383541",
  appId: "1:426621383541:web:5fd7a7081d9928d6e2993c"
};


const app = initializeApp(firebaseConfig);

export const auth=getAuth(app)
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);