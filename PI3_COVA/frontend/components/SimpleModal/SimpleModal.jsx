import styles from "./styles.module.scss";

const SimpleModal = ({ title, Text, Text2 }) => {
    return (
      <div className={styles.modal}>
        <p>{title}</p>
        <div className={styles.buttons}>
          <button className={styles.button}>{Text}</button>
          <button className={styles.button2}>{Text2}</button>
        </div>
      </div>
    );
  };
  
  export default SimpleModal;  