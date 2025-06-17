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
import { LuFilePenLine } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthProvider/AuthProvider";
import { useNotification } from "../../contexts/NotifyProvider/NotifyProvider";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();
  const { user } = useAuth();
  const { hasNewAnalysis } = useNotification();


  if (!user) return null;

  const role = user.role;
  const userId = user.uid; 

  const commonItems = [
    {
      icon: <IoSettingsOutline />,
      label: t("sidebar.settings"),
      path: "/settings",
    },
  ];

  const userItems = [
    { icon: <IoHomeOutline />, label: t("sidebar.home"), path: "/" },
    { icon: <IoTimeOutline />, label: t("sidebar.history"), path: "/history" },
    {
      icon: <IoChatbubbleEllipsesOutline />,
      label: t("sidebar.chat"),
      path: "/chat",
    },
    {
      icon: <IoPersonOutline />,
      label: t("sidebar.profile"),
      path: `/profile`, 
    },
  ];

  const doctorItems = [
    {
      icon: <IoHomeOutline />,
      label: t("sidebar.consultationHome"),
      path: "/doctor/home",
    },
    {
      icon: <IoPersonOutline />,
      label: t("sidebar.doctorProfile"),
      path: `/profile/${userId}`,
    },
    {
      icon: <LuFilePenLine />,
      label: t("sidebar.consultationAnalysis"),
      path: "/analysis",
    },
  ];

  const menuItems =
    role === "user"
      ? [...userItems, ...commonItems]
      : [...doctorItems, ...commonItems];

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
              <div className={styles.iconContainer}>
                <span className={styles.icon}>{item.icon}</span>
                {item.path === "/" && hasNewAnalysis && (
                  <span className={styles.notificationDot}></span>
                )}
              </div>
              {isOpen && <span className={styles.label}>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;