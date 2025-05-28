// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-U-IWi4hCRzwH5wsMrLz8ZClOeJp6ntY",
  authDomain: "bb05-80c87.firebaseapp.com",
  projectId: "bb05-80c87",
  storageBucket: "bb05-80c87.appspot.com",
  messagingSenderId: "256489944397",
  appId: "1:256489944397:web:41b1266fff10f9df9d7304",
  measurementId: "G-8YPSCRZDKR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
