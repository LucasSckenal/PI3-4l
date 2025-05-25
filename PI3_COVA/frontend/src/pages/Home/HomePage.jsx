import { useNavigate } from "react-router-dom";
import { useAccount } from "../../contexts/Account/AccountProvider";
import { useEffect, useState } from "react";
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
import { useScreenResize } from "../../contexts/ScreenResizeProvider/ScreenResizeProvider";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const navigate = useNavigate();
  const { userData, loading } = useAccount();
  const [history, setHistory] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [chatCount, setChatCount] = useState(0);
  const { isMobile } = useScreenResize();
  const { t } = useTranslation();

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
            t("home.unknownDate"),
          title: data.title || "",
        };
      });
      setHistory(results);
    });

    return unsub;
  }, [t]);

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

  const mapSymptomToKey = (symptom) => {
    switch (symptom.toLowerCase()) {
      case "tontura leve":
        return "tonturaLeve";
      case "sensação de peso na cabeça":
        return "sensacaoPesoCabeca";
      case "dor de cabeça em pontadas":
        return "dorCabecaPontadas";
      case "sensibilidade à luz":
        return "sensibilidadeLuz";
      case "náusea":
        return "nausea";
      case "zumbido":
        return "zumbido";
      case "fotofobia":
        return "fotofobia";
      case "fonofobia":
        return "fonofobia";
      case "dor pulsátil unilateral":
        return "dorPulsatilUnilateral";
      case "visão embaçada":
        return "visaoEmbacada";
      default:
        return null;
    }
  };

  if (loading) return <div>{t("common.loading")}</div>;

  if (isMobile) {
    return (
      <div className={styles.MainContainer}>
        <div className={styles.GreetingText}>
          <p>{t("home.welcome")}</p>
          <h2>
            {userData?.name?.split(" ").slice(0, 2).join(" ") ?? t("home.user")}
          </h2>
        </div>

        <div className={styles.InnerContainer}>
          <div className={styles.HeroBanner} onClick={() => navigate("/chat")}>
            <button
              className={styles.chatButton}
              onClick={() => navigate("/chat")}
            >
              {t("home.startDiagnosis")} <IoArrowForwardSharp size={30} />
            </button>
          </div>

          <SymptomsCarousel symptoms={symptoms} />
        </div>

        <div className={styles.History}>
          <div className={styles.HistoryHeader}>
            <p>{t("home.recentHistory")}</p>
            <button
              className={styles.ViewMoreButton}
              onClick={() => navigate("/history")}
            >
              {t("home.viewAll")}
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
              <div className={styles.box}>{t("home.noHistory")}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.MainContainer}>
      <div className={styles.GreetingText}>
        <p>{t("home.welcomeBack")}</p>
        <h2>
          {userData?.name?.split(" ").slice(0, 4).join(" ") ?? t("home.user")}
        </h2>
      </div>

      <div className={styles.HeroBanner} onClick={() => navigate("/chat")}>
        {t("home.newDiagnosis")}
      </div>

      <div className={styles.InnerContainer}>
        <div className={styles.Dashboard}>
          <div className={styles.StatsCardCompact}>
            <h3>{t("home.diagnoses")}</h3>
            <p>{chatCount}</p>
          </div>

          <div className={styles.StatsCardSymptoms}>
            <h3>{t("home.frequentSymptoms")}</h3>
            <div className={styles.SymptomChips}>
              {symptoms.map((s, i) => {
                const key = mapSymptomToKey(s);
                return (
                  <span key={i} className={styles.Chip}>
                    {key ? t(`symptoms.${key}`) : s}
                  </span>
                );
              })}
            </div>
          </div>

          <div className={styles.StatsCardCompact}>
            <h3>{t("home.needHelp")}</h3>
            <button
              className={styles.HelpButton}
              onClick={() => navigate("/tutorial")}
            >
              {t("home.learnMore")}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.History}>
        <div className={styles.HistoryHeader}>
          <p>{t("home.recentHistory")}</p>
          <button
            className={styles.ViewMoreButton}
            onClick={() => navigate("/history")}
          >
            {t("home.viewAll")}
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
                {index + 1}. {item.title || t("home.noTitle")}
              </div>
            ))
          ) : (
            <div className={styles.box}>{t("home.noHistory")}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
