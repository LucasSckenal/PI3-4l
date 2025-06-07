import { useState, useEffect } from "react";
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
  const [accountType, setAccountType] = useState("");
  const [errors, setErrors] = useState({ doctor: {}, user: {} });
  
  const countries = [
    { code: "BR", name: "Brasil", prefix: "CRM-", pattern: /^[A-Z]{2}\s\d{1,6}$/, example: "SP 123456" },
    { code: "US", name: "Estados Unidos", prefix: "MD-", pattern: /^\d{6,10}$/, example: "12345678" },
    { code: "PT", name: "Portugal", prefix: "Cédula-", pattern: /^\d{6}$/, example: "123456" },
    { code: "ES", name: "Espanha", prefix: "Nº Colegiado-", pattern: /^\d{4,8}$/, example: "1234567" },
    { code: "AR", name: "Argentina", prefix: "MP-", pattern: /^\d{4,6}$/, example: "12345" },
    { code: "OTHER", name: "Outro país", prefix: "Registro-", pattern: /^.+$/, example: "Seu registro" },
  ];

  const brazilianStates = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  const [doctorFormData, setDoctorFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", location: "", password: "", confirmPassword: "", country: "BR", professionalId: "", specialization: "", onCallPhone: "", cidSpecialties: [""],
  });

  const [userFormData, setUserFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", location: "", password: "", confirmPassword: "", weight: "", bloodType: "", birthDate: "", gender: "",
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const specializations = ["Cardiologia", "Dermatologia", "Neurologia", "Ortopedia", "Pediatria", "Oftalmologia"];
  const cidSpecialtiesList = ["G43 - Enxaqueca", "G43.0 - Enxaqueca sem aura", "G43.1 - Enxaqueca com aura", "G43.2 - Estado de mal de enxaqueca", "G44 - Outras síndromes de cefaleia", "G44.0 - Cefaleia em salvas", "G44.1 - Cefaleia vascular", "G44.2 - Cefaleia tensional"];

  const allSpecialtiesAdded = () => {
    return doctorFormData.cidSpecialties.length >= cidSpecialtiesList.length || cidSpecialtiesList.every(cid => doctorFormData.cidSpecialties.includes(cid));
  };

  const getAvailableCidOptions = (index) => {
    const selectedExcludingCurrent = doctorFormData.cidSpecialties.filter((val, idx) => val && idx !== index);
    return cidSpecialtiesList.filter((cid) => !selectedExcludingCurrent.includes(cid) || doctorFormData.cidSpecialties[index] === cid);
  };

  const addCidSpecialty = () => {
    const availableOptions = cidSpecialtiesList.filter(cid => !doctorFormData.cidSpecialties.includes(cid));
    if (availableOptions.length > 0) {
      setDoctorFormData((prev) => ({...prev, cidSpecialties: [...prev.cidSpecialties, availableOptions[0]]}));
    }
  };

  useEffect(() => {
    if (accountType === "doctor") validateDoctorFields();
    else if (accountType === "user") validateUserFields();
  }, [doctorFormData, userFormData, accountType]);

  const formatProfessionalId = (country, value) => {
    if (!value) return "";
    const countryData = countries.find(c => c.code === country);
    if (!countryData) return value;
    let cleanValue = value.replace(new RegExp(`^${countryData.prefix}\\s*`), '');
    switch (country) {
      case "BR":
        cleanValue = cleanValue.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
        const statePart = cleanValue.substring(0, 2);
        const numberPart = cleanValue.substring(2, 8);
        if (statePart.length === 2 && brazilianStates.includes(statePart)) {
          return `${countryData.prefix} ${statePart} ${numberPart}`;
        }
        return `${countryData.prefix} ${cleanValue}`;
      case "US":
      case "PT":
      case "ES":
      case "AR":
        return `${countryData.prefix} ${cleanValue.replace(/\D/g, "").substring(0, 8)}`;
      default:
        return `${countryData.prefix} ${cleanValue}`;
    }
  };

  const validateProfessionalId = (country, value) => {
    if (!value) return false;
    const countryData = countries.find(c => c.code === country);
    if (!countryData) return false;
    let cleanValue = value.replace(new RegExp(`^${countryData.prefix}\\s*`), '');
    if (country === "BR") {
      const parts = cleanValue.split(' ');
      if (parts.length !== 2) return false;
      const [state, number] = parts;
      return (state.length === 2 && brazilianStates.includes(state) && /^\d{1,6}$/.test(number));
    }
    return countryData.pattern.test(cleanValue);
  };

  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 11;
  };

  const validateDoctorFields = () => {
    const newErrors = {};
    const { country, professionalId, phone, onCallPhone, password, confirmPassword } = doctorFormData;
    if (professionalId && !validateProfessionalId(country, professionalId)) {
      newErrors.professionalId = country === "BR" ? `Formato inválido. Digite a sigla do estado e número (ex: ${countries.find(c => c.code === country)?.example})` : `Formato inválido (ex: ${countries.find(c => c.code === country)?.example})`;
    }
    if (phone && !validatePhone(phone)) newErrors.phone = "Celular inválido (ex: (11) 91234-5678)";
    if (onCallPhone && !validatePhone(onCallPhone)) newErrors.onCallPhone = "Celular de plantão inválido";
    if (password && password.length < 6) newErrors.password = "Mínimo 6 caracteres";
    if (confirmPassword && password !== confirmPassword) newErrors.confirmPassword = "Senhas não coincidem";
    setErrors((prev) => ({ ...prev, doctor: newErrors }));
  };

  const validateUserFields = () => {
    const newErrors = {};
    const { phone, password, confirmPassword } = userFormData;
    if (phone && !validatePhone(phone)) newErrors.phone = "Celular inválido (ex: (11) 91234-5678)";
    if (password && password.length < 6) newErrors.password = "Mínimo 6 caracteres";
    if (confirmPassword && password !== confirmPassword) newErrors.confirmPassword = "Senhas não coincidem";
    setErrors((prev) => ({ ...prev, user: newErrors }));
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 11);
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (!match) return value;
    const [, ddd, part1, part2] = match;
    let formatted = "";
    if (ddd) {
      formatted += `(${ddd}`;
      if (ddd.length === 2) formatted += ") ";
    }
    if (part1) formatted += part1;
    if (part2) formatted += `-${part2}`;
    return formatted.trim();
  };

  const handleDoctorChange = (e) => {
  const { name, value } = e.target;
  let newValue = value;

  if (name.toLowerCase().includes("phone")) {
    newValue = formatPhone(value);
  }

  setDoctorFormData((prev) => ({ ...prev, [name]: newValue }));
};

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "phone" ? formatPhone(value) : value;
    setUserFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const removeCidSpecialty = (index) => {
    if (doctorFormData.cidSpecialties.length <= 1) return;
    setDoctorFormData((prev) => {
      const updated = [...prev.cidSpecialties];
      updated.splice(index, 1);
      return { ...prev, cidSpecialties: updated };
    });
  };

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

  const handleRegister = async () => {
    if (accountType === "doctor") {
      const { firstName, lastName, email, phone, location, password, confirmPassword, country, professionalId, specialization, onCallPhone, cidSpecialties } = doctorFormData;
      const hasValidCid = cidSpecialties.some((cid) => cid.trim() !== "");
      if (!firstName || !lastName || !email || !phone || !location || !password || !confirmPassword || !professionalId || !specialization || !onCallPhone || !hasValidCid) {
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
      if (!validateProfessionalId(country, professionalId)) {
        const countryData = countries.find(c => c.code === country);
        toast.error(`Registro profissional inválido. Formato esperado: ${countryData.example}`);
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userData = {
          uid: user.uid, name: `${firstName} ${lastName}`, email, phone, location, photo: photoPreview || defaultProfileIcon, role: "doctor", createdAt: new Date().toISOString(), doctorOnline: true, country, professionalId, professionalPrefix: countries.find(c => c.code === country)?.prefix || "Registro", specialization, onCallPhone, cidSpecialties: cidSpecialties.filter((cid) => cid.trim() !== ""),
        };
        await setDoc(doc(db, "Users", user.uid), userData);
        toast.success("Médico registrado com sucesso!");
        navigate("/login");
      } catch (error) {
        handleAuthError(error);
      }
    } else if (accountType === "user") {
      const { firstName, lastName, email, phone, location, password, confirmPassword, weight, bloodType, birthDate, gender } = userFormData;
      if (!firstName || !lastName || !email || !phone || !location || !password || !confirmPassword || !weight || !bloodType || !birthDate || !gender) {
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userData = {
          uid: user.uid, name: `${firstName} ${lastName}`, email, phone, location, photo: photoPreview || defaultProfileIcon, role: "user", createdAt: new Date().toISOString(), weight, bloodType, birthDate, gender,
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
    if (error.code === "auth/email-already-in-use") toast.error("Este email já está em uso.");
    else toast.error("Erro ao registrar: " + error.message);
  };

  if (!accountType) {
    return (
      <div className={styles.loginContainer}>
        <ToastContainer />
        <img src={registerImg} alt="" className={styles.bgImg} />
        <h1 className={styles.title}>Selecione seu tipo de conta</h1>
        <div className={styles.accountTypeContainer}>
          <div className={`${styles.accountTypeCard} ${accountType === "doctor" ? styles.selected : ""}`} onClick={() => setAccountType("doctor")}>
            <h2>Médico</h2>
            <p>Cadastre-se para oferecer consultas e acompanhamentos médicos</p>
          </div>
          <div className={`${styles.accountTypeCard} ${accountType === "user" ? styles.selected : ""}`} onClick={() => setAccountType("user")}>
            <h2>Usuário</h2>
            <p>Cadastre-se para agendar consultas e gerenciar sua saúde</p>
          </div>
        </div>
        <button className={styles.backButton} onClick={() => navigate("/login")}>
          Voltar para login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <ToastContainer />
      <img src={registerImg} alt="" className={styles.bgImg} />
      <div className={styles.formContainer}>
        {accountType === "doctor" ? (
          <>
            <h1 className={styles.title}>Cadastro de Médico</h1>
            <div className={styles.profilePhotoWrapper}>
              <label htmlFor="profilePhoto" className={styles.profilePhotoLabel}>
                <img src={photoPreview || defaultProfileIcon} alt="Preview" className={styles.profilePhoto} />
              </label>
              <input id="profilePhoto" type="file" accept="image/*" onChange={handlePhotoChange} className={styles.hiddenInput} />
            </div>
            <div className={styles.namesInput}>
              <input className={styles.inputRegister} name="firstName" placeholder="Nome" type="text" value={doctorFormData.firstName} onChange={handleDoctorChange} required />
              <input className={styles.inputRegister} name="lastName" placeholder="Sobrenome" type="text" value={doctorFormData.lastName} onChange={handleDoctorChange} required />
            </div>
            <div className={styles.professionalIdContainer}>
              <div className={styles.crmInputGroup}>
                <select className={styles.countrySelect} value={doctorFormData.country} onChange={(e) => setDoctorFormData(prev => ({...prev, country: e.target.value, professionalId: ""}))}>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>{country.prefix}</option>
                  ))}
                </select>
                <input className={`${styles.professionalIdInput} ${errors.doctor.professionalId ? styles.inputError : ""}`} name="professionalId" placeholder={countries.find(c => c.code === doctorFormData.country)?.example || "Número de registro"} type="text" value={doctorFormData.professionalId} onChange={(e) => {
                  const formatted = formatProfessionalId(doctorFormData.country, e.target.value);
                  setDoctorFormData(prev => ({...prev, professionalId: formatted}));
                }} required />
              </div>
              {errors.doctor.professionalId && <span className={styles.errorText}>{errors.doctor.professionalId}</span>}
            </div>
            <select className={styles.inputRegister} name="specialization" value={doctorFormData.specialization} onChange={handleDoctorChange} required>
              <option value="" hidden>Selecione sua especialização</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <div className={styles.specialtiesContainer}>
              <h3 className={styles.specialtiesTitle}>Especializações CID-10</h3>
              {doctorFormData.cidSpecialties.map((specialty, index) => (
                <div key={index} className={styles.specialtyRow}>
                  <select className={styles.inputRegister} value={specialty} onChange={(e) => handleCidSpecialtyChange(index, e.target.value)} required={index === 0}>
                    <option value="" hidden>{index === 0 ? "Selecione especialização CID-10 (obrigatório)" : "Selecione especialização adicional"}</option>
                    {getAvailableCidOptions(index).map((cid) => (
                      <option key={cid} value={cid}>{cid}</option>
                    ))}
                  </select>
                  {index > 0 && <button type="button" className={styles.removeButton} onClick={() => removeCidSpecialty(index)}><IoClose /></button>}
                </div>
              ))}
              {!allSpecialtiesAdded() && (
                <button type="button" className={styles.addButton} onClick={addCidSpecialty}><IoAdd /> Adicionar especialização</button>
              )}
              {allSpecialtiesAdded() && <p className={styles.allSpecialtiesAddedText}>Todas as especializações disponíveis foram adicionadas</p>}
            </div>
            <input className={styles.inputRegister} name="email" placeholder="Email" type="email" value={doctorFormData.email} onChange={handleDoctorChange} required />
            <input className={`${styles.inputRegister} ${errors.doctor.phone ? styles.inputError : ""}`} name="phone" placeholder="Celular" type="tel" value={doctorFormData.phone} onChange={handleDoctorChange} required />
            {errors.doctor.phone && <span className={styles.errorText}>{errors.doctor.phone}</span>}
            <input className={`${styles.inputRegister} ${errors.doctor.onCallPhone ? styles.inputError : ""}`} name="onCallPhone" placeholder="Celular de plantão" type="tel" value={doctorFormData.onCallPhone} onChange={handleDoctorChange} required />
            {errors.doctor.onCallPhone && <span className={styles.errorText}>{errors.doctor.onCallPhone}</span>}
            <input className={styles.inputRegister} name="location" placeholder="Localização" type="text" value={doctorFormData.location} onChange={handleDoctorChange} required />
            <div className={styles.pass}>
              <input className={`${styles.inputRegister} ${errors.doctor.password ? styles.inputError : ""}`} name="password" placeholder="Senha" type={isVisible ? "text" : "password"} value={doctorFormData.password} onChange={handleDoctorChange} required />
              <span onClick={() => setIsVisible(!isVisible)} className={styles.icon}>{isVisible ? <IoEyeOff /> : <IoEye />}</span>
            </div>
            {errors.doctor.password && <span className={styles.errorText}>{errors.doctor.password}</span>}
            <div className={styles.pass}>
              <input className={`${styles.inputRegister} ${errors.doctor.confirmPassword ? styles.inputError : ""}`} name="confirmPassword" placeholder="Confirmar senha" type={isVisible2 ? "text" : "password"} value={doctorFormData.confirmPassword} onChange={handleDoctorChange} required />
              <span onClick={() => setIsVisible2(!isVisible2)} className={styles.icon}>{isVisible2 ? <IoEyeOff /> : <IoEye />}</span>
            </div>
            {errors.doctor.confirmPassword && <span className={styles.errorText}>{errors.doctor.confirmPassword}</span>}
            <button className={styles.registerBtn} onClick={handleRegister}>Registrar como Médico</button>
            <p className={styles.pBack} onClick={() => setAccountType("")}>Voltar para seleção</p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Cadastro de Usuário</h1>
            <div className={styles.profilePhotoWrapper}>
              <label htmlFor="profilePhoto" className={styles.profilePhotoLabel}>
                <img src={photoPreview || defaultProfileIcon} alt="Preview" className={styles.profilePhoto} />
              </label>
              <input id="profilePhoto" type="file" accept="image/*" onChange={handlePhotoChange} className={styles.hiddenInput} />
            </div>
            <div className={styles.namesInput}>
              <input className={styles.inputRegister} name="firstName" placeholder="Nome" type="text" value={userFormData.firstName} onChange={handleUserChange} required />
              <input className={styles.inputRegister} name="lastName" placeholder="Sobrenome" type="text" value={userFormData.lastName} onChange={handleUserChange} required />
            </div>
            <input className={styles.inputRegister} name="birthDate" placeholder="Data de nascimento" type="date" value={userFormData.birthDate} onChange={handleUserChange} required />
            <select className={styles.inputRegister} name="gender" value={userFormData.gender} onChange={handleUserChange} required>
              <option value="" hidden>Selecione o gênero</option>
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
              <option value="other">Outro</option>
            </select>
            <div className={styles.healthData}>
              <input className={styles.inputRegister} name="weight" placeholder="Peso (kg)" type="number" value={userFormData.weight} onChange={handleUserChange} required />
              <select className={styles.inputRegister} name="bloodType" value={userFormData.bloodType} onChange={handleUserChange} required>
                <option value="" hidden>Tipo sanguíneo</option>
                {bloodTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <input className={styles.inputRegister} name="email" placeholder="Email" type="email" value={userFormData.email} onChange={handleUserChange} required />
            <input className={`${styles.inputRegister} ${errors.user.phone ? styles.inputError : ""}`} name="phone" placeholder="celular" type="tel" value={userFormData.phone} onChange={handleUserChange} required />
            {errors.user.phone && <span className={styles.errorText}>{errors.user.phone}</span>}
            <input className={styles.inputRegister} name="location" placeholder="Localização" type="text" value={userFormData.location} onChange={handleUserChange} required />
            <div className={styles.pass}>
              <input className={`${styles.inputRegister} ${errors.user.password ? styles.inputError : ""}`} name="password" placeholder="Senha" type={isVisible ? "text" : "password"} value={userFormData.password} onChange={handleUserChange} required />
              <span onClick={() => setIsVisible(!isVisible)} className={styles.icon}>{isVisible ? <IoEyeOff /> : <IoEye />}</span>
            </div>
            {errors.user.password && <span className={styles.errorText}>{errors.user.password}</span>}
            <div className={styles.pass}>
              <input className={`${styles.inputRegister} ${errors.user.confirmPassword ? styles.inputError : ""}`} name="confirmPassword" placeholder="Confirmar senha" type={isVisible2 ? "text" : "password"} value={userFormData.confirmPassword} onChange={handleUserChange} required />
              <span onClick={() => setIsVisible2(!isVisible2)} className={styles.icon}>{isVisible2 ? <IoEyeOff /> : <IoEye />}</span>
            </div>
            {errors.user.confirmPassword && <span className={styles.errorText}>{errors.user.confirmPassword}</span>}
            <button className={styles.registerBtn} onClick={handleRegister}>Registrar como Usuário</button>
            <p className={styles.pBack} onClick={() => setAccountType("")}>Voltar para seleção</p>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;