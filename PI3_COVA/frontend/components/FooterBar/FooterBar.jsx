import { useMemo } from "react";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import {
  IoHome,
  IoPerson,
  IoReceiptSharp,
  IoSettingsSharp,
  IoChatbubbles,
} from "react-icons/io5";

import styles from "./styles.module.scss";

const FooterBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = useMemo(
    () => [
      { icon: <IoReceiptSharp />, path: "/history" },
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
          </li>
        ))}
      </ul>
    </footer>
  );
};

export default FooterBar;
