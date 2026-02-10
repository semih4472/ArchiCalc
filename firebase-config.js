// Firebase Configuration (Global Scope for "file://" compatibility)
// This file assumes firebase-app-compat.js and firebase-auth-compat.js are loaded before it.

const firebaseConfig = {
    apiKey: "AIzaSyBdJj2so7SjCCZyudjx--fnOgGFcolAVlU",
    authDomain: "archicalc-log-in.firebaseapp.com",
    projectId: "archicalc-log-in",
    storageBucket: "archicalc-log-in.firebasestorage.app",
    messagingSenderId: "329530627547",
    appId: "1:329530627547:web:87626d1ada2246e4dc43fe",
    measurementId: "G-WBFK88N5M9"
};

// Initialize Firebase
let db;
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase Initialized");

    // Initialize Firestore
    db = firebase.firestore();

    // Explicitly expose to window
    window.firebase = firebase;
    window.db = db;

} else {
    console.error("Firebase library not found!");
}
