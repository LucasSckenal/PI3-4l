import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../api/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";

import { IoEye, IoEyeOff } from "react-icons/io5";

import GoogleIcon from "../../../public/Google icon.webp";
import LoginPageImg from "../../../public/LoginPage.png";

import styles from "./styles.module.scss";

const LoginPage = () => {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login realizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.log("Erro ao fazer login: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth);
      toast.success("Login com Google bem-sucedido!");
      navigate("/");
    } catch (error) {
      toast.error("Erro ao entrar com Google: " + error.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <img src={LoginPageImg} alt="" className={styles.bgImg} />
      <h1 className={styles.title}>Bem-vindo de volta!</h1>
      <input
        className={styles.inputLogin}
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className={styles.Pass}>
        <input
          className={styles.inputLogin}
          placeholder="Senha"
          type={isVisible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span onClick={() => setIsVisible(!isVisible)} className={styles.icon}>
          {isVisible ? <IoEyeOff /> : <IoEye />}
        </span>
      </div>
      <div className={styles.bottomLogin}>
        <input type="checkbox" name="RememberMe" id="RememberMe" />
        <label htmlFor="RememberMe">Manter conectado</label>
        <p className={styles.navigateBtn}>Esqueci a senha</p>
      </div>
      <button className={styles.loginBtn} onClick={handleEmailLogin}>
        LOGAR
      </button>
      <div className={styles.redirect}>
        <p>Usuário novo?</p>
        <p
          className={styles.navigateBtn}
          onClick={() => {
            navigate("/register");
          }}
        >
          Registrar-se
        </p>
      </div>
      <div className={styles.bottomPage}>
        <span>──── ou ────</span>
        <button className={styles.google} onClick={handleGoogleLogin}>
          <img src={GoogleIcon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
