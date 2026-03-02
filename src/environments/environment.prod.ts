// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import { getPerformance } from "firebase/performance"; // Removed, handled by AngularFire
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


export const environment = {
    production: false,
    firebase: {
        apiKey: "AIzaSyAeAdcKMl18u3v2dsrQD1ggjI0zey4BZxo",
        authDomain: "tss-calendar-a03ad.firebaseapp.com",
        projectId: "tss-calendar-a03ad",
        storageBucket: "tss-calendar-a03ad.firebasestorage.app",
        messagingSenderId: "392799011258",
        appId: "1:392799011258:web:7d50d9e395ae6088499d83",
        measurementId: "G-7EBW7QZQDR"
    }
};

// Remove direct initialization of app and perf. Let AngularFire handle it.
const app = initializeApp(environment.firebase);
export const db = getFirestore(app);
// If db is needed elsewhere, you may keep this, but ideally use AngularFire's injection.
// export const db = getFirestore(app)
