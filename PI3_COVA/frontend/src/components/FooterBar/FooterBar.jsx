/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo} from "react";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import {
  IoHome,
  IoPerson,
  IoSettingsSharp,
  IoChatbubbles,
  IoFileTrayFull,
} from "react-icons/io5";
import { LuFilePenLine } from "react-icons/lu";

import { useAuth } from "../../contexts/AuthProvider/AuthProvider";
import { useAccount } from "../../contexts/Account/AccountProvider";
import styles from "./styles.module.scss";

const FooterBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAccount();
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role;
  const userId = user.uid; 


  const navItems = useMemo(() => {
    if (!role) {
      return [
        { icon: <IoHome />, path: "/" },
        { icon: <IoSettingsSharp />, path: "/settings" },
      ];
    }

    if (role === "doctor") {
      return [
        { icon: <LuFilePenLine />, path: "/analysis" },
        { icon: <IoPerson />, path: `/profile/${userId}` },
        { icon: <IoHome />, path: "/doctor/home" },
        { icon: <IoSettingsSharp />, path: "/settings" },
      ];
    }

    return [
      { icon: <IoFileTrayFull />, path: "/history" },
      { icon: <IoChatbubbles />, path: "/chat" },
      { icon: <IoHome />, path: "/" },
      { icon: <IoPerson />, path: "/profile" },
      { icon: <IoSettingsSharp />, path: "/settings" },
    ];
  }, [role]);

  const activeIndex = useMemo(() => {
    return navItems.findIndex((item) =>
      matchPath(item.path, location.pathname)
    );
  }, [location.pathname, navItems]);

  const handleSelect = (path) => {
    navigate(path);
  };

  const isProfileIncomplete = useMemo(() => {
    if (role !== "user") return false;

    const requiredFields = [
      "email",
      "location",
      "birthDate",
      "phone",
      "gender",
    ];
    return requiredFields.some((field) => !userData?.[field]);
  }, [role, userData]);

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
