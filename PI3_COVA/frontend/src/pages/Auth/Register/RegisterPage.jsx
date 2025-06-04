import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../api/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { IoEye, IoEyeOff, IoAdd, IoClose } from "react-icons/io5";

import styles from "./styles.module.scss";
import registerImg from "../../../public/RegisterPage.png";
import defaultProfileIcon from "../../../public/UserDefault.webp";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [accountType, setAccountType] = useState(""); // 'doctor' ou 'user'

  // Estados específicos para médicos
  const [doctorFormData, setDoctorFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
    crm: "",
    specialization: "",
    onCallPhone: "",
    cidSpecialties: [""], // Array para múltiplas especializações
  });

  // Estados específicos para usuários
  const [userFormData, setUserFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
    weight: "",
    bloodType: "",
    birthDate: "",
    gender: "",
  });

  // Opções para selects
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const specializations = [
    "Cardiologia",
    "Dermatologia",
    "Neurologia",
    "Ortopedia",
    "Pediatria",
    "Oftalmologia",
  ];
  const cidSpecialtiesList = [
    "G43 - Enxaqueca",
    "G43.0 - Enxaqueca sem aura",
    "G43.1 - Enxaqueca com aura",
    "G43.2 - Estado de mal de enxaqueca",
    "G44 - Outras síndromes de cefaleia",
    "G44.0 - Cefaleia em salvas",
    "G44.1 - Cefaleia vascular",
    "G44.2 - Cefaleia tensional",
  ];

  // Adicionar nova especialização CID-10
  const addCidSpecialty = () => {
    setDoctorFormData((prev) => ({
      ...prev,
      cidSpecialties: [...prev.cidSpecialties, ""],
    }));
  };

  // Remover especialização CID-10
  const removeCidSpecialty = (index) => {
    if (doctorFormData.cidSpecialties.length <= 1) return;

    setDoctorFormData((prev) => {
      const updated = [...prev.cidSpecialties];
      updated.splice(index, 1);
      return { ...prev, cidSpecialties: updated };
    });
  };

  // Atualizar especialização CID-10
  const handleCidSpecialtyChange = (index, value) => {
    setDoctorFormData((prev) => {
      const updated = [...prev.cidSpecialties];
      updated[index] = value;
      return { ...prev, cidSpecialties: updated };
    });
  };

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

  // Manipuladores genéricos para cada tipo de formulário
  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    const newValue = name.includes("Phone") ? formatPhone(value) : value;
    setDoctorFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "phone" ? formatPhone(value) : value;
    setUserFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleRegister = async () => {
    // Validação para médicos
    if (accountType === "doctor") {
      const {
        firstName,
        lastName,
        email,
        phone,
        location,
        password,
        confirmPassword,
        crm,
        specialization,
        onCallPhone,
        cidSpecialties,
      } = doctorFormData;

      // Verificar se pelo menos uma especialização foi preenchida
      const hasValidCid = cidSpecialties.some((cid) => cid.trim() !== "");

      if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !location ||
        !password ||
        !confirmPassword ||
        !crm ||
        !specialization ||
        !onCallPhone ||
        !hasValidCid
      ) {
        toast.error("Preencha todos os campos obrigatórios.");
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

        const userData = {
          uid: user.uid,
          name: `${firstName} ${lastName}`,
          email,
          phone,
          location,
          photo: photoPreview || defaultProfileIcon,
          role: "doctor",
          createdAt: new Date().toISOString(),
          doctorOnline: true,
          crm,
          specialization,
          onCallPhone,
          cidSpecialties: cidSpecialties.filter((cid) => cid.trim() !== ""),
        };

        await setDoc(doc(db, "Users", user.uid), userData);
        toast.success("Médico registrado com sucesso!");
        navigate("/login");
      } catch (error) {
        handleAuthError(error);
      }
    }
    // Validação para usuários
    else if (accountType === "user") {
      const {
        firstName,
        lastName,
        email,
        phone,
        location,
        password,
        confirmPassword,
        weight,
        bloodType,
        birthDate,
        gender,
      } = userFormData;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !location ||
        !password ||
        !confirmPassword ||
        !weight ||
        !bloodType ||
        !birthDate ||
        !gender
      ) {
        toast.error("Preencha todos os campos obrigatórios.");
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

        const userData = {
          uid: user.uid,
          name: `${firstName} ${lastName}`,
          email,
          phone,
          location,
          photo: photoPreview || defaultProfileIcon,
          role: "user",
          createdAt: new Date().toISOString(),
          weight,
          bloodType,
          birthDate,
          gender,
        };

        await setDoc(doc(db, "Users", user.uid), userData);
        toast.success("Usuário registrado com sucesso!");
        navigate("/login");
      } catch (error) {
        handleAuthError(error);
      }
    }
  };

  const handleAuthError = (error) => {
    if (error.code === "auth/email-already-in-use") {
      toast.error("Este email já está em uso.");
    } else {
      toast.error("Erro ao registrar: " + error.message);
    }
  };

  // Função auxiliar para obter opções únicas de CID-10 por índice
  const getAvailableCidOptions = (index) => {
    // Todas as especializações já selecionadas, exceto a posição atual
    const selectedExcludingCurrent = doctorFormData.cidSpecialties.filter(
      (val, idx) => val && idx !== index
    );
    return cidSpecialtiesList.filter(
      (cid) =>
        !selectedExcludingCurrent.includes(cid) ||
        doctorFormData.cidSpecialties[index] === cid
    );
  };

  // Renderização inicial (seleção de tipo de conta)
  if (!accountType) {
    return (
      <div className={styles.loginContainer}>
        <ToastContainer />
        <img src={registerImg} alt="" className={styles.bgImg} />
        <h1 className={styles.title}>Selecione seu tipo de conta</h1>

        <div className={styles.accountTypeContainer}>
          <div
            className={`${styles.accountTypeCard} ${
              accountType === "doctor" ? styles.selected : ""
            }`}
            onClick={() => setAccountType("doctor")}
          >
            <h2>Médico</h2>
            <p>Cadastre-se para oferecer consultas e acompanhamentos médicos</p>
          </div>

          <div
            className={`${styles.accountTypeCard} ${
              accountType === "user" ? styles.selected : ""
            }`}
            onClick={() => setAccountType("user")}
          >
            <h2>Usuário</h2>
            <p>Cadastre-se para agendar consultas e gerenciar sua saúde</p>
          </div>
        </div>

        <button
          className={styles.backButton}
          onClick={() => navigate("/login")}
        >
          Voltar para login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <ToastContainer />
      <img src={registerImg} alt="" className={styles.bgImg} />

      {accountType === "doctor" ? (
        <>
          <h1 className={styles.title}>Cadastro de Médico</h1>

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
              value={doctorFormData.firstName}
              onChange={handleDoctorChange}
              required
            />
            <input
              className={styles.inputRegister}
              name="lastName"
              placeholder="Sobrenome"
              type="text"
              value={doctorFormData.lastName}
              onChange={handleDoctorChange}
              required
            />
          </div>

          <input
            className={styles.inputRegister}
            name="crm"
            placeholder="CRM"
            type="text"
            value={doctorFormData.crm}
            onChange={handleDoctorChange}
            required
          />

          <select
            className={styles.inputRegister}
            name="specialization"
            value={doctorFormData.specialization}
            onChange={handleDoctorChange}
            required
          >
            <option value="" hidden>
              Selecione sua especialização
            </option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          <div className={styles.specialtiesContainer}>
            <h3 className={styles.specialtiesTitle}>Especializações CID-10</h3>
            {doctorFormData.cidSpecialties.map((specialty, index) => (
              <div key={index} className={styles.specialtyRow}>
                <select
                  className={styles.inputRegister}
                  value={specialty}
                  onChange={(e) =>
                    handleCidSpecialtyChange(index, e.target.value)
                  }
                  required={index === 0}
                >
                  <option value="" hidden>
                    {index === 0
                      ? "Selecione especialização CID-10 (obrigatório)"
                      : "Selecione especialização adicional"}
                  </option>
                  {getAvailableCidOptions(index).map((cid) => (
                    <option key={cid} value={cid}>
                      {cid}
                    </option>
                  ))}
                </select>

                {index > 0 && (
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeCidSpecialty(index)}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className={styles.addButton}
              onClick={addCidSpecialty}
            >
              <IoAdd /> Adicionar especialização
            </button>
          </div>

          <input
            className={styles.inputRegister}
            name="email"
            placeholder="Email"
            type="email"
            value={doctorFormData.email}
            onChange={handleDoctorChange}
            required
          />

          <input
            className={styles.inputRegister}
            name="phone"
            placeholder="Celular"
            type="tel"
            value={doctorFormData.phone}
            onChange={handleDoctorChange}
            required
          />

          <input
            className={styles.inputRegister}
            name="onCallPhone"
            placeholder="Celular de plantão"
            type="tel"
            value={doctorFormData.onCallPhone}
            onChange={handleDoctorChange}
            required
          />

          <input
            className={styles.inputRegister}
            name="location"
            placeholder="Localização"
            type="text"
            value={doctorFormData.location}
            onChange={handleDoctorChange}
            required
          />

          <div className={styles.pass}>
            <input
              className={styles.inputRegister}
              name="password"
              placeholder="Senha"
              type={isVisible ? "text" : "password"}
              value={doctorFormData.password}
              onChange={handleDoctorChange}
              required
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
              value={doctorFormData.confirmPassword}
              onChange={handleDoctorChange}
              required
            />
            <span
              onClick={() => setIsVisible2(!isVisible2)}
              className={styles.icon}
            >
              {isVisible2 ? <IoEyeOff /> : <IoEye />}
            </span>
          </div>

          <button className={styles.registerBtn} onClick={handleRegister}>
            Registrar como Médico
          </button>
          <p className={styles.pBack} onClick={() => setAccountType("")}>
            Voltar para seleção
          </p>
        </>
      ) : (
        <>
          <h1 className={styles.title}>Cadastro de Usuário</h1>

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
              value={userFormData.firstName}
              onChange={handleUserChange}
              required
            />
            <input
              className={styles.inputRegister}
              name="lastName"
              placeholder="Sobrenome"
              type="text"
              value={userFormData.lastName}
              onChange={handleUserChange}
              required
            />
          </div>

          <input
            className={styles.inputRegister}
            name="birthDate"
            placeholder="Data de nascimento"
            type="date"
            value={userFormData.birthDate}
            onChange={handleUserChange}
            required
          />

          <select
            className={styles.inputRegister}
            name="gender"
            value={userFormData.gender}
            onChange={handleUserChange}
            required
          >
            <option value="" hidden>
              Selecione o gênero
            </option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
            <option value="other">Outro</option>
          </select>

          <div className={styles.healthData}>
            <input
              className={styles.inputRegister}
              name="weight"
              placeholder="Peso (kg)"
              type="number"
              value={userFormData.weight}
              onChange={handleUserChange}
              required
            />

            <select
              className={styles.inputRegister}
              name="bloodType"
              value={userFormData.bloodType}
              onChange={handleUserChange}
              required
            >
              <option value="" hidden>
                Tipo sanguíneo
              </option>
              {bloodTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <input
            className={styles.inputRegister}
            name="email"
            placeholder="Email"
            type="email"
            value={userFormData.email}
            onChange={handleUserChange}
            required
          />

          <input
            className={styles.inputRegister}
            name="phone"
            placeholder="Celular"
            type="tel"
            value={userFormData.phone}
            onChange={handleUserChange}
            required
          />

          <input
            className={styles.inputRegister}
            name="location"
            placeholder="Localização"
            type="text"
            value={userFormData.location}
            onChange={handleUserChange}
            required
          />

          <div className={styles.pass}>
            <input
              className={styles.inputRegister}
              name="password"
              placeholder="Senha"
              type={isVisible ? "text" : "password"}
              value={userFormData.password}
              onChange={handleUserChange}
              required
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
              value={userFormData.confirmPassword}
              onChange={handleUserChange}
              required
            />
            <span
              onClick={() => setIsVisible2(!isVisible2)}
              className={styles.icon}
            >
              {isVisible2 ? <IoEyeOff /> : <IoEye />}
            </span>
          </div>

          <button className={styles.registerBtn} onClick={handleRegister}>
            Registrar como Usuário
          </button>
          <p className={styles.pBack} onClick={() => setAccountType("")}>
            Voltar para seleção
          </p>
        </>
      )}
    </div>
  );
};

export default RegisterPage;
