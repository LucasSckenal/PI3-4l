/* eslint-disable no-case-declarations */
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { FaUserMd, FaIdCard, FaTimes, FaLock, FaPlus, FaMinus, FaChevronDown  } from "react-icons/fa";
import { toast } from "react-toastify";


const DoctorProfileEditModal = ({
  name,
  location,
  phone,
  email,
  country,
  specialization,
  setSpecialization,
  professionalId,
  setProfessionalId,
  setName,
  setLocation,
  setPhone,
  setCountry,
  cidSpecialties = [],
  setCidSpecialties,
  photo,
  setPhoto,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  
  // Listas de opções
  const specializations = ["Cardiologia", "Dermatologia", "Neurologia", "Ortopedia", "Pediatria", "Oftalmologia"];
  const cidSpecialtiesList = ["G43 - Enxaqueca", "G43.0 - Enxaqueca sem aura", "G43.1 - Enxaqueca com aura", "G43.2 - Estado de mal de enxaqueca", "G44 - Outras síndromes de cefaleia", "G44.0 - Cefaleia em salvas", "G44.1 - Cefaleia vascular", "G44.2 - Cefaleia tensional"];

  // Estado para novo CID
  const [newCid, setNewCid] = useState("");
  
  const countries = [
  { code: "BR", name: "Brasil", prefix: "CRM-", pattern: /^[A-Z]{2}\s\d{1,6}$/, example: "SP 123456" },
  { code: "US", name: "Estados Unidos", prefix: "MD-", pattern: /^\d{6,10}$/, example: "12345678" },
  { code: "PT", name: "Portugal", prefix: "Cédula-", pattern: /^\d{6}$/, example: "123456" },
  { code: "ES", name: "Espanha", prefix: "Nº Colegiado-", pattern: /^\d{4,8}$/, example: "1234567" },
  { code: "AR", name: "Argentina", prefix: "MP-", pattern: /^\d{4,6}$/, example: "12345" },
  { code: "OTHER", name: "Outro país", prefix: "Registro-", pattern: /^.+$/, example: "Seu registro" },
];

const brazilianStates = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

// Função para formatar telefone
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

// Função para formatar ID profissional
const formatProfessionalId = (countryCode, value) => {
  if (!value) return "";
  const countryData = countries.find(c => c.code === countryCode);
  if (!countryData) return value;
  
  let cleanValue = value.replace(new RegExp(`^${countryData.prefix}\\s*`), '');
  
  switch (countryCode) {
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

// Função para validar telefone
  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 11;
  };

// Função para validar ID profissional
  const validateProfessionalId = (countryCode, value) => {
    if (!value) return false;
    const countryData = countries.find(c => c.code === countryCode);
    if (!countryData) return false;
    
    let cleanValue = value.replace(new RegExp(`^${countryData.prefix}\\s*`), '');
    
    if (countryCode === "BR") {
      const parts = cleanValue.split(' ');
      if (parts.length !== 2) return false;
      const [state, number] = parts;
      return (state.length === 2 && brazilianStates.includes(state) && /^\d{1,6}$/.test(number));
    }
    
    return countryData.pattern.test(cleanValue);
  };

// Dentro do componente, adicione estados para erros
  const [errors, setErrors] = useState({
    phone: "",
    professionalId: ""
  });

// Efeito para validar campos quando mudam
  useEffect(() => {
    const newErrors = {};
    
    if (phone && !validatePhone(phone)) {
      newErrors.phone = "Celular inválido (ex: (11) 91234-5678)";
    }
    
    if (professionalId && !validateProfessionalId(country, professionalId)) {
      newErrors.professionalId = country === "BR" 
        ? `Formato inválido. Digite a sigla do estado e número (ex: ${countries.find(c => c.code === country)?.example})` 
        : `Formato inválido (ex: ${countries.find(c => c.code === country)?.example})`;
    }
    
    setErrors(newErrors);
  }, [phone, professionalId, country]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // base64
      };
      reader.readAsDataURL(file);
    }
  };

  const isCidAlreadyAdded = (cid) => {
    return cidSpecialties.includes(cid);
  };

  const handleAddCid = () => {
    if (isCidAlreadyAdded(newCid)) {
      toast.error("Este CID já foi adicionado");
      return;
    }
    if (newCid.trim()) {
      setCidSpecialties([...cidSpecialties, newCid]);
      setNewCid("");
    }
  };

   const handleRemoveCid = (cidToRemove) => {
    setCidSpecialties(cidSpecialties.filter(cid => cid !== cidToRemove));
  };

// No JSX, ajuste o botão de remoção:
<div className={styles.cidTags}>
  {cidSpecialties.map((cid) => (
  <div key={cid} className={styles.cidTag}>
    {cid}
    <button 
      onClick={() => handleRemoveCid(cid)}
      className={styles.removeCidTag}
    >
      <FaTimes />
    </button>
  </div>
))}
</div>

return (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{t("editProfile.title")}</h2>
        <button className={styles.closeButton} onClick={onCancel}>
          <FaTimes />
        </button>
      </div>

      {/* Seção de Foto e IDs Profissionais */}
      <div className={styles.profileCard}>
        <div className={styles.photoSection}>
          <div
            className={styles.photoContainer}
            onClick={() => document.getElementById('photoInput').click()}
          >
            {photo ? (
              <img src={photo} alt="Profile" className={styles.photoPreview} />
            ) : (
              <div className={styles.photoPlaceholder}>
                <FaUserMd className={styles.placeholderIcon} />
              </div>
            )}
            <div className={styles.photoOverlay}>
              {t("editProfile.changePhoto")}
            </div>
          </div>
          <div className={styles.photoActions}>
            <input
              type="file"
              accept="image/*"
              id="photoInput"
              onChange={handlePhotoChange}
              className={styles.fileInput}
            />
            {photo && (
              <button
                className={styles.removePhotoButton}
                onClick={() => setPhoto("")}
              >
                <FaMinus /> {t("editProfile.removePhoto")}
              </button>
            )}
          </div>
        </div>

        <div className={styles.professionalIds}>
          <div className={styles.idField}>
            <label><FaIdCard /> {t("editProfile.professionalId")}</label>
            <input
              type="text"
              value={professionalId}
              onChange={(e) => {
                const formatted = formatProfessionalId(country, e.target.value);
                setProfessionalId(formatted);
              }}
              className={`${styles.idInput} ${errors.professionalId ? styles.inputError : ""}`}
              placeholder={countries.find(c => c.code === country)?.example || "ID-123456"}
            />
            {errors.professionalId && <span className={styles.errorText}>{errors.professionalId}</span>}
          </div>
        </div>
      </div>

      {/* Formulário organizado em colunas */}
      <div className={styles.formColumns}>
        {/* Coluna 1: Informações Pessoais */}
        <div className={styles.formColumn}>
          <div className={styles.formCard}>
            <h3 className={styles.sectionTitle}>{t("editProfile.personalInfo")}</h3>

            <div className={styles.formGroup}>
              <label>{t("editProfile.name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t("editProfile.email")}</label>
              <div className={styles.emailField}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  disabled
                  className={styles.disabledInput}
                />
                <span className={styles.emailLocked}>
                  <FaLock style={{ marginRight: "4px" }} />
                  {t("profile.emailLocked")}
                </span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>{t("editProfile.phone")} </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className={`${errors.phone ? styles.inputError : ""}`}
                required
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>
          </div>
        </div>

        {/* Coluna 2: Informações Profissionais */}
        <div className={styles.formColumn}>
          <div className={styles.formCard}>
            <h3 className={styles.sectionTitle}>{t("editProfile.professionalInfo")}</h3>

            <div className={styles.formGroup}>
              <label>{t("editProfile.country")} </label>
              <div className={styles.selectWrapper}>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="" hidden>Selecione o país</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
              <FaChevronDown className={styles.selectIcon} />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>{t("editProfile.specialization")}</label>
              <div className={styles.selectWrapper}>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                  className={styles.selectInput}
                >
                  <option value="" hidden>{t("editProfile.selectSpecialization")}</option>
                  {specializations.map((spec, index) => (
                    <option key={index} value={spec}>{spec}</option>
                  ))}
                </select>
                <FaChevronDown className={styles.selectIcon} />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>{t("editProfile.location")}</label>
              <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
            </div>
          </div>
        </div>
      </div>

      {/* Campo CID Specialties */}
      <div className={styles.formCard}>
        <h3 className={styles.sectionTitle}>{t("editProfile.cidSpecialties")}</h3>
        <div className={styles.formGroup}>
          <div className={styles.cidInputContainer}>
            <div className={styles.selectWrapper}>
              <select
                value={newCid}
                onChange={(e) => setNewCid(e.target.value)}
                className={styles.selectInput}
              >
                <option value="" hidden>{t("editProfile.selectCid")}</option>
                {cidSpecialtiesList.map((cid, index) => (
                  <option key={index} value={cid}>{cid}</option>
                ))}
              </select>
              <FaChevronDown className={styles.selectIcon} />
            </div>
            <button
              className={styles.addCidButton}
              onClick={handleAddCid}
              disabled={!newCid || isCidAlreadyAdded(newCid)}
            >
              <FaPlus /> {t("profile.add")}
            </button>
          </div>

          <div className={styles.cidTags}>
            {cidSpecialties.map((cid, index) => (
              <div key={index} className={styles.cidTag}>
                {cid}
                <button
                  className={styles.removeCidTag}
                  onClick={() => handleRemoveCid(cid)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>

          {cidSpecialties.length === 0 && (
            <p className={styles.noCid}>{t("editProfile.noCidSelected")}</p>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className={styles.modalActions}>
        <button className={styles.cancelButton} onClick={onCancel}>
          {t("editProfile.cancel")}
        </button>
        <button
          className={styles.saveButton}
          onClick={onSave}
          disabled={
            !name ||
            !email ||
            !phone ||
            !country ||
            !specialization ||
            errors.phone ||
            errors.professionalId
          }
        >
          {t("editProfile.save")}
        </button>
      </div>
    </div>
  </div>
);

};

export default DoctorProfileEditModal;