import { initializeApp } from "firebase/app"
import {getFirestore} from 'firebase/firestore'

// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID
// }

const firebaseConfig = {
    apiKey: "AIzaSyBtrRxKZKycFR3Y7x6kUGmeF0Pm5cu8GlU",
    authDomain: "chat-app-78784.firebaseapp.com",
    projectId: "chat-app-78784",
    storageBucket: "chat-app-78784.appspot.com",
    messagingSenderId: "844404806625",
    appId: "1:844404806625:web:5fdf1ff380c028b4d378a0"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)