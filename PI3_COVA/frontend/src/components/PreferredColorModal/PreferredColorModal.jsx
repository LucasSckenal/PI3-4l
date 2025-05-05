import { useState, useEffect } from "react";
import styles from "./PreferredColorModal.module.scss";

const colorList = [
  "#7f41e2",
  "#f44336",
  "#2196f3",
  "#4caf50",
  "#ff9800",
  "#9c27b0",
  "#00bcd4",
  "#b8aa31",
  "#795548",
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
            <h3>Cores Predefinidas</h3>
            <div className={styles.ColorList}>
              {colorList.map((color, index) => (
                <div
                  key={index}
                  className={styles.ColorOption}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
          </div>
          <div className={styles.ColorPickerWrapper}>
            <h3>Ou escolha a sua própria</h3>
            <div className={styles.ColorPickerSection}>
              <input
                type="color"
                className={styles.ColorPicker}
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              />
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
