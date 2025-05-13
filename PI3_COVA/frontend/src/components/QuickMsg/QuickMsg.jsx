import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

const quickMessages = [
  "Minhas dores de cabeça são localizadas na lateral da cabeça.",
  "Tenho dor de cabeça moderada acompanhada de náusea.",
  "Sinto sensibilidade à luz durante as crises.",
  "Tenho crises frequentes, com dor pulsátil de um lado só.",
  "Costumo sentir aura visual antes da dor começar.",
  "As dores pioram com atividade física ou estresse.",
  "Tenho episódios que duram várias horas seguidas.",
  "Sinto tontura e visão embaçada junto da dor.",
  "Já precisei ficar em ambientes escuros por causa da dor.",
  "Tomo analgésicos com frequência, mas nem sempre funcionam.",
];


const QuickMessagesCarousel = ({ onSendMessage }) => {
  const [index, setIndex] = useState(0);
  const totalPages = Math.ceil(quickMessages.length / 2);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalPages);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalPages]);

  const groupedMessages = [];
  for (let i = 0; i < quickMessages.length; i += 2) {
    groupedMessages.push(quickMessages.slice(i, i + 2));
  }

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel}>
        <div
          className={styles.slideWrapper}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {groupedMessages.map((group, idx) => (
            <div className={styles.slide} key={idx}>
              {group.map((text, i) => (
                <button
                  key={i}
                  className={styles.button}
                  onClick={() => onSendMessage(text)}
                >
                  {text}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dots}>
        {groupedMessages.map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickMessagesCarousel;
