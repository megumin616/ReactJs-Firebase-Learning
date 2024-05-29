// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCef7OQIvF49VsYvDb7BpJEK16L__Osju8",
  authDomain: "project-plubplaconcrete.firebaseapp.com",
  projectId: "project-plubplaconcrete",
  storageBucket: "project-plubplaconcrete.appspot.com",
  messagingSenderId: "1082626049351",
  appId: "1:1082626049351:web:8b781d98347fb45a34b862",
  measurementId: "G-2T4J1DD2GK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);