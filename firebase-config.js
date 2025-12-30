/**
 * Firebase Configuration and Initialization
 * 
 * TODO: REPLACE THE VALUES BELOW WITH YOUR FIREBASE PROJECT CREDENTIALS
 * 1. Go to console.firebase.google.com
 * 2. Create a new project (or use existing)
 * 3. Go to Project Settings > General > "Your apps" > Add Web App
 * 4. Copy the "firebaseConfig" object and paste values here
 */

const firebaseConfig = {
    apiKey: "AIzaSyBnaExTld4B7DguEdFr75PT5KaOA9LEgwU",
    authDomain: "nissi-biryani-pos.firebaseapp.com",
    projectId: "nissi-biryani-pos",
    storageBucket: "nissi-biryani-pos.firebasestorage.app",
    messagingSenderId: "559043661974",
    appId: "1:559043661974:web:80fea7c34a9cc2c5c8b2b7",
    measurementId: "G-WWJ048J8RP"
};

// Import Firebase SDKs from CDN (Modular, but using window global for vanilla simplicity or ES modules)
// We will use ES modules for modern support.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export for other modules
export { auth, db, signInWithEmailAndPassword, onAuthStateChanged, signOut, collection, addDoc, getDocs, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy };
