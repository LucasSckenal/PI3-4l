import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { useAccount } from "../../contexts/Account/AccountProvider";
import { useTranslation } from "react-i18next";

const getAgeFromBirthDate = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const generatePersonalizedMessages = (gender, age, t) => {
  const pronounKey =
    gender === "male" ? "male" : gender === "female" ? "female" : "other";
  const pronoun = t(`chat.personalizedMessages.pronouns.${pronounKey}`);
  const base = t("chat.personalizedMessages.base", {
    pronoun,
    age: age ?? "X",
  });

  return t("chat.personalizedMessages.headache", { base, returnObjects: true });
};

const QuickMessagesCarousel = ({ onSendMessage }) => {
  const { userData } = useAccount();
  const { t } = useTranslation();

  const age = getAgeFromBirthDate(userData?.birthDate);
  const gender = userData?.gender;

  const messages = generatePersonalizedMessages(gender, age, t);

  const [itemsPerSlide, setItemsPerSlide] = useState(() =>
    window.innerWidth >= 1024 ? 4 : 2
  );

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(window.innerWidth >= 1024 ? 4 : 2);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const groupedMessages = [];
  for (let i = 0; i < messages.length; i += itemsPerSlide) {
    groupedMessages.push(messages.slice(i, i + itemsPerSlide));
  }

  const totalPages = groupedMessages.length;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalPages);
    }, 5000);
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
