import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeProvider/ThemeProvider";

import logoDark from "../../public/logo4l.png";
import logoLight from "../../public/logo4l_LightMode.png";

import styles from "./styles.module.scss";


const Header = () => {
  const navigate = useNavigate();
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

  return (
    <header className={styles.Header}>
      <button
        className={styles.backBtn}
        onClick={() => navigate("/")}
        aria-label="Voltar"
      >
        <IoArrowBackOutline className={styles.btnSbg} color={iconColor} />
      </button>
      <h2 className={styles.title}>Page</h2>
      <img className={styles.logo} src={logo} alt="4L" />
    </header>
  );
};

export default Header;