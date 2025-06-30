import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeProvider/ThemeProvider";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../api/firebase";
import { getAuth } from "firebase/auth";

import logoDark from "../../assets/Logo4l.png";
import logoLight from "../../assets/Logo4l_LightMode.png";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams();
  const { isDarkMode } = useContext(ThemeContext);
  const { t } = useTranslation();

  const [logo, setLogo] = useState(logoDark);
  const [iconColor, setIconColor] = useState("white");
  const [chatTitle, setChatTitle] = useState(null);
  const [unsubscribeSnapshot, setUnsubscribeSnapshot] = useState(null);

  useEffect(() => {
    setLogo(isDarkMode ? logoDark : logoLight);
    setIconColor(isDarkMode ? "white" : "black");
  }, [isDarkMode]);

  useEffect(() => {
    const setupChatListener = async () => {
      if (!chatId) return;

      const userId = getAuth().currentUser?.uid;
      if (!userId) return;

      try {
        const chatRef = doc(db, "Users", userId, "chats", chatId);
        const unsubscribe = onSnapshot(chatRef, (doc) => {
          if (doc.exists()) {
            const title = doc.data().title || t("chat.defaultTitle");
            setChatTitle(title);
          }
        });
        setUnsubscribeSnapshot(() => unsubscribe);
      } catch (error) {
        console.error("Erro ao configurar listener do chat:", error);
        setChatTitle(t("chat.defaultTitle"));
      }
    };

    if (location.pathname.startsWith("/chat/") && chatId) {
      setupChatListener();
    } else {
      setChatTitle(null);
    }

    return () => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, chatId, t]);

  useEffect(() => {
    if (!location.pathname.startsWith("/chat/") && unsubscribeSnapshot) {
      unsubscribeSnapshot();
      setUnsubscribeSnapshot(null);
    }
  }, [location.pathname, unsubscribeSnapshot]);

  const getPageTitle = (pathname) => {
    if (pathname.startsWith("/chat/")) {
      return chatTitle || t("chat.loading");
    }

    switch (pathname) {
      case "/":
        return t("pages.home");
      case "/chat":
        return t("pages.newChat");
      case "/history":
        return t("pages.history");
      case "/profile":
        return t("pages.profile");
      case "/settings":
        return t("pages.settings");
      case "/analysis":
        return t("pages.analysis");
      case "/doctor/home":
        return t("pages.home");
      case "/doctor/profile":
        return t("pages.profile");
      default:
        return t("pages.default");
    }
  };

  return (
    <header className={styles.Header}>
      <button
        className={styles.backBtn}
        onClick={() => navigate(-1)}
        aria-label={t("buttons.back")}
      >
        <IoArrowBackOutline
          className={styles.btnSbg}
          style={{ color: iconColor }}
        />
      </button>
      <h2 className={styles.title}>{getPageTitle(location.pathname)}</h2>
      <img className={styles.logo} src={logo} alt="4L" />
    </header>
  );
};

export default Header;
