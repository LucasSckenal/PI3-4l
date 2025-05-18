import styles from "./styles.module.scss";
import { useState } from "react";
import {
  IoHomeOutline,
  IoChatbubbleEllipsesOutline,
  IoPersonOutline,
  IoTimeOutline,
  IoSettingsOutline,
  IoMenu,
} from "react-icons/io5";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { icon: <IoHomeOutline />, label: "Home", path: "/" },
    { icon: <IoTimeOutline />, label: "History", path: "/history" },
    { icon: <IoChatbubbleEllipsesOutline />, label: "Chat", path: "/chat" },
    { icon: <IoPersonOutline />, label: "Profile", path: "/profile" },
    { icon: <IoSettingsOutline />, label: "Settings", path: "/settings" },
  ];

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.topSection}>
        <button className={styles.menuButton} onClick={() => setIsOpen(!isOpen)}>
          <IoMenu />
        </button>
      </div>
      <ul className={styles.menu}>
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link to={item.path} className={styles.menuItem}>
              {item.icon}
              {isOpen && <span className={styles.label}>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
