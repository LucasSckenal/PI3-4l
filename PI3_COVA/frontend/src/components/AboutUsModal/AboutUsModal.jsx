import styles from "./styles.module.scss";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import photo1 from "../../public/lucas.png";
import photo2 from "../../public/Luan.jpg";
import { useTranslation } from "react-i18next";

const team = [
  {
    name: "Lucas Sckenal",
    role: "Dev full stack",
    linkedin: "https://www.linkedin.com/in/lucassckenal/",
    instagram: "https://www.instagram.com/lucas.sckenal/",
    photo: photo1,
  },
  {
    name: "Luan Vitor C. D.",
    role: "Dev full stack",
    linkedin: "https://www.linkedin.com/in/luan-vitor-casali-dallabrida/",
    photo: photo2,
  },
];

export default function AboutModal({ isOpen, onClose }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{t("aboutModal.title")}</h2>
        <div className={styles.team}>
          {team.map((person) => (
            <div className={styles.card} key={person.name}>
              <img
                src={person.photo}
                alt={t("aboutModal.photoAlt", { name: person.name })}
                className={styles.photo}
              />
              <h3>{person.name}</h3>
              <p>{person.role}</p>
              <div className={styles.socials}>
                <a href={person.linkedin} target="_blank" rel="noreferrer">
                  <FaLinkedin />
                </a>
                {person.instagram && (
                  <a href={person.instagram} target="_blank" rel="noreferrer">
                    <FaInstagram />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          {t("aboutModal.closeBtn")}
        </button>
      </div>
    </div>
  );
}
