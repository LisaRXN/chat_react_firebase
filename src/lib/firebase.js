import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-3f410.firebaseapp.com",
  projectId: "reactchat-3f410",
  storageBucket: "reactchat-3f410.firebasestorage.app",
  messagingSenderId: "800299565372",
  appId: "1:800299565372:web:9149f6ec4be15303ae5e39"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()