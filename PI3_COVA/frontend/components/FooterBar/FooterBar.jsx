import { useState } from "react";
import { IoHome, IoPerson, IoReceiptSharp, IoSettingsSharp, IoChatbubbles } from "react-icons/io5";
import styles from "./styles.module.scss";

const FooterBar = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleSelect = (index) => {
    setActiveIndex(index);
  };

  return (
    <footer className={styles.FooterBar}>
      <ul className={styles.bar}>
        {[
          <IoReceiptSharp />,
          <IoChatbubbles />,
          <IoHome />,
          <IoPerson />,
          <IoSettingsSharp />
        ].map((icon, index) => (
          <li
            key={index}
            className={activeIndex === index ? styles.selected : ""}
            onClick={() => handleSelect(index)}
          >
            {icon}
          </li>
        ))}
      </ul>
    </footer>
  );
};

export default FooterBar;
