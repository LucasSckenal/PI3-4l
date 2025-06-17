// src/pages/AnalysisResult/AnalysisResultPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../api/firebase";
import styles from "./styles.module.scss";

export default function AnalysisResultPage() {
  const { chatId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const uid = getAuth().currentUser?.uid;
    if (!uid || !chatId) return;

    const docRef = doc(db, "Users", uid, "AnalysisResults", chatId);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setResult({ id: snap.id, ...snap.data() });
      } else {
        setResult(null);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  if (result === null) {
    return <div className={styles.loading}>Carregando resultado da análise…</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Resultado da Análise</h1>

      <section className={styles.section}>
        <h2>Mensagem do Usuário</h2>
        <p className={styles.message}>{result.userMessage}</p>
      </section>

      <section className={styles.section}>
        <h2>Resposta do Médico</h2>
        <p className={styles.message}>{result.diagnosisText}</p>
      </section>
    </div>
  );
}
