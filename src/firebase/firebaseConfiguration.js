import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyBSZBt86nKSK13kNtwc9n187Sk2gEjbvUQ",
  authDomain: "sound-chat-59d5c.firebaseapp.com",
  projectId: "sound-chat-59d5c",
  storageBucket: "sound-chat-59d5c.appspot.com",
  messagingSenderId: "120522474023",
  appId: "1:120522474023:web:83391386d7375ff6700402"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firestoreDb = firebase.firestore();
export const cloudStorage = firebase.storage();