import { useMemo } from "react";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import {
  IoHome,
  IoPerson,
  IoSettingsSharp,
  IoChatbubbles,
  IoFileTrayFull,
} from "react-icons/io5";

import { useAccount } from "../../contexts/Account/AccountProvider";
import styles from "./styles.module.scss";

const FooterBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAccount();

  const navItems = useMemo(
    () => [
      { icon: <IoFileTrayFull />, path: "/history" },
      { icon: <IoChatbubbles />, path: "/chat" },
      { icon: <IoHome />, path: "/" },
      { icon: <IoPerson />, path: "/profile" },
      { icon: <IoSettingsSharp />, path: "/settings" },
    ],
    []
  );

  const activeIndex = useMemo(() => {
    return navItems.findIndex((item) =>
      matchPath(item.path, location.pathname)
    );
  }, [location.pathname, navItems]);

  const handleSelect = (path) => {
    navigate(path);
  };

  const isProfileIncomplete = useMemo(() => {
    if (!userData) return false;
    const requiredFields = [
      "email",
      "location",
      "birthDate",
      "phone",
      "gender",
    ];
    return requiredFields.some((field) => !userData[field]);
  }, [userData]);

  return (
    <footer className={styles.FooterBar}>
      <ul className={styles.bar}>
        {navItems.map((item, index) => (
          <li
            key={index}
            className={index === activeIndex ? styles.selected : ""}
            onClick={() => handleSelect(item.path)}
          >
            {item.icon}
            {item.path === "/profile" && isProfileIncomplete && (
              <span className={styles.notificationDot}></span>
            )}
          </li>
        ))}
      </ul>
    </footer>
  );
};

export default FooterBar;
