import { useState, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeProvider/ThemeProvider";
import PreferredColorModal from "../../components/PreferredColorModal/PreferredColorModal";
import SimpleModal from "../../components/SimpleModal/SimpleModal";
import styles from "./styles.module.scss";
import { getAuth, signOut } from "firebase/auth";

const SettingsPage = () => {
  const { isDarkMode, toggleTheme, preferredColor, handleColorChange } =
    useContext(ThemeContext);

  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
          <span>Modo Escuro</span>
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
          <span>Idioma</span>
          <select className={styles.select}>
            <option>Selecione</option>
            <option value="pt">Português</option>
            <option value="en">Inglês</option>
            <option value="es">Espanhol</option>
          </select>
        </div>

        <div className={styles.card}>
          <span>Cor Preferida</span>
          <button
            onClick={() => setIsColorModalOpen(true)}
            className={styles.primaryButton}
          >
            Escolher cor
          </button>
        </div>

        <div className={styles.card}>
          <span>Sair da conta</span>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className={styles.dangerButton}
          >
            Sair
          </button>
        </div>
      </section>

      <PreferredColorModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        currentColor={preferredColor}
        onColorChange={handleColorChange}
      />

      <SimpleModal
        title="Tem certeza que deseja sair?"
        Text="Sim"
        Text2="Cancelar"
        textColor="red"
        textColor2="white"
        borderColor="1px solid red"
        borderColor2="1px solid white"
        isOpen={isLogoutModalOpen}
        isClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </main>
  );
};

export default SettingsPage;
