import React, { useState } from "react";
import styles from "./styles.module.scss";

const SimpleModal = ({
  title,
  Text,
  Text2,
  textColor,
  textColor2,
  borderColor,
  borderColor2,
  isOpen,
  isClose,
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  const handleClose = () => {
    setIsVisible(false);
    if (isClose) isClose();
  };

  if (!isVisible) return null;

  return (
    <div className={styles.modal}>
      <p>{title}</p>
      <div className={styles.buttons}>
        <button
          className={styles.button}
          style={{ color: textColor, border: borderColor }}
        >
          {Text}
        </button>
        <button
          className={styles.button2}
          style={{ color: textColor2, border: borderColor2 }}
        >
          {Text2}
        </button>
      </div>
      <button className={styles.closeButton} onClick={handleClose}>
        Close
      </button>
    </div>
  );
};

export default SimpleModal;
