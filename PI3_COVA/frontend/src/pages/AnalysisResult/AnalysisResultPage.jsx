// src/pages/AnalysisResult/AnalysisResultPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../api/firebase";
import styles from "./styles.module.scss";
import { FiUser, FiClipboard, FiCalendar, FiMessageSquare } from "react-icons/fi";

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

  // Formatar data
  const createdAtDate = result.deliveredAt?.toDate();
  const formattedDate = createdAtDate
    ? createdAtDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Data desconhecida";

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <FiClipboard className={styles.titleIcon} />
          Resultado da Análise Médica
        </h1>
        
        <div className={styles.metaContainer}>
          <div className={styles.metaItem}>
            <FiCalendar className={styles.metaIcon} />
            <span>{formattedDate}</span>
          </div>
          <div className={styles.metaItem}>
            <FiMessageSquare className={styles.metaIcon} />
            <span>ID: {chatId}</span>
          </div>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <section className={`${styles.card} ${styles.userCard}`}>
          <div className={styles.cardHeader}>
            <FiUser className={styles.cardIcon} />
            <h2>Sua Mensagem</h2>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.message}>{result.userMessage}</p>
          </div>
        </section>

        <section className={`${styles.card} ${styles.diagnosisCard}`}>
          <div className={styles.cardHeader}>
            <FiClipboard className={styles.cardIcon} />
            <h2>Diagnóstico Médico</h2>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.message}>{result.diagnosisText}</p>
          </div>
        </section>
      </div>

      <div className={styles.summaryCard}>
        <h2 className={styles.summaryTitle}>Resumo da Análise</h2>
        <div className={styles.summaryContent}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Grupo CID-10:</span>
            <span className={styles.summaryValue}>{result.cidGroup}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Doença:</span>
            <span className={styles.summaryValue}>{result.diseaseName}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Gravidade:</span>
            <span className={styles.summaryValue}>{result.priority}</span>
          </div>
        </div>
      </div>
    </div>
  );
}