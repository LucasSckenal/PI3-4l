import styles from "./styles.module.scss";
import FooterBar from "../FooterBar/FooterBar";
import Header from "../Header/Header";
import { Outlet } from "react-router-dom";

const MainPage = () => {
  return (
    <div className={styles.container}>
      <Header/>
      <div className={styles.innerContainer}>
        <Outlet /> 
      </div>
      <FooterBar />
    </div>
  );
};

export default MainPage;
