import { useState, useEffect } from "react";
import styles from "./PreferredColorModal.module.scss";
import { useTranslation } from "react-i18next";

const colorList = [
  "#4A90E2", // Blue
  "#60ba1c", // Green
  "#c97c55", // Brown/Orange
  "#7f41e2", // Purple (original default)
  "#F05D5E", // Red
  "#1ABC9C", // Turquoise
  "#bf9c0d", // Gold/Yellow
  "#db60a4", // Pink
  "#0c9947", // Dark Green
  "#d62426", // Red
];

const PreferredColorModal = ({
  isOpen,
  onClose,
  currentColor,
  onColorChange,
}) => {
  // Initialize selectedColor with currentColor or a fallback, ensuring consistency
  const [selectedColor, setSelectedColor] = useState(currentColor || "#7f41e2");
  const { t } = useTranslation();

  useEffect(() => {
    // This effect runs whenever selectedColor changes
    // It updates the CSS variable and localStorage
    document.documentElement.style.setProperty(
      "--PreferredColor",
      selectedColor
    );
    localStorage.setItem("preferredColor", selectedColor);
  }, [selectedColor]);

  // Update selectedColor if currentColor (from parent) changes
  useEffect(() => {
    setSelectedColor(currentColor || "#7f41e2");
  }, [currentColor]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSave = () => {
    // Only call onColorChange if the color has actually changed
    if (selectedColor !== currentColor) {
      onColorChange(selectedColor);
    }
    onClose();
  };

  const handleClickOutside = (e) => {
    // Close modal only if the click is directly on the overlay
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.Overlay} onClick={handleClickOutside}>
      <div className={styles.Modal}>
        <button className={styles.CloseButton} onClick={onClose} aria-label={t("modal.close")}>
          &times;
        </button>
        <h2>{t("modal.selectPreferredColor")}</h2> {/* Removed duplicate h2 tag */}
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
                  role="button" // Improve accessibility
                  aria-label={`${t("modal.selectColor")} ${color}`}
                  tabIndex="0" // Make div focusable
                  onKeyDown={(e) => { // Allow selection with Enter/Space key
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleColorSelect(color);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <button className={styles.SaveButton} onClick={handleSave}>
          {t("modal.save")}
        </button>
      </div>
    </div>
  );
};

export default PreferredColorModal;