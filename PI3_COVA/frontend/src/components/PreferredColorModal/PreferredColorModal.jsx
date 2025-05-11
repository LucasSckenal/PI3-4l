import { useState, useEffect } from "react";
import styles from "./PreferredColorModal.module.scss";

const colorList = [
  "#4A90E2",
  "#7ED321",
  "#c97c55",
  "#9B59B6",
  "#F05D5E",
  "#1ABC9C",
  "#bf9c0d",
  "#F78FB3",
  "#7E9D7E",
];

const PreferredColorModal = ({ isOpen, onClose }) => {
  const [selectedColor, setSelectedColor] = useState(
    localStorage.getItem("preferredColor") || "#7f41e2"
  );

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--PreferredColor",
      selectedColor
    );
    localStorage.setItem("preferredColor", selectedColor);
  }, [selectedColor]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSave = () => {
    onClose();
  };

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.Overlay} onClick={handleClickOutside}>
      <div className={styles.Modal}>
        <button className={styles.CloseButton} onClick={onClose}>
          &times;
        </button>
        <h2>Escolher Cor Preferida</h2>
        <div className={styles.ModalContent}>
          <div className={styles.ColorOptions}>
            <div className={styles.ColorList}>
              {colorList.map((color, index) => (
                <div
                  key={index}
                  className={`${styles.ColorOption} ${
                    selectedColor === color ? styles.SelectedColor : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
          </div>
        </div>
        <button className={styles.SaveButton} onClick={handleSave}>
          Salvar
        </button>
      </div>
    </div>
  );
};

export default PreferredColorModal;
