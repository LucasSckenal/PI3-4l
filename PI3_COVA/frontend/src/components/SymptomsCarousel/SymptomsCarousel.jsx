import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

const SymptomsCarousel = ({ symptoms }) => {
  const trackRef = useRef(null);
  const [internalIndex, setInternalIndex] = useState(2);
  const [viewportWidth, setViewportWidth] = useState(500);

  const itemWidth = 90;
  const itemMargin = 35;
  const itemTotalWidth = itemWidth + itemMargin;

  // Clones para loop infinito
  const extendedSymptoms = [
    ...symptoms.slice(-2),
    ...symptoms,
    ...symptoms.slice(0, 2),
  ];

  // Detecta mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // Atualiza largura do viewport dinamicamente para responsividade
  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth <= 768) {
        setViewportWidth(window.innerWidth * 0.9); // 90% da largura da tela no mobile
      } else {
        setViewportWidth(500); // desktop (não mostra, mas mantém padrão)
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Auto-play somente em mobile e se tiver mais de 1 sintoma
  useEffect(() => {
    if (!isMobile || symptoms.length <= 1) return;
    const interval = setInterval(() => {
      setInternalIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [symptoms, isMobile]);

  // Controle de loop infinito com reset sem transição
  useEffect(() => {
    if (!trackRef.current) return;

    const totalRealItems = symptoms.length;

    if (internalIndex >= totalRealItems + 2) {
      trackRef.current.style.transition = "none";
      setInternalIndex(2);
      return;
    }

    if (internalIndex <= 1) {
      trackRef.current.style.transition = "none";
      setInternalIndex(totalRealItems + 1);
      return;
    }

    trackRef.current.style.transition = "transform 0.5s ease-in-out";
  }, [internalIndex, symptoms.length]);

  if (!isMobile) return null;

  // Ajuste do translateX para centralizar o item ativo (que está no meio)
  // Queremos que o translate leve o item ativo para o centro do viewport
  // Calculando o deslocamento:
  // metade da viewport - metade do item ativo - distância até o item ativo (internalIndex * itemTotalWidth)
  const translateX =
    -internalIndex * itemTotalWidth + viewportWidth / 2 - itemTotalWidth / 2;

  return (
    <div className={styles.Carrosel}>
      <div className={styles.CarroselViewport} style={{ width: viewportWidth }}>
        <div
          ref={trackRef}
          className={styles.CarroselTrack}
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {extendedSymptoms.map((symptom, index) => {
            // Agora o active é o do meio (internalIndex)
            const isCenter = index === internalIndex;
            const isSide =
              index === internalIndex - 1 || index === internalIndex + 1;

            const classNames = [styles.CarroselItem];
            if (isCenter) classNames.push(styles.CenterItem);
            else if (isSide) classNames.push(styles.SideItem);

            return (
              <div key={`${symptom}-${index}`} className={classNames.join(" ")}>
                {symptom}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SymptomsCarousel;
