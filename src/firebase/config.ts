import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
export const db = getFirestore(app);
export default app;

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDR9hShWftqrtO5U6Ug2L-dqil4Ku4Atfo",
//   authDomain: "react-test-app-154d3.firebaseapp.com",
//   projectId: "react-test-app-154d3",
//   storageBucket: "react-test-app-154d3.firebasestorage.app",
//   messagingSenderId: "64984702293",
//   appId: "1:64984702293:web:ac9c01c57efc66381a23dc",
//   measurementId: "G-9786MGBTN4"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
