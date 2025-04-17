import styles from "./styles.module.scss";
import FooterBar from "../FooterBar/FooterBar";
import { Outlet } from "react-router-dom";

const MainPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <Outlet /> {/* <- Aqui será injetado o conteúdo da rota (chat, profile, etc.) */}
      </div>
      <FooterBar />
    </div>
  );
};

export default MainPage;
