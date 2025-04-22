// SettingsPage.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeProvider/ThemeProvider";
import styles from "./styles.module.scss";
import Divider from "../../components/Divider/Divider";

const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={styles.SettingsContainer}>
      <h1 className={styles.Title}>GERAL</h1>
      <div className={styles.OptionRow}>
        <span>Dark Mode</span>
        <label className={styles.Switch}>
          <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
          <span className={styles.Slider}></span>
        </label>
      </div>
      <Divider width={"90%"} />
      <div className={styles.OptionRow}>
        <button className={styles.Button}>Limpar histórico de conversa</button>
      </div>
      <Divider width={"90%"} />
      <div className={styles.OptionRow}>
        <button className={styles.Button}>Deslogar da conta</button>
      </div>{" "}
      <Divider width={"90%"} />
    </div>
  );
};

export default SettingsPage;
