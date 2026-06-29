import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZ-6tmsRJFQDnXxnr4z9J4rrSDbQ4ITog",
  authDomain: "ai-trading-system-final.firebaseapp.com",
  projectId: "ai-trading-system-final",
  storageBucket: "ai-trading-system-final.firebasestorage.app",
  messagingSenderId: "760134947975",
  appId: "1:760134947975:web:334c667be72b7c6ac7d422"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export {
  auth,
  provider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword
};
