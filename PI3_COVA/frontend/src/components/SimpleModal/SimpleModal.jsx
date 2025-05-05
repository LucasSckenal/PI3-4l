import React, { useState, useEffect } from "react";
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
  onConfirm,
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    if (isClose) isClose();
  };

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClickOutside}>
      <div className={styles.modalContent}>
        <p>{title}</p>
        <div className={styles.buttons}>
          <button
            className={styles.button}
            style={{ color: textColor, border: borderColor }}
            onClick={() => {
              if (onConfirm) onConfirm();
              handleClose();
            }}
          >
            {Text}
          </button>
          <button
            className={styles.button2}
            style={{ color: textColor2, border: borderColor2 }}
            onClick={handleClose}
          >
            {Text2}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleModal;
