import { useState, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeProvider/ThemeProvider";
import { useAuth } from "../../contexts/AuthProvider/AuthProvider";
import PreferredColorModal from "../../components/PreferredColorModal/PreferredColorModal";
import Divider from "../../components/Divider/Divider";
import SimpleModal from "../../components/SimpleModal/SimpleModal";
import styles from "./styles.module.scss";
import { getAuth, signOut } from "firebase/auth";

const SettingsPage = () => {
  const { isDarkMode, toggleTheme, preferredColor, handleColorChange } =
    useContext(ThemeContext);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isSimpleModalOpen, setIsSimpleModalOpen] = useState(false);
  const { user } = useAuth();

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
    <div className={styles.SettingsContainer}>
      <h1 className={styles.Title}>GERAL</h1>

      <div className={styles.OptionRow}>
        <span>Dark Mode</span>
        <label className={styles.Switch}>
          <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
          <span className={styles.Slider}></span>
        </label>
      </div>

      <Divider width={"90%"} maxWidth={"250px"} />

      <div className={styles.OptionRow}>
        <button
          className={styles.ButtonColor}
          onClick={() => setIsColorModalOpen(true)}
        >
          Escolher cor preferida
        </button>
      </div>

      <Divider width={"90%"} maxWidth={"250px"} />

      <PreferredColorModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        currentColor={preferredColor}
        onColorChange={(color) => {
          handleColorChange(color);
        }}
      />

      <div className={styles.OptionRow}>
        <button
          className={styles.Button}
          onClick={() => setIsSimpleModalOpen(true)}
        >
          Sair da conta
        </button>
      </div>

      <SimpleModal
        title="Tem certeza que deseja sair?"
        Text="Sim"
        Text2="Cancelar"
        textColor="red"
        textColor2="white"
        borderColor="1px solid red"
        borderColor2="1px solid white"
        isOpen={isSimpleModalOpen}
        isClose={() => setIsSimpleModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default SettingsPage;
