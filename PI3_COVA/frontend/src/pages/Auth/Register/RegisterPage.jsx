import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../api/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./styles.module.scss";
import LoginPageImg from "../../../public/LoginPage.png";
import defaultProfileIcon from "../../../public/UserDefault.webp";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result); // base64 temporária
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    const inputs = document.querySelectorAll(`.${styles.inputLogin}`);
    const values = Array.from(inputs).map((input) => input.value.trim());

    const [
      nome,
      sobrenome,
      nascimento,
      genero,
      email,
      celular,
      localizacao,
      senha,
      confirmarSenha,
    ] = values;

    if (
      !nome ||
      !sobrenome ||
      !nascimento ||
      !genero ||
      !email ||
      !celular ||
      !localizacao ||
      !senha ||
      !confirmarSenha
    ) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email inválido.");
      return;
    }

    if (senha.length < 6) {
      toast.error("Senha com no mínimo 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("Senhas não coincidem.");
      return;
    }

    if (celular.replace(/\D/g, "").length < 8) {
      toast.error("Número de celular inválido.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      const user = userCredential.user;

      // Adicionando no Firestore
      await setDoc(doc(db, "Users", user.uid), {
        uid: user.uid,
        nome,
        sobrenome,
        nascimento,
        genero,
        email,
        celular,
        localizacao,
        photo: photoPreview || defaultProfileIcon,
        createdAt: new Date().toISOString(),
      });

      toast.success("Usuário registrado com sucesso!");
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Este email já está em uso.");
      } else {
        toast.error("Erro ao registrar: " + error.message);
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <ToastContainer />
      <img src={LoginPageImg} alt="" className={styles.bgImg} />
      <h1 className={styles.title}>Registre-se!</h1>

      <div className={styles.profilePhotoWrapper}>
        <label htmlFor="profilePhoto" className={styles.profilePhotoLabel}>
          <img
            src={photoPreview || defaultProfileIcon}
            alt="Preview"
            className={styles.profilePhoto}
          />
        </label>
        <input
          id="profilePhoto"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className={styles.hiddenInput}
        />
      </div>

      <input className={styles.inputLogin} placeholder="Nome" type="text" />
      <input
        className={styles.inputLogin}
        placeholder="Sobrenome"
        type="text"
      />
      <input
        className={styles.inputLogin}
        placeholder="Data de nascimento"
        type="date"
      />

      <select className={styles.inputLogin}>
        <option value="">Selecione o gênero</option>
        <option value="masculino">Masculino</option>
        <option value="feminino">Feminino</option>
        <option value="outro">Outro</option>
      </select>

      <input className={styles.inputLogin} placeholder="Email" type="email" />
      <input className={styles.inputLogin} placeholder="Celular" type="tel" />
      <input
        className={styles.inputLogin}
        placeholder="Localização"
        type="text"
      />
      <input
        className={styles.inputLogin}
        placeholder="Senha"
        type="password"
      />
      <input
        className={styles.inputLogin}
        placeholder="Confirmar senha"
        type="password"
      />

      <button className={styles.registerBtn} onClick={handleRegister}>
        Registrar
      </button>
    </div>
  );
};

export default RegisterPage;
