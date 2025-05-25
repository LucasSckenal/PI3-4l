import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../contexts/ThemeProvider/ThemeProvider";
import { useTranslation } from "react-i18next";
import PreferredColorModal from "../../components/PreferredColorModal/PreferredColorModal";
import SimpleModal from "../../components/SimpleModal/SimpleModal";
import AboutModal from "../../components/AboutUsModal/AboutUsModal";
import styles from "./styles.module.scss";
import { getAuth, signOut } from "firebase/auth";

const SettingsPage = () => {
  const {
    isDarkMode,
    toggleTheme,
    preferredColor,
    handleColorChange,
    preferredLanguage,
    handleLanguageChange,
  } = useContext(ThemeContext);

  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(preferredLanguage);
  }, [preferredLanguage, i18n]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      console.log("Usuário deslogado com sucesso!");
    } catch (error) {
      console.error("Erro ao deslogar:", error.message);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.grid}>
        <div className={styles.card}>
          <span>{t("settings.darkMode")}</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.card}>
          <span>{t("settings.language")}</span>
          <select
            className={styles.select}
            value={preferredLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="" hidden="true">
              {t("settings.select")}
            </option>
            <option value="pt">{t("settings.portuguese")}</option>
            <option value="en">{t("settings.english")}</option>
            <option value="es">{t("settings.spanish")}</option>
          </select>
        </div>

        <div className={styles.card}>
          <span>{t("settings.preferredColor")}</span>
          <button
            onClick={() => setIsColorModalOpen(true)}
            className={styles.primaryButton}
          >
            {t("settings.chooseColor")}
          </button>
        </div>

        <div className={styles.card}>
          <span>{t("settings.logout")}</span>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className={styles.dangerButton}
          >
            {t("settings.logout")}
          </button>
        </div>

        <button
          onClick={() => setIsAboutUsOpen(true)}
          className={styles.AboutBtn}
        >
          {t("settings.aboutUs")}
        </button>
      </section>

      <PreferredColorModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        currentColor={preferredColor}
        onColorChange={handleColorChange}
      />

      <SimpleModal
        title={t("settings.logoutConfirm")}
        Text={t("settings.yes")}
        Text2={t("settings.cancel")}
        textColor="red"
        textColor2="white"
        borderColor="1px solid red"
        borderColor2="1px solid white"
        isOpen={isLogoutModalOpen}
        isClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      {isAboutUsOpen && (
        <AboutModal
          isOpen={isAboutUsOpen}
          onClose={() => setIsAboutUsOpen(false)}
        />
      )}
    </main>
  );
};

export default SettingsPage;
