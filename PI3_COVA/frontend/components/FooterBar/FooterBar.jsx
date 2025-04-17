import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoHome,
  IoPerson,
  IoReceiptSharp,
  IoSettingsSharp,
  IoChatbubbles
} from "react-icons/io5";
import styles from "./styles.module.scss";

const FooterBar = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const navigate = useNavigate();

  const navItems = [
    { icon: <IoReceiptSharp />, path: "history" },
    { icon: <IoChatbubbles />, path: "chat" },
    { icon: <IoHome />, path: "/" },
    { icon: <IoPerson />, path: "profile" },
    { icon: <IoSettingsSharp />, path: "settings" }
  ];

  const handleSelect = (index, path) => {
    setActiveIndex(index);
    navigate(path);
  };

  return (
    <footer className={styles.FooterBar}>
      <ul className={styles.bar}>
        {navItems.map((item, index) => (
          <li
            key={index}
            className={activeIndex === index ? styles.selected : ""}
            onClick={() => handleSelect(index, item.path)}
          >
            {item.icon}
          </li>
        ))}
      </ul>
    </footer>
  );
};

export default FooterBar
