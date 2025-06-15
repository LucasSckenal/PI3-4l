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
  const [accountData, setAccountData] = useState({
    userData: null,
    userId: null,
    role: null,
    loading: true
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      // Estado inicial quando não há usuário
      if (!user) {
        setAccountData({
          userData: null,
          userId: null,
          role: null,
          loading: false
        });
        return;
      }

      const userDocRef = doc(db, "Users", user.uid);

      try {
        // Verificar se o documento existe
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          const photoSource = isValidPhoto(user.photoURL) ? user.photoURL : "";

          // Dados iniciais com role padrão
          const initialData = {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            photo: photoSource,
            birthDate: "",
            gender: "",
            phone: "",
            location: "",
            role: "User"
          };

          await setDoc(userDocRef, initialData);
        }

        // Configurar listener para atualizações em tempo real
        const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();

            const photoSource =
              isValidPhoto(data.photo) ? data.photo :
              isValidPhoto(user.photoURL) ? user.photoURL : "";

            const userInfo = {
              uid: user.uid,
              name: data.name || user.displayName || "",
              email: data.email || user.email || "",
              photo: photoSource,
              birthDate: data.birthDate || "",
              gender: data.gender || "",
              phone: data.phone || "",
              location: data.location || "",
            };

            // Adiciona campos exclusivos do "user"
            if ((data.role || "User").toLowerCase() === "user") {
              userInfo.weight = data.weight || "";
              userInfo.bloodType = data.bloodType || "";
            }

            setAccountData({
              userData: userInfo,
              userId: user.uid,
              role: data.role || "User",
              loading: false
            });
          }
        }, (error) => {
          console.error("Erro ao escutar dados do usuário:", error);
          setAccountData(prev => ({...prev, loading: false}));
        });

        return () => unsubscribeSnapshot();
        
      } catch (error) {
        console.error("Erro ao processar conta:", error);
        setAccountData({
          userData: null,
          userId: user.uid,
          role: null,
          loading: false
        });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <AccountContext.Provider value={accountData}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;