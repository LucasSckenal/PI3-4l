import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeProvider/ThemeProvider";

import logoDark from "../../public/logo4l.png";
import logoLight from "../../public/logo4l_LightMode.png";

import styles from "./styles.module.scss";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useContext(ThemeContext); 
  const [logo, setLogo] = useState(logoDark); 
  const [iconColor, setIconColor] = useState("white");

  useEffect(() => {
    if (theme === "dark") {
      setLogo(logoDark);
      setIconColor("white");
    } else {
      setLogo(logoLight);
      setIconColor("black");
    }
  }, [theme]);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/":
        return "Main Page";
      case "/chat":
        return "Chat Page";
      case "/history":
        return "History Page";
      case "/profile":
        return "Profile Page";
      case "/settings":
        return "Settings Page";
      default:
        return "Page";
    }
  };

  return (
    <header className={styles.Header}>
      <button
        className={styles.backBtn}
        onClick={() => navigate("/")}
        aria-label="Voltar"
      >
        <IoArrowBackOutline className={styles.btnSbg} color={iconColor} />
      </button>
      <h2 className={styles.title}>{getPageTitle(location.pathname)}</h2>
      <img className={styles.logo} src={logo} alt="4L" />
    </header>
  );
};

export default Header;
