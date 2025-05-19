import { useNavigate } from "react-router-dom";
import { useAccount } from "../../contexts/Account/AccountProvider";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  getCountFromServer,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../api/firebase";
import styles from "./styles.module.scss";
import { IoArrowForwardSharp } from "react-icons/io5";
import SymptomsCarousel from "../../components/SymptomsCarousel/SymptomsCarousel";

const HomePage = () => {
  const navigate = useNavigate();
  const { userData, loading } = useAccount();
  const [history, setHistory] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [chatCount, setChatCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1023);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1023);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) return;

    const q = query(
      collection(db, "Users", userId, "chats"),
      orderBy("createdAt", "desc"),
      limit(4)
    );

    const unsub = onSnapshot(q, (snap) => {
      const results = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          createdAt:
            data.createdAt?.toDate().toLocaleDateString("pt-BR") ||
            "Data desconhecida",
          title: data.title || "",
        };
      });
      setHistory(results);
    });

    return unsub;
  }, []);

  useEffect(() => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) return;

    const countChats = async () => {
      const chatCollectionRef = collection(db, "Users", userId, "chats");
      try {
        const snapshot = await getCountFromServer(chatCollectionRef);
        setChatCount(snapshot.data().count);
      } catch (error) {
        console.error("Erro ao contar diagnósticos:", error);
        setChatCount(0);
      }
    };

    countChats();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Cases"), (snapshot) => {
      const allSymptoms = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (Array.isArray(data.sintomas)) {
          allSymptoms.push(...data.sintomas);
        } else if (typeof data.sintomas === "object") {
          allSymptoms.push(...Object.values(data.sintomas));
        }
      });

      const uniqueSymptoms = [...new Set(allSymptoms)];
      const latestSymptoms = uniqueSymptoms.slice(-10);
      setSymptoms(latestSymptoms);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (symptoms.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % symptoms.length);
    }, 3000); // tempo em milissegundos

    return () => clearInterval(interval);
  }, [symptoms]);

  if (loading) return <div>Carregando...</div>;

  // --- MOBILE VERSION ---
  if (isMobile) {
    return (
      <div className={styles.MainContainer}>
        <div className={styles.GreetingText}>
          <p>Bem-vindo</p>
          <h2>
            {userData?.name?.split(" ").slice(0, 4).join(" ") ?? "Usuário"}
          </h2>
        </div>

        <div className={styles.InnerContainer}>
          <div className={styles.HeroBanner} onClick={() => navigate("/chat")}>
            <button
              className={styles.chatButton}
              onClick={() => navigate("/chat")}
            >
              COMEÇAR DIAGNÓSTICO <IoArrowForwardSharp size={30} />
            </button>
          </div>

          <SymptomsCarousel symptoms={symptoms} />
        </div>

        <div className={styles.History}>
          <div className={styles.HistoryHeader}>
            <p>Histórico recente: </p>
            <button
              className={styles.ViewMoreButton}
              onClick={() => navigate("/history")}
            >
              Ver todos
            </button>
          </div>
          <div className={styles.InnerHistory}>
            {history.length > 0 ? (
              history.map((item, index) => (
                <div
                  key={item.id}
                  className={styles.box}
                  onClick={() => navigate(`/chat/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {index + 1}. {item.title}
                </div>
              ))
            ) : (
              <div className={styles.box}>Nenhum histórico encontrado.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- DESKTOP VERSION ---
  return (
    <div className={styles.MainContainer}>
      <div className={styles.GreetingText}>
        <p>Bem-vindo de volta</p>
        <h2>{userData?.name?.split(" ").slice(0, 4).join(" ") ?? "Usuário"}</h2>
      </div>

      <div className={styles.HeroBanner} onClick={() => navigate("/chat")}>
        COMEÇAR NOVO DIAGNÓSTICO
      </div>

      <div className={styles.InnerContainer}>
        <div className={styles.Dashboard}>
          <div className={styles.StatsCardCompact}>
            <h3>Diagnósticos</h3>
            <p>{chatCount}</p>
          </div>

          <div className={styles.StatsCardSymptoms}>
            <h3>Sintomas Frequentes</h3>
            <div className={styles.SymptomChips}>
              {symptoms.map((s, i) => (
                <span key={i} className={styles.Chip}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.StatsCardCompact}>
            <h3>Precisa de ajuda?</h3>
            <button
              className={styles.HelpButton}
              onClick={() => navigate("/tutorial")}
            >
              Saiba mais
            </button>
          </div>
        </div>
      </div>

      <div className={styles.History}>
        <div className={styles.HistoryHeader}>
          <p>Histórico recente:</p>
          <button
            className={styles.ViewMoreButton}
            onClick={() => navigate("/history")}
          >
            Ver todos
          </button>
        </div>

        <div className={styles.InnerHistory}>
          {history.length > 0 ? (
            history.map((item, index) => (
              <div
                key={item.id}
                className={styles.box}
                onClick={() => navigate(`/chat/${item.id}`)}
              >
                {index + 1}. {item.title || "Sem título"}
              </div>
            ))
          ) : (
            <div className={styles.box}>Nenhum histórico encontrado.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
