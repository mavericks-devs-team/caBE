import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCXlUTPJhNjLCqzjUfOJP5TJOBUjxABCNA",
    authDomain: "cabe-d66bb.firebaseapp.com",
    databaseURL: "https://cabe-d66bb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cabe-d66bb",
    storageBucket: "cabe-d66bb.firebasestorage.app",
    messagingSenderId: "954887825964",
    appId: "1:954887825964:web:ba768ab802556ef5f3bf89",
    measurementId: "G-4Y2V634J5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics (only on client side and if supported)
export const analytics = typeof window !== 'undefined' ? isSupported().then((yes: boolean) => yes ? getAnalytics(app) : null) : null;

export default app;
