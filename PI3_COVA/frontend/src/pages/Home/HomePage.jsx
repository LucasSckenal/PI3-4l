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
import { BiBrain } from "react-icons/bi";
import { FaGrinBeamSweat,  FaMedkit, FaPlay} from "react-icons/fa";
import { MdVisibilityOff } from "react-icons/md";
import { BsBrightnessAltLow } from "react-icons/bs";
import SymptomsCarousel from "../../components/SymptomsCarousel/SymptomsCarousel";
import { useScreenResize } from "../../contexts/ScreenResizeProvider/ScreenResizeProvider";
import { useTranslation } from "react-i18next";
import defaultProfileIcon from "../../public/UserDefault.webp";
import tutorialPreview from "../../public/tutorial-preview.png";
import TutorialModal from "../../components/tutorialModal/tutorialModal";
import {fetchUserBasicInfo } from "../../api/firebase";


const HomePage = () => {
  const navigate = useNavigate();
  const { userData, loading } = useAccount();
  const [history, setHistory] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [chatCount, setChatCount] = useState(0);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);


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

  const getProfileImageSource = () => {
      if (!userData.photo) return defaultProfileIcon;
      if (
        userData.photo.startsWith("http") ||
        userData.photo.startsWith("data:image")
      )
        return userData.photo;
      return defaultProfileIcon;
    };

  useEffect(() => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) return;

    const q = query(
      collection(db, "Users", userId, "AnalysisResults"),
      orderBy("deliveredAt", "desc"),
      limit(1)
    );

    const unsub = onSnapshot(q, async (snapshot) => {
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const data = docSnap.data();

        setLatestAnalysis({
          id: docSnap.id,
          triagemLevel: data.cidGroup || t("home.unknown"),
          diseaseName: data.diseaseName || t("home.unknown"),
          recommendations: data.recommendations || t("home.noRecommendations"),
          severity: data.priority || t("home.unknown"),
          createdAt:
            data.deliveredAt?.toDate().toLocaleDateString("pt-BR") ||
            t("home.unknownDate"),
        });

        if (data.doctorId) {
          const info = await fetchUserBasicInfo(data.doctorId);
          setDoctorInfo(info);
        } else {
          setDoctorInfo(null);
        }
      } else {
        setLatestAnalysis(null);
        setDoctorInfo(null);
      }
    }, (error) => {
      console.error("Erro ao buscar AnalysisResults:", error);
    });
    return () => unsub();
  }, [t]);


  const iconMap = [
    { keywords: ["dor", "cabeça", "cefaleia", "enxaqueca"], icon: <BiBrain />, title: "Dor de cabeça" },
    { keywords: ["enjoo", "náusea", "vomito"], icon: <FaGrinBeamSweat />, title: "Enjoo" },
    { keywords: ["visão", "embaçada", "turva"], icon: <MdVisibilityOff />, title: "Visão embaçada" },
    { keywords: ["luz", "claridade", "fotofobia"], icon: <BsBrightnessAltLow />, title: "Sensibilidade à luz" },
  ];
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
        <div className={styles.bg}>
        <div className={styles.GreetingText}>
          <img
                    src={getProfileImageSource()}
                    alt="Profile"
                    className={styles.profileImage}
                    onError={(e) => (e.target.src = defaultProfileIcon)}
                    onClick={() => navigate("/profile")}
                  />
                  <div className={styles.textGreetings}>
                   <p>{t("home.welcome")}</p>
              <h2>
                {userData?.name?.split(" ").slice(0, 2).join(" ") ?? t("home.user")}
              </h2>
            </div>
          </div>
           <div className={styles.DiagnosisInvitation}>
              <h2>{t("home.startDiagnosisTitle")}</h2>
              <button onClick={() => navigate("/chat")}>{t("home.startDiagnosis")}</button>
            </div>
        </div>

        <div className={styles.InnerContainer}>
          
          {/* Seção de Análises para Mobile */}
          <div className={styles.Analysis}>
          <p className={styles.AnalysisTitle}>{t("home.doctorRevision")}:</p>
          <div className={styles.AnalysisCard}>
            <div
              className={styles.ProfileSection}
              onClick={() =>
                doctorInfo && navigate(`/profile/${doctorInfo.uid}`)
              }
            >
              <img
                
                  src={doctorInfo?.photo || defaultProfileIcon}
                
                alt="Foto do médico"
              />
              <div className={styles.ProfileText}>
                <p className={styles.doctorTitle}>{t("home.doctorTitle")}</p>
                <strong>
                  {doctorInfo?.name ?? t("home.unknownDoctor")}
                </strong>
                <button>{t("home.viewProfile")}</button>
              </div>
            </div>
              <div className={styles.ReportSection}>
                {latestAnalysis ? (
                  <>
                    <p><strong>{t("home.triageLevel")}</strong> - {latestAnalysis.triagemLevel}</p>
                    <p>{latestAnalysis.diseaseName}</p>
                    <p>{t("home.recommendations")}: {latestAnalysis.recommendations}</p>
                    <p><strong>{t("home.diseaseSeverity")}:</strong> {latestAnalysis.severity}</p>
                    <small>{t("home.generatedOn")}: {latestAnalysis.createdAt}</small>
                  </>
                ) : (
                  <p>{t("home.noAnalysis")}</p>
                )}
              </div>
              <button 
                className={styles.ViewCompleteButton}
                onClick={() => navigate(`/AnalysisResults/${latestAnalysis.id}`)}
              >
                {t("home.viewComplete")}
              </button>
            </div>
        
        <div className={styles.GridHistorico}>
            {history.length > 0 ? (
              history.map((item) => {
                const lower = item.title.toLowerCase();

                const iconEntry =
                  iconMap.find((entry) =>
                    entry.keywords.some((kw) => lower.includes(kw))
                  ) || {
                    icon: < FaMedkit  />,
                    title: t("home.genericSymptom"),
                  };

                return (
                  <div
                    key={item.id}
                    className={styles.box}
                    onClick={() => navigate(`/chat/${item.id}`)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "1.5rem" }}>{iconEntry.icon}</span>
                      <strong>{iconEntry.title}</strong>
                    </div>

                    <p style={{ margin: "0.25rem 0 0.25rem 2rem" }}>
                      {item.title || t("home.noTitle")}
                    </p>

                    <small style={{ color: "#888", marginLeft: "2rem" }}>
                      {item.createdAt}
                    </small>
                  </div>
                );
              })
            ) : (
              <div className={styles.box}>{t("home.noHistory")}</div>
            )}
            </div>
          </div>
          
          <div className={styles.StatsMobileWrapper}>
            <h2>{t("home.consultationSummary")}</h2>
            <div className={styles.MobileCard}>
              <h3>{t("home.totalConsultations")}</h3>
              <p>{chatCount}</p>
            </div>

            <div className={styles.CommonIllnesses}>
              <h3>{t("home.commonIllnesses")}</h3>
              <div className={styles.IllnessTags}>
                {symptoms.slice(0, 5).map((s, i) => {
                  const key = mapSymptomToKey(s);
                  return (
                    <span key={i} className={styles.Tag}>
                      {key ? t(`symptoms.${key}`) : s}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className={styles.TutorialCard} onClick={() => setShowTutorialModal(true)}>
              <div>
                <strong>{t("home.tutorialTitle")}</strong>
                <p>{t("home.tutorialDesc")}</p>
              </div>
               <div className={styles.TutorialImageWrapper}>
                <img src={tutorialPreview} alt="Tutorial" />
                <FaPlay className={styles.PlayIcon} />
              </div>
            </div>
          </div>
        </div>
        <TutorialModal isOpen={showTutorialModal} onClose={() => setShowTutorialModal(false)} canClose={true}/>
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
              onClick={() => setShowTutorialModal(true)}
            >
              {t("home.learnMore")}
            </button>
          </div>
        </div>
      </div>

      {/* Wrapper para Histórico e Análises */}
      <div className={styles.ContentWrapper}>
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

        {/* Seção de Análises para Desktop */}
        <div className={styles.Analysis}>
          <p className={styles.AnalysisTitle}>{t("home.doctorRevision")}:</p>
          <div className={styles.AnalysisCard}>
            <div className={styles.ProfileSection} onClick={() =>
                doctorInfo && navigate(`/profile/${doctorInfo.uid}`)}>
              <img src={doctorInfo?.photo || defaultProfileIcon} alt="Profile" />
              <div className={styles.ProfileText}>
                <p className={styles.doctorTitle}>{t("home.doctorTitle")}</p>
                <strong>{doctorInfo?.name ?? t("home.unknownDoctor")}</strong>
                <button>{t("home.viewProfile")}</button>
              </div>
            </div>
            {latestAnalysis ? (
            <><div className={styles.ReportSection}>
                <p><strong>{t("home.triageLevel")}</strong> - {latestAnalysis.triagemLevel}</p>
                <p>{latestAnalysis.diseaseName}</p>
                <p>{t("home.recommendations")}: {latestAnalysis.recommendations}</p>
                <p><strong>{t("home.diseaseSeverity")}:</strong> {latestAnalysis.severity}</p>
                <small>{t("home.generatedOn")}: {latestAnalysis.createdAt}</small>
              </div><button className={styles.ViewCompleteButton} onClick={() => navigate(`/AnalysisResults/${latestAnalysis.id}`)}>Ver completo</button></>
            ) : (
                  <p>{t("home.noAnalysis")}</p>
                )}
          </div>
        </div>
      </div>

      <TutorialModal isOpen={showTutorialModal} onClose={() => setShowTutorialModal(false)} canClose={true}/>
    </div>
  );
};

export default HomePage;