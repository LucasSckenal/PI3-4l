import styles from "./styles.module.scss";

const CalendarModal = ({ onClose, children }) => {
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default CalendarModal;