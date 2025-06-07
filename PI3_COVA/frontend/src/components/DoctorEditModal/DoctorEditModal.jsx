import { useTranslation } from "react-i18next";
import { useState } from "react";
import styles from "./styles.module.scss";
import { FaUserMd, FaIdCard, FaTimes, FaLock, FaPlus, FaMinus, FaChevronDown  } from "react-icons/fa";

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

  const handleAddCid = () => {
    if (newCid.trim() && !cidSpecialties.includes(newCid) && cidSpecialtiesList.includes(newCid)) {
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
                onChange={(e) => setProfessionalId(e.target.value)}
                className={styles.idInput}
                placeholder="ID-123456"
              />
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
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Coluna 2: Informações Profissionais */}
          <div className={styles.formColumn}>
            <div className={styles.formCard}>
              <h3 className={styles.sectionTitle}>{t("editProfile.professionalInfo")}</h3>
              
              <div className={styles.formGroup}>
                <label>{t("editProfile.country")} </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
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
                disabled={!newCid}
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
            disabled={!name || !email || !phone || !country || !specialization}
          >
            {t("editProfile.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileEditModal;