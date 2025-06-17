// src/contexts/NotificationContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../api/firebase";
import { useAuth } from "../AuthProvider/AuthProvider";
import { useLocation } from "react-router-dom";
import { getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [hasNewAnalysis, setHasNewAnalysis] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "Users", user.uid, "AnalysisResults"),
      where("status", "==", "finalizado"),
      where("visualizada", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setHasNewAnalysis(true);
        toast.info(<b>Nova análise finalizada! Clique para ver.</b>, {
  onClick: () => navigate("/"),
});
      } else {
        setHasNewAnalysis(false);
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
    const markAsVisualized = async () => {
      if (!user?.uid || location.pathname !== "/") return;

      const querySnapshot = await getDocs(
        query(
          collection(db, "Users", user.uid, "AnalysisResults"),
          where("status", "==", "finalizado"),
          where("visualizada", "==", false)
        )
      );

      const batch = querySnapshot.docs.map((docSnap) =>
        updateDoc(doc(db, "Users", user.uid, "AnalysisResults", docSnap.id), {
          visualizada: true,
        })
      );

      await Promise.all(batch);
      setHasNewAnalysis(false);
    };

    markAsVisualized();
  }, [location.pathname, user?.uid]);

  return (
    <NotificationContext.Provider value={{ hasNewAnalysis }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
