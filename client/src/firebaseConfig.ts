// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyxYs4VZUzNbGO5MFqecjNaKh5pxGOnos",
  authDomain: "sura-codex.firebaseapp.com",
  projectId: "sura-codex",
  storageBucket: "sura-codex.firebasestorage.app",
  messagingSenderId: "403235335582",
  appId: "1:403235335582:web:b3ad558da010a299cc7a8f",
  measurementId: "G-W3FEHS40P3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();