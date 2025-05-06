import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
  // Verifica se é uma string base64 ou URL válida
  return typeof photo === "string" && (
    photo.startsWith("data:image") || photo.startsWith("http")
  );
};

const AccountProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        let data;

        if (userDoc.exists()) {
          data = userDoc.data();

          const photoSource =
            isValidPhoto(data.photo) ? data.photo :
            isValidPhoto(user.photoURL) ? user.photoURL : "";

          data = {
            uid: user.uid,
            name: data.name || user.displayName || "",
            email: data.email || user.email || "",
            photo: photoSource,
            birthDate: data.birthDate || "",
            gender: data.gender || "",
            phone: data.phone || "",
            location: data.location || "",
          };

          setUserData(data);
        } else {
          const photoSource = isValidPhoto(user.photoURL) ? user.photoURL : "";

          data = {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            photo: photoSource,
            birthDate: "",
            gender: "",
            phone: "",
            location: "",
          };

          await setDoc(userDocRef, data);
          setUserData(data);
        }
      } catch (error) {
        console.error("Erro ao buscar/criar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AccountContext.Provider value={{ userData, loading }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
