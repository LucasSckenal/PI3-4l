import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../api/firebase";

const AccountContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount deve ser usado dentro de um AccountProvider");
  }
  return context;
};

const isValidPhoto = (photo) => {
  return typeof photo === "string" && (
    photo.startsWith("data:image") || photo.startsWith("http")
  );
};

const AccountProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, "Users", user.uid);

      try {
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          const photoSource = isValidPhoto(user.photoURL) ? user.photoURL : "";

          const initialData = {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            photo: photoSource,
            birthDate: "",
            gender: "",
            phone: "",
            location: "",
          };

          await setDoc(userDocRef, initialData);
        }
      } catch (error) {
        console.error("Erro ao criar documento de usuário:", error);
        setLoading(false);
        return;
      }

      const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();

          const photoSource =
            isValidPhoto(data.photo) ? data.photo :
            isValidPhoto(user.photoURL) ? user.photoURL : "";

          setUserData({
            uid: user.uid,
            name: data.name || user.displayName || "",
            email: data.email || user.email || "",
            photo: photoSource,
            birthDate: data.birthDate || "",
            gender: data.gender || "",
            phone: data.phone || "",
            location: data.location || "",
          });
        }
        setLoading(false);
      }, (error) => {
        console.error("Erro ao escutar dados do usuário:", error);
        setLoading(false);
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <AccountContext.Provider value={{ userData, loading }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
