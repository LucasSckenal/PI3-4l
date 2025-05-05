import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Importando os métodos necessários do Firestore
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBmdBaT_4w27jj-E22VSQVSHP3j30tAPmU",
  authDomain: "pi3-cova.firebaseapp.com",
  projectId: "pi3-cova",
  storageBucket: "pi3-cova.appspot.com",
  messagingSenderId: "519587416013",
  appId: "1:519587416013:web:66caaf16ae6748ea612684",
  measurementId: "G-F5HVKM36QM",
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const updateUserProfile = async (userData) => {
  try {
    const userRef = doc(db, "Users", userData.email); // Usando o email como ID
    await setDoc(userRef, userData, { merge: true }); // Atualizando os dados no Firestore
    console.log("Perfil atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
};

export { app, analytics, auth, db, storage, updateUserProfile }; // Exportando a função junto com as instâncias
