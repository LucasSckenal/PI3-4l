import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, saveUserBasicInfo } from "../../../api/firebase";
import { useAuth } from "../../../contexts/AuthProvider/AuthProvider";
import { useScreenResize } from "../../../contexts/ScreenResizeProvider/ScreenResizeProvider";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { toast } from "react-toastify";

import { IoEye, IoEyeOff } from "react-icons/io5";

import GoogleIcon from "../../../public/Google icon.webp";
import LoginPageImg from "../../../public/LoginPage.png";
import LoginPageImgWeb from "../../../public/AuthPage_Web_1920x1080.png";

import styles from "./styles.module.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isMobile } = useScreenResize();

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (user) {
      navigate(user.role === "doctor" ? "/doctor/home" : "/", { replace: true });
    }
  }, [user, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Faz login no Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 2. Verificação imediata
      if (!userCredential?.user) {
        throw new Error("Autenticação falhou");
      }

      // 3. Feedback para o usuário
      toast.success("Login realizado com sucesso!");
      
      // O useEffect vai lidar com o redirecionamento quando o user mudar no contexto
    } catch (error) {
      toast.error("Erro ao fazer login: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const role = user.role ?? "user";

      await saveUserBasicInfo({
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
        uid: user.uid,
        role,
      });

      toast.success("Login com Google bem-sucedido!");
      // O useEffect vai lidar com o redirecionamento quando o user mudar no contexto
    } catch (error) {
      console.error("Erro no login com Google:", error);
      toast.error("Erro ao entrar com Google: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputs = () => (
    <>
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
    </>
  );

  const renderButtons = () => (
    <>
      <button
        className={styles.loginBtn}
        onClick={handleEmailLogin}
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "LOGAR"}
      </button>

      <div className={styles.redirect}>
        <p>Usuário novo?</p>
        <p className={styles.navigateBtn} onClick={() => navigate("/register")}>
          Registrar-se
        </p>
      </div>

      <div className={styles.bottomPage}>
        <span>──── ou ────</span>
        <button className={styles.google} onClick={handleGoogleLogin} disabled={isLoading}>
          <img src={GoogleIcon} alt="Login com Google" />
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className={styles.loginContainer}>
        <img src={LoginPageImg} alt="" className={styles.bgImg} />
        <h1 className={styles.title}>Bem-vindo de volta!</h1>
        {renderInputs()}
        {renderButtons()}
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <img src={LoginPageImgWeb} alt="" className={styles.bgImg} />
      <h1 className={styles.title}>Bem-vindo de volta!</h1>
      {renderInputs()}
      {renderButtons()}
    </div>
  );
};

export default LoginPage;
