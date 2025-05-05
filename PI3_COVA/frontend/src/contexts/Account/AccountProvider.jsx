import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../api/firebase";

const AccountContext = createContext();

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount deve ser usado dentro de um AccountProvider");
  }
  return context;
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

        if (userDoc.exists()) {
          const data = userDoc.data();

          if (data.photo && typeof data.photo === "string") {
            data.photo = data.photo.replace(/\s/g, "");
          }

          setUserData(data);
        } else {
          console.warn("Documento do usuário não encontrado no Firestore.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
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
