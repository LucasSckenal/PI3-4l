import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../api/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
if (firebaseUser) {
try {
const docRef = doc(db, "Users", firebaseUser.uid);
const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: userData.role,
        });
      } else {
        console.warn(
          "Usuário autenticado, mas não encontrado na coleção 'users' do Firestore."
        );
        setUser(null);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário no Firestore:", error);
      setUser(null);
    }
  } else {
    setUser(null);
  }

  setLoading(false);
});

return () => unsubscribe();
}, []);

return (
<AuthContext.Provider value={{ user, loading }}>
{children}
</AuthContext.Provider>
);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);