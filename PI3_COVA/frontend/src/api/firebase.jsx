// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBmdBaT_4w27jj-E22VSQVSHP3j30tAPmU",
  authDomain: "pi3-cova.firebaseapp.com",
  projectId: "pi3-cova",
  storageBucket: "pi3-cova.appspot.com",
  messagingSenderId: "519587416013",
  appId: "1:519587416013:web:66caaf16ae6748ea612684",
  measurementId: "G-F5HVKM36QM"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
