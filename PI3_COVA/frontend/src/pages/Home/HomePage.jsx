import { useState, useEffect, useRef } from "react";

import { IoArrowForwardSharp } from "react-icons/io5";

import styles from "./styles.module.scss";

const HomePage = () => {
  const user = {
    name: "Johng Lee",
  };
  
  const history = {
    first: "25-05-01",
    second: "25-04-25",
    third: "25-04-20",
    fourth: "25-04-19",
  }

  const items = ["PI", "Estresse", "Insônia", "Depressão", "TDAH", "Fobia"];
  const itemWidth = 120; 
  const visibleItems = 3;
  const offsetToCenter = (itemWidth * visibleItems) / 2 - itemWidth / 2;

  const duplicatedItems = [
    items[items.length - 2],
    items[items.length - 1],
    ...items,
    items[0],
    items[1],
  ];

  const [currentIndex, setCurrentIndex] = useState(2); 
  const [transitioning, setTransitioning] = useState(true);
  const trackRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
      setTransitioning(true);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex === duplicatedItems.length - 2) {
      setTimeout(() => {
        setTransitioning(false);
        setCurrentIndex(2);
      }, 500);
    } else if (currentIndex === 1) {
      setTimeout(() => {
        setTransitioning(false);
        setCurrentIndex(duplicatedItems.length - 3);
      }, 500);
    } else {
      setTransitioning(true);
    }
  }, [currentIndex, duplicatedItems.length]);

  const getClassName = (index) => {
    if (index === currentIndex) return `${styles.CarroselItem} ${styles.CenterItem}`;
    if (index === currentIndex - 1 || index === currentIndex + 1)
      return `${styles.CarroselItem} ${styles.SideItem}`;
    return `${styles.CarroselItem}`;
  };

  return (
    <div className={styles.MainContainer}>
      <div className={styles.GreetingText}>
        <p>Bem-vindo</p>
        <h2>{user.name}</h2>
      </div>
      
      <div className={styles.InnerContainer}>
      <div className={styles.HeroBanner}>
        <button className={styles.chatButton}> COMEÇAR DIAGNÓSTICO <IoArrowForwardSharp size={30}/></button>
      </div>

      <div className={styles.Carrosel}>
        <div className={styles.CarroselViewport}>
          <div
            ref={trackRef}
            className={styles.CarroselTrack}
            style={{
              transform: `translateX(-${currentIndex * itemWidth - offsetToCenter}px)`,
              transition: transitioning ? "transform 0.5s ease-in-out" : "none",
            }}
          >
            {duplicatedItems.map((item, index) => (
              <div key={index} className={getClassName(index)}>
                {item}
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      <div className={styles.History}>
        <div className={styles.HistoryHeader}>
          <p>Histórico recente: </p>
          <button className={styles.ViewMoreButton}>Ver todos</button>
        </div>
        <div className={styles.InnerHistory}>
          <div className={styles.box}>1. {history.first}</div>
          <div className={styles.box}>2. {history.second}</div>
          <div className={styles.box}>3. {history.third}</div>
          <div className={styles.box}>4. {history.fourth}</div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
