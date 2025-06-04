// firebase.jsx
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
} from "firebase/firestore";
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

/**
 * Salva ou atualiza os campos básicos (nome, location, phone, email)
 * no documento Users/{userID}.
 *
 * @param {string} userID             — geralmente o email ou UID do usuário
 * @param {{ name: string, location: string, phone: string, email: string }} basicData
 */
const saveUserBasicInfo = async (userID, basicData) => {
  try {
    const userRef = doc(db, "Users", userID);
    await setDoc(userRef, basicData, { merge: true });
    console.log("✅ User basic info atualizado em Users/" + userID);
  } catch (error) {
    console.error("❌ Erro ao salvar User basic info:", error);
    throw error;
  }
};

/**
 * Salva ou atualiza TODOS os campos “Sobre o Médico” no documento
 * Users/{userID}/About/Info.
 *
 * A estrutura do objeto aboutData deve ser:
 * {
 *   title: string,
 *   specialties: array[string],
 *   hospital: string,
 *   crm: string,
 *   about: string,
 *   procedures: array[string],
 *   experiences: array[ { position, institution, period, description } ]
 * }
 *
 * @param {string} userID
 * @param {{
 *   title: string,
 *   specialties: string[],
 *   hospital: string,
 *   crm: string,
 *   about: string,
 *   procedures: string[],
 *   experiences: Array<{ position: string, institution: string, period: string, description: string }>
 * }} aboutData
 */
const saveDoctorAbout = async (userID, aboutData) => {
  try {
    // Cria (ou atualiza) o documento “Info” dentro da subcoleção “About”
    const aboutRef = doc(db, "Users", userID, "About", "Info");
    await setDoc(aboutRef, aboutData, { merge: true });
    console.log("✅ Doctor About salvo em Users/" + userID + "/About/Info");
  } catch (error) {
    console.error("❌ Erro ao salvar Doctor About:", error);
    throw error;
  }
};

/**
 * Busca os dados básicos do usuário (nome, location, phone, email)
 * no documento Users/{userID}. Retorna null se não existir.
 *
 * @param {string} userID
 * @returns {Promise<{ name: string, location: string, phone: string, email: string } | null>}
 */
const fetchUserBasicInfo = async (userID) => {
  try {
    const userRef = doc(db, "Users", userID);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("❌ Erro ao buscar User basic info:", error);
    throw error;
  }
};

/**
 * Busca o documento Users/{userID}/About/Info e retorna um objeto com:
 * {
 *   title, specialties, hospital, crm, about, procedures, experiences
 * }
 * Ou null se não existir.
 *
 * @param {string} userID
 * @returns {Promise<{
 *   title: string,
 *   specialties: string[],
 *   hospital: string,
 *   crm: string,
 *   about: string,
 *   procedures: string[],
 *   experiences: Array<{ position, institution, period, description }>
 * } | null>}
 */
const fetchDoctorAbout = async (userID) => {
  try {
    const aboutRef = doc(db, "Users", userID, "About", "Info");
    const snap = await getDoc(aboutRef);
    if (snap.exists()) {
      return snap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("❌ Erro ao buscar Doctor About:", error);
    throw error;
  }
};

export {
  app,
  analytics,
  auth,
  db,
  storage,
  saveUserBasicInfo,
  saveDoctorAbout,
  fetchUserBasicInfo,
  fetchDoctorAbout,
};
