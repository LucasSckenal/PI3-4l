import styles from "./styles.module.scss";
import FooterBar from "../FooterBar/FooterBar";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const MainPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.container}>
      {!isMobile && <Sidebar />}
      <div className={styles.innerContainer}>
        {isMobile && <Header />}
        <Outlet />
        {isMobile && <FooterBar />}
      </div>
    </div>
  );
};

export default MainPage;
