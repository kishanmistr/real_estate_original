// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "realestate-final.firebaseapp.com",
  projectId: "realestate-final",
  storageBucket: "realestate-final.appspot.com",
  messagingSenderId: "674699349929",
  appId: "1:674699349929:web:ce6d6c3a82d76c24653eb8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);