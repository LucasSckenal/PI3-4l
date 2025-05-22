import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeProvider/ThemeProvider";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../api/firebase";
import { getAuth } from "firebase/auth";

import logoDark from "../../public/logo4l.png";
import logoLight from "../../public/logo4l_LightMode.png";

import styles from "./styles.module.scss";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams();
  const { isDarkMode } = useContext(ThemeContext);

  const [logo, setLogo] = useState(logoDark);
  const [iconColor, setIconColor] = useState("white");
  const [chatTitle, setChatTitle] = useState(null);
  const [unsubscribeSnapshot, setUnsubscribeSnapshot] = useState(null);

  useEffect(() => {
    if (isDarkMode) {
      setLogo(logoDark);
      setIconColor("white");
    } else {
      setLogo(logoLight);
      setIconColor("black");
    }
  }, [isDarkMode]);

  // Configura o listener em tempo real para o título do chat
  useEffect(() => {
    const setupChatListener = async () => {
      if (!chatId) return;
      
      const userId = getAuth().currentUser?.uid;
      if (!userId) return;

      try {
        const chatRef = doc(db, "Users", userId, "chats", chatId);
        
        // Cria um listener em tempo real
        const unsubscribe = onSnapshot(chatRef, (doc) => {
          if (doc.exists()) {
            const title = doc.data().title || "Conversa";
            setChatTitle(title);
          }
        });

        setUnsubscribeSnapshot(() => unsubscribe); // Armazena a função para limpeza

      } catch (error) {
        console.error("Erro ao configurar listener do chat:", error);
        setChatTitle("Conversa");
      }
    };

    if (location.pathname.startsWith("/chat/") && chatId) {
      setupChatListener();
    } else {
      setChatTitle(null);
    }

    // Limpeza do listener quando o componente desmontar ou o chatId mudar
    return () => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, chatId]);

  // Limpa o listener quando sai da página de chat
  useEffect(() => {
    if (!location.pathname.startsWith("/chat/") && unsubscribeSnapshot) {
      unsubscribeSnapshot();
      setUnsubscribeSnapshot(null);
    }
  }, [location.pathname, unsubscribeSnapshot]);

  const getPageTitle = (pathname) => {
    // Mostra o título do chat se disponível
    if (pathname.startsWith("/chat/")) {
      return chatTitle || "Carregando...";
    }

    switch (pathname) {
      case "/":
        return "Inicial";
      case "/chat":
        return "Nova Conversa";
      case "/history":
        return "Histórico";
      case "/profile":
        return "Perfil";
      case "/settings":
        return "Configurações";
      default:
        return "Página";
    }
  };

  return (
    <header className={styles.Header}>
      <button
        className={styles.backBtn}
        onClick={() => navigate(-1)}
        aria-label="Voltar"
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