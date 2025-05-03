import { useContext, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeProvider/ThemeProvider";
import styles from "./styles.module.scss";
import Divider from "../../components/Divider/Divider";
import SimpleModal from "../../components/SimpleModal/SimpleModal";

const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const handleModalClose1 = () => {
    setIsModalOpen1(false);
  };

  const handleModalClose2 = () => {
    setIsModalOpen2(false);
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

      <SimpleModal
        title="Modal 1"
        Text="Action 1 for Modal 1"
        Text2="Action 2 for Modal 1"
        textColor="black"
        textColor2="white"
        borderColor="blue"
        borderColor2="green"
        isOpen={isModalOpen1}
        isClose={handleModalClose1}
      />
      <div className={styles.OptionRow}>
        <button className={styles.Button} onClick={() => setIsModalOpen1(true)}>
          Limpar histórico de conversa
        </button>
      </div>
      <Divider width={"90%"} maxWidth={"250px"} />

      <SimpleModal
        title="Modal 2"
        Text="Action 1 for Modal 2"
        Text2="Action 2 for Modal 2"
        textColor="white"
        textColor2="yellow"
        borderColor="red"
        borderColor2="purple"
        isOpen={isModalOpen2}
        isClose={handleModalClose2}
      />
      <div className={styles.OptionRow}>
        <button className={styles.Button} onClick={() => setIsModalOpen2(true)}>
          Deslogar da conta
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
