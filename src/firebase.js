import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyDJnfSPwKfUzsX2HTv-Hu98tabxbrLEre4",
  authDomain: "bugeting-app.firebaseapp.com",
  projectId: "bugeting-app",
  storageBucket: "bugeting-app.firebasestorage.app",
  messagingSenderId: "598101659817",
  appId: "1:598101659817:web:e2ee306069a49a23f059b8",
  measurementId: "G-T7GFFG9VNF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);