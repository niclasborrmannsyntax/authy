import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDR9hShWftqrtO5U6Ug2L-dqil4Ku4Atfo",
  authDomain: "react-test-app-154d3.firebaseapp.com",
  projectId: "react-test-app-154d3",
  storageBucket: "react-test-app-154d3.firebasestorage.app",
  messagingSenderId: "64984702293",
  appId: "1:64984702293:web:75bda3d309b83bc91a23dc",
  measurementId: "G-ZNDC2RNR3L",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;
