import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  saveUserBasicInfo,
  updateDoctorOnlineStatus,
  fetchUserBasicInfo,
} from "../../../api/firebase";
import { useAuth } from "../../../contexts/AuthProvider/AuthProvider";
import { useScreenResize } from "../../../contexts/ScreenResizeProvider/ScreenResizeProvider";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
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
  const { isMobile } = useScreenResize();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      // Define persistência de acordo com rememberMe
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      // Login com email e senha
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!userCredential?.user) {
        throw new Error("Autenticação falhou");
      }

      // Se for médico, marca online
      const userDoc = await fetchUserBasicInfo(userCredential.user.uid);
      if (userDoc?.role === "doctor") {
        await updateDoctorOnlineStatus(userCredential.user.uid, true);
      }

      toast.success("Login realizado com sucesso!");
      // redirecionamento será feito pelo useEffect de user
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
      const userFb = result.user;
      const role = userFb.role ?? "user";

      await saveUserBasicInfo(userFb.uid, {
        email: userFb.email,
        name: userFb.displayName,
        photo: userFb.photoURL,
        role,
      });

      toast.success("Login com Google bem-sucedido!");
      // redirecionamento idem
    } catch (error) {
      console.error("Erro no login com Google:", error);
      toast.error("Erro ao entrar com Google: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.warn("Por favor, insira seu email para redefinir a senha.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Email de redefinição de senha enviado!");
    } catch (error) {
      toast.error("Erro ao enviar o email: " + error.message);
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
        <span
          onClick={() => setIsVisible(!isVisible)}
          className={styles.icon}
        >
          {isVisible ? <IoEyeOff /> : <IoEye />}
        </span>
      </div>

      <div className={styles.bottomLogin}>
        <label htmlFor="RememberMe">
          <input
            type="checkbox"
            id="RememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Manter conectado
        </label>
        <p
          className={styles.navigateBtn}
          onClick={handleForgotPassword}
          style={{ cursor: "pointer" }}
        >
          Esqueci a senha
        </p>
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
        <p
          className={styles.navigateBtn}
          onClick={() => navigate("/register")}
        >
          Registrar-se
        </p>
      </div>

      <div className={styles.bottomPage}>
        <span>──── ou ────</span>
        <button
          className={styles.google}
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <img src={GoogleIcon} alt="Login com Google" />
        </button>
      </div>
    </>
  );

  // JSX final
  return (
    <div className={styles.loginContainer}>
      <img
        src={isMobile ? LoginPageImg : LoginPageImgWeb}
        alt=""
        className={styles.bgImg}
      />
      <h1 className={styles.title}>Bem-vindo de volta!</h1>
      {renderInputs()}
      {renderButtons()}
    </div>
  );
};

export default LoginPage;
