// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyDGFypfKTuonE3JHO-KDTpgPZtz2GGrpZI",
  authDomain: "mercedes-camiones-db.firebaseapp.com",
  projectId: "mercedes-camiones-db",
  storageBucket: "mercedes-camiones-db.firebasestorage.app",
  messagingSenderId: "195168755847",
  appId: "1:195168755847:web:1f813bd1fcb1fb68291822"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs };
