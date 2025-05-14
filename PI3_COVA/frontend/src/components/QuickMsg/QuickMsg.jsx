import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { useAccount } from "../../contexts/Account/AccountProvider";

const getAgeFromBirthDate = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const generatePersonalizedMessages = (gender, age) => {
  const pronoun =
    gender === "male"
      ? "um homem"
      : gender === "female"
      ? "uma mulher"
      : "uma pessoa";

  const subject = `Sou ${pronoun} de ${age} anos`;

  return [
    `${subject} e tenho dor de cabeça intensa de um lado, frequentemente com náuseas.`,
    `${subject} e as dores pioram com esforço físico ou movimento rápido.`,
    `${subject} e fico sensível à luz e ao som durante as crises.`,
    `${subject} e as dores podem durar de horas a dias, e frequentemente são latejantes.`,
    `${subject} e os analgésicos nem sempre aliviam completamente a dor.`,
    `${subject} e as crises podem vir acompanhadas de tontura e dificuldade de concentração.`,
    `${subject} e costumo me isolar em um ambiente escuro quando as dores começam.`,
    `${subject} e já precisei faltar a compromissos devido à intensidade das crises.`,
    `${subject} e as crises de dor de cabeça têm ficado mais frequentes ultimamente.`,
    `${subject} e, frequentemente, sinto distúrbios visuais, como visão turva ou flashes.`,
    `${subject} e as dores começam com uma sensação de pressão ou formigamento em um lado da cabeça.`,
    `${subject} e as dores são tão fortes que dificultam o sono e o descanso.`,
    `${subject} e, algumas vezes, a dor é acompanhada de rigidez no pescoço ou ombros.`,
    `${subject} e percebo que o estresse e a mudança de temperatura agravam as crises.`,
  ];
};

const QuickMessagesCarousel = ({ onSendMessage }) => {
  const { userData } = useAccount();
  const age = getAgeFromBirthDate(userData?.birthDate);
  const gender = userData?.gender;

  const messages = generatePersonalizedMessages(gender, age);
  const groupedMessages = [];
  for (let i = 0; i < messages.length; i += 2) {
    groupedMessages.push(messages.slice(i, i + 2));
  }

  const totalPages = groupedMessages.length;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalPages);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalPages]);

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
