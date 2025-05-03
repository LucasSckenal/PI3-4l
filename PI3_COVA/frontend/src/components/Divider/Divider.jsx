import styles from "./styles.module.scss";

const Divider = ({ width, maxWidth}) => {
  return <div className={styles.divider} style={{ width: width, maxWidth: maxWidth }}></div>;
};

export default Divider;
