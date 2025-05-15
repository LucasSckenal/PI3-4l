import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../api/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { IoEye, IoEyeOff } from "react-icons/io5";

import styles from "./styles.module.scss";
import LoginPageImg from "../../../public/LoginPage.png";
import defaultProfileIcon from "../../../public/UserDefault.webp";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 11);
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);

    if (!match) return value;

    const [, ddd, part1, part2] = match;
    let formatted = "";
    if (ddd) formatted += `(${ddd}`;
    if (ddd && ddd.length === 2) formatted += `) `;
    if (part1) formatted += part1;
    if (part2) formatted += `-${part2}`;
    return formatted.trim();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "phone" ? formatPhone(value) : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleRegister = async () => {
    const {
      firstName,
      lastName,
      birthDate,
      gender,
      email,
      phone,
      location,
      password,
      confirmPassword,
    } = formData;

    if (
      !firstName ||
      !lastName ||
      !birthDate ||
      !gender ||
      !email ||
      !phone ||
      !location ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email inválido.");
      return;
    }

    if (password.length < 6) {
      toast.error("Senha com no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Senhas não coincidem.");
      return;
    }

    if (phone.replace(/\D/g, "").length < 10) {
      toast.error("Número de celular inválido.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "Users", user.uid), {
        uid: user.uid,
        name: `${firstName} ${lastName}`,
        birthDate,
        gender,
        email,
        phone,
        location,
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

      <div className={styles.namesInput}>
        <input
          className={styles.inputRegister}
          name="firstName"
          placeholder="Nome"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          className={styles.inputRegister}
          name="lastName"
          placeholder="Sobrenome"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>

      <input
        className={styles.inputRegister}
        name="birthDate"
        placeholder="Data de nascimento"
        type="date"
        value={formData.birthDate}
        onChange={handleChange}
      />

      <select
        className={styles.inputRegister}
        name="gender"
        value={formData.gender}
        onChange={handleChange}
      >
        <option value="">Selecione o gênero</option>
        <option value="male">Masculino</option>
        <option value="female">Feminino</option>
        <option value="other">Outro</option>
      </select>

      <input
        className={styles.inputRegister}
        name="email"
        placeholder="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        className={styles.inputRegister}
        name="phone"
        placeholder="Celular"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
      />
      <input
        className={styles.inputRegister}
        name="location"
        placeholder="Localização"
        type="text"
        value={formData.location}
        onChange={handleChange}
      />
      <div className={styles.pass}>
        <input
          className={styles.inputRegister}
          name="password"
          placeholder="Senha"
          type={isVisible ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
        />
        <span onClick={() => setIsVisible(!isVisible)} className={styles.icon}>
          {isVisible ? <IoEyeOff /> : <IoEye />}
        </span>
      </div>
      <div className={styles.pass}>
        <input
          className={styles.inputRegister}
          name="confirmPassword"
          placeholder="Confirmar senha"
          type={isVisible2 ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <span onClick={() => setIsVisible2(!isVisible2)} className={styles.icon}>
          {isVisible2 ? <IoEyeOff /> : <IoEye />}
        </span>
      </div>

      <button className={styles.registerBtn} onClick={handleRegister}>
        Registrar
      </button>
      <p className={styles.pBack} onClick={() => navigate("/login")}>
        voltar para login
      </p>
    </div>
  );
};

export default RegisterPage;
