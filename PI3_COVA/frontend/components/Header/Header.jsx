import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import logo from "../../public/logo4L.png";
import styles from "./styles.module.scss";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className={styles.Header}>
      <button
        className={styles.backBtn}
        onClick={() => navigate(-1)}
        aria-label="Voltar"
      >
        <IoArrowBackOutline className={styles.btnSbg} color="white" />
      </button>
      <h2 className={styles.title}>Placeholder massa</h2>
      <img className={styles.logo} src={logo} alt="4L" />
    </header>
  );
};

export default Header;
