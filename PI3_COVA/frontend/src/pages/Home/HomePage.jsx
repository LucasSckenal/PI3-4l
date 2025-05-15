import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowForwardSharp } from "react-icons/io5";
import { useAccount } from "../../contexts/Account/AccountProvider";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../api/firebase";
import ChatHeroBannerBlur from "../../public/ChatHeroBannerBlur.png";
import styles from "./styles.module.scss";

const HomePage = () => {
  const navigate = useNavigate();
  const { userData, loading } = useAccount();
  const [history, setHistory] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(2);
  const [transitioning, setTransitioning] = useState(true);
  const trackRef = useRef(null);

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
        };
      });
      setHistory(results);
    });

    return unsub;
  }, []);

  // 🔍 Escutar sintomas da coleção Cases (limitado aos últimos 6 distintos)
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
      const latestSymptoms = uniqueSymptoms.slice(-6);
      console.log(allSymptoms);
      setSymptoms(latestSymptoms);
    });

    return () => unsubscribe();
  }, []);

  const itemWidth = 120;
  const visibleItems = 3;
  const offsetToCenter = (itemWidth * visibleItems) / 2 - itemWidth / 2;

  const duplicatedItems = [
    symptoms[symptoms.length - 2],
    symptoms[symptoms.length - 1],
    ...symptoms,
    symptoms[0],
    symptoms[1],
  ].filter(Boolean);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
      setTransitioning(true);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex === duplicatedItems.length - 2) {
      setTimeout(() => {
        setTransitioning(false);
        setCurrentIndex(2);
      }, 500);
    } else if (currentIndex === 1) {
      setTimeout(() => {
        setTransitioning(false);
        setCurrentIndex(duplicatedItems.length - 3);
      }, 500);
    } else {
      setTransitioning(true);
    }
  }, [currentIndex, duplicatedItems.length]);

  const getClassName = (index) => {
    if (index === currentIndex)
      return `${styles.CarroselItem} ${styles.CenterItem}`;
    if (index === currentIndex - 1 || index === currentIndex + 1)
      return `${styles.CarroselItem} ${styles.SideItem}`;
    return `${styles.CarroselItem}`;
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className={styles.MainContainer}>
      <div className={styles.GreetingText}>
        <p>Bem-vindo</p>
        <h2>{userData?.name || "Usuário"}</h2>
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

        <div className={styles.Carrosel}>
          <div className={styles.CarroselViewport}>
            <div
              ref={trackRef}
              className={styles.CarroselTrack}
              style={{
                transform: `translateX(-${
                  currentIndex * itemWidth - offsetToCenter
                }px)`,
                transition: transitioning
                  ? "transform 0.5s ease-in-out"
                  : "none",
              }}
            >
              {duplicatedItems.map((item, index) => (
                <div key={index} className={getClassName(index)}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
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
                {index + 1}. {item.createdAt}
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
