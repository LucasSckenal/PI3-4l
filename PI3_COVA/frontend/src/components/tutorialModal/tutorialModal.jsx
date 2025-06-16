import tutorial from "../../public/tutorial.mp4";
import tutorialMobile from "../../public/tutorialMobile.mp4";
import { useScreenResize } from "../../contexts/ScreenResizeProvider/ScreenResizeProvider"

import styles from "./styles.module.scss";
import { useEffect } from "react";

export default function TutorialModal({ isOpen, onClose, canClose }) {
  const { isMobile } = useScreenResize();
  
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVideoEnd = () => {
    const event = new CustomEvent("tutorialEnded");
    window.dispatchEvent(event);

    if (!canClose) {
      onClose();  
    }
  };

  const handleOverlayClick = () => {
    if (canClose) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {canClose && (
          <button className={styles.close} onClick={onClose}>
            ×
          </button>
        )}
        <video controls className={styles.video} onEnded={handleVideoEnd}>
          <source src={isMobile ? tutorialMobile : tutorial} type="video/mp4" />
          Seu navegador não suporta vídeo HTML5.
        </video>
      </div>
    </div>
  );
}
