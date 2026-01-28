// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrOSPKkQ0ZtImgiju7LObOSHnj-obdwgo",
  authDomain: "rememberme-davidgao.firebaseapp.com",
  projectId: "rememberme-davidgao",
  storageBucket: "rememberme-davidgao.firebasestorage.app",
  messagingSenderId: "670013921137",
  appId: "1:670013921137:web:d21791dd18ce563c7788d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
