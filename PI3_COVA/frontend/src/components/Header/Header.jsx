import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeProvider/ThemeProvider"; // Certifique-se de importar o contexto corretamente

import logoDark from "../../public/logo4l.png";
import logoLight from "../../public/logo4l_LightMode.png";

import styles from "./styles.module.scss";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isDarkMode} = useContext(ThemeContext);

  const [logo, setLogo] = useState(logoDark);
  const [iconColor, setIconColor] = useState("white");

  useEffect(() => {
    if (isDarkMode) {
      setLogo(logoDark);
      setIconColor("white");
    } else {
      setLogo(logoLight);
      setIconColor("black");
    }
  }, [isDarkMode]); 

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/":
        return "Inicial";
      case "/chat":
        return "Conversa";
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
        onClick={() => navigate("/")}
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
