// src/contexts/NotificationContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../api/firebase";
import { useAuth } from "../AuthProvider/AuthProvider";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
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
        toast.info("Uma nova análise médica foi finalizada!", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        setHasNewAnalysis(false);
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <NotificationContext.Provider value={{ hasNewAnalysis }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
