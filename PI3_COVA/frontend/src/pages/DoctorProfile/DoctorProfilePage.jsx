// DoctorProfilePage.jsx
import { useState, useEffect } from "react";
import { useAccount } from "../../contexts/Account/AccountProvider";
import defaultProfileIcon from "../../public/UserDefault.webp";
import { useTranslation } from "react-i18next";
import { FaRegEdit, FaSave, FaTimes } from "react-icons/fa";
import ExperienceSection from "../../components/ExperienceSection/ExperienceSection";
import styles from "./styles.module.scss";
import DoctorProfileEditModal from "../../components/DocotorEditModal/DocotorEditModal";

import {
  saveUserBasicInfo,
  saveDoctorAbout,
  fetchUserBasicInfo,
  fetchDoctorAbout,
} from "../../api/firebase"; 
const DoctorProfilePage = () => {
  const { userData, loading } = useAccount();
  const { t } = useTranslation();

  // ─── Estados para os dados básicos do Usuário ─────────────────────────────
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [cidSpecialties, setCidSpecialties] = useState([]);
  const [professionalId, setProfessionalId] = useState("");
  const [photo, setPhoto] = useState("");


  // ─── Estados para “Sobre o Médico” ────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [hospital, setHospital] = useState("");
  const [crm, setCrm] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [procedures, setProcedures] = useState([]);
  const [experiences, setExperiences] = useState([]);

  // ─── Estado para controlar se o usuário está editando o campo “Sobre” ─────
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  // ─── Estado para exibir o botão de edição somente em hover ───────────────
  const [isAboutHover, setIsAboutHover] = useState(false);
  // ─── Armazena temporariamente o texto editado até salvar ─────────────────
  const [draftAbout, setDraftAbout] = useState("");

  // ─── userID com base no UID do usuário autenticado ─────────────────────────
  const userID = userData?.uid;

  // ─── Função para obter a URL da imagem (se houver) ────────────────────────
  const getProfileImageSource = () => {
    if (!userData.photo) return defaultProfileIcon;
    if (
      userData.photo.startsWith("http") ||
      userData.photo.startsWith("data:image")
    )
      return userData.photo;
    return defaultProfileIcon;
  };

  // ─── Carregar dados do Firestore assim que o userID estiver disponível ─────
  useEffect(() => {
    if (!userID) return;

    // 1) Busca dados básicos
    const loadBasicInfo = async () => {
      try {
        const basic = await fetchUserBasicInfo(userID);
        if (basic) {
          setName(basic.name || "");
          setLocation(basic.location || "");
          setPhone(basic.phone || "");
          setEmail(basic.email || "");
          setCountry(basic.country || "");
          setSpecialization(basic.specialization || "");
          setCidSpecialties(basic.cidSpecialties || []);
          setProfessionalId(basic.professionalId || "");
          setPhoto(basic.photo || "");
        } else {
          // fallback se não houver documento
          setName(userData.name || "");
          setLocation(userData.location || "");
          setPhone(userData.phone || "");
          setEmail(userData.email || "");
          setCountry(userData.country || "");
          setSpecialization(userData.specialization || "");
          setCidSpecialties(userData.cidSpecialties || []);
          setProfessionalId(userData.professionalId || "");
          setPhoto(userData.photo || "")
        }
      } catch (error) {
        console.error("Erro ao carregar basic info:", error);
      }
    };

    // 2) Busca dados de “About”
    const loadDoctorAbout = async () => {
      try {
        const about = await fetchDoctorAbout(userID);
        if (about) {
          setTitle(about.title || "");
          setSpecialties(about.specialties || []);
          setHospital(about.hospital || "");
          setCrm(about.crm || "");
          setAboutText(about.about || "");
          setProcedures(about.procedures || []);
          setExperiences(about.experiences || []);
        } else {
          // Inicializa vazios se não existir
          setTitle("");
          setSpecialties([]);
          setHospital("");
          setCrm("");
          setAboutText("");
          setProcedures([]);
          setExperiences([]);
        }
      } catch (error) {
        console.error("Erro ao carregar Doctor About:", error);
      }
    };

    loadBasicInfo();
    loadDoctorAbout();
  }, [userID, userData]);

  // ─── Abre e fecha o modal de edição de perfil geral (não incluí “About” aqui) ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleEditProfile = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // ─── Funções de persistência no Firestore ──────────────────────────────────

  // 1) Atualiza campos básicos em Users/{userID}
  const persistBasicInfo = async (
  novoName,
  novoLocation,
  novoPhone,
  novoEmail,
  novoCountry,
  novoSpecialization,
  novoCidSpecialties,
  novoProfessionalId,
  novoPhoto
) => {
  if (!userID) return;
  const basicData = {
    name: novoName,
    location: novoLocation,
    phone: novoPhone,
    email: novoEmail,
    country: novoCountry,
    specialization: novoSpecialization,
    cidSpecialties: novoCidSpecialties,
    professionalId: novoProfessionalId,
    photo: novoPhoto,
  };
  try {
    await saveUserBasicInfo(userID, basicData);
  } catch (err) {
    console.error("Erro ao persistir basic info:", err);
  }
};

  // 2) Atualiza TODO o “About” (incluindo aboutText) em Users/{userID}/About/Info
  const persistDoctorAbout = async (
    novoTitle,
    novoSpecialties,
    novoHospital,
    novoCrm,
    novoAboutText,
    novoProcedures,
    novoExperiences
  ) => {
    if (!userID) return;
    const aboutData = {
      title: novoTitle,
      specialties: novoSpecialties,
      hospital: novoHospital,
      crm: novoCrm,
      about: novoAboutText,
      procedures: novoProcedures,
      experiences: novoExperiences,
    };
    try {
      await saveDoctorAbout(userID, aboutData);
    } catch (err) {
      console.error("Erro ao persistir Doctor About:", err);
    }
  };

  // ─── Handlers de ExperienceSection (sem alteração) ────────────────────────
  const handleAddExperience = (newExperience) => {
    const updated = [...experiences, newExperience];
    setExperiences(updated);
    persistDoctorAbout(
      title,
      specialties,
      hospital,
      crm,
      aboutText,
      procedures,
      updated
    );
  };

  const handleEditExperience = (index, updatedExperience) => {
    const updatedArr = [...experiences];
    updatedArr[index] = updatedExperience;
    setExperiences(updatedArr);
    persistDoctorAbout(
      title,
      specialties,
      hospital,
      crm,
      aboutText,
      procedures,
      updatedArr
    );
  };

  const handleDeleteExperience = (index) => {
    const updatedArr = experiences.filter((_, i) => i !== index);
    setExperiences(updatedArr);
    persistDoctorAbout(
      title,
      specialties,
      hospital,
      crm,
      aboutText,
      procedures,
      updatedArr
    );
  };

  // ─── Salvar todas as informações quando fechar modal geral (exceto “About”) ──
  const handleSaveAllDoctorInfo = () => {
    // 1) Persistir campos básicos
    persistBasicInfo(
  name,
  location,
  phone,
  email,
  country,
  specialization,
  cidSpecialties,
  professionalId,
  photo
);
    // 2) Persistir TODO o “About” (title, specialties, hospital, crm, aboutText, procedures, experiences)
    persistDoctorAbout(title, specialties, hospital, crm, aboutText, procedures, experiences);
    // 3) Fechar modal
    setIsModalOpen(false);
  };

  if (loading) {
    return <p>{t("profile.loading")}...</p>;
  }

  return (
    <div className={styles.neurologistProfile}>
      {isModalOpen && (
        <DoctorProfileEditModal
          name={name}
          setName={setName}
          location={location}
          setLocation={setLocation}
          phone={phone}
          setPhone={setPhone}
          email={email}
          setEmail={setEmail}
          setCrm={setCrm}
          country={country}
          setCountry={setCountry}
          specialization={specialization}
          setSpecialization={setSpecialization}
          cidSpecialties={cidSpecialties || []}
          professionalId={professionalId}
          setProfessionalId={setProfessionalId}
          onSave={handleSaveAllDoctorInfo}
          onCancel={handleCloseModal}
          photo={photo}
          setPhoto={setPhoto}
        />
      )}
      {/* ─── HEADER ──────────────────────────────────────────────────────────────── */}
      <header className={styles.profileHeader}>
        <div className={styles.profileImage}>
          <img
            src={getProfileImageSource()}
            alt={t("profile.alt")}
            className={styles.avatar}
            onError={(e) => (e.target.src = defaultProfileIcon)}
          />
          <button className={styles.editButton} onClick={handleEditProfile}>
            {t("profile.edit")}
          </button>
        </div>

        <div className={styles.headerInfo}>
          <div className={styles.titleContainer}>
            <h1>{name}</h1>
            <div className={styles.crmBadge}>{professionalId}</div>
          </div>

          <h2>{specialization}</h2>

          <div className={styles.hospitalInfo}>
              <p className={styles.hospitalLocation}>{country + " " + location}</p>
          </div>

          <div className={styles.specialtiesTags}>
            {cidSpecialties.map((cidSpecialties, index) => (
              <span key={index} className={styles.specialtyTag}>
                {cidSpecialties}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ───────────────────────────────────────────────────────── */}
      <main className={styles.profileContent}>
        {/* ─── SEÇÃO “SOBRE” ─────────────────────────────────────────────────────── */}
        <section
          className={styles.aboutSection}
          onMouseEnter={() => setIsAboutHover(true)}
          onMouseLeave={() => setIsAboutHover(false)}
          style={{ position: "relative" }}
        >
          <h3 className={styles.sectionTitle} style={{ color: "#ffffff" }}>
            <i className={`fas fa-user-md ${styles.icon}`}></i> {t("profile.about")}
          </h3>

          {/* ─── BOTÃO DE EDIÇÃO QUE APARECE AO PASSAR O MOUSE ─────────────────────── */}
          {isAboutHover && !isEditingAbout && (
            <button
              className={styles.editAboutButton}
              onClick={() => {
                setDraftAbout(aboutText);
                setIsEditingAbout(true);
              }}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "transparent",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "1.1rem",
              }}
            >
              <FaRegEdit />
            </button>
          )}

          {/* ─── SE ESTÁ EDITANDO, MOSTRAMOS UMA TEXTAREA E BOTÕES “Salvar”/“Cancelar” ─ */}
          {isEditingAbout ? (
            <div className={styles.editAboutContainer}>
              <textarea
                className={styles.editAboutTextarea}
                value={draftAbout}
                onChange={(e) => setDraftAbout(e.target.value)}
                rows={4}
              />

              <div className={styles.editAboutActions}>
                <button
                  className={styles.saveAboutButton}
                  onClick={() => {
                    // Salva no Firestore
                    const novoAbout = draftAbout.trim();
                    setAboutText(novoAbout);
                    persistDoctorAbout(
                      title,
                      specialties,
                      hospital,
                      crm,
                      novoAbout,
                      procedures,
                      experiences
                    );
                    setIsEditingAbout(false);
                  }}
                >
                  <FaSave /> {t("profile.save")}
                </button>

                <button
                  className={styles.cancelAboutButton}
                  onClick={() => {
                    // Cancela a edição, sem persistir
                    setDraftAbout(aboutText);
                    setIsEditingAbout(false);
                  }}
                >
                  <FaTimes /> {t("profile.cancel")}
                </button>
              </div>
            </div>
          ) : (
            // ─── SE NÃO ESTÁ EDITANDO, MOSTRA O PARÁGRAFO NORMAL ───────────────────
            <p className={styles.aboutText}>{aboutText}</p>
          )}
        </section>

        <div className={styles.contentColumns}>
          {/* ─── Coluna Esquerda: EXPERIÊNCIAS ──────────────────────────────────────── */}
          <div className={styles.columnLeft}>
            <ExperienceSection
              experiences={experiences}
              onAdd={handleAddExperience}
              onEdit={handleEditExperience}
              onDelete={handleDeleteExperience}
            />
          </div>

          {/* ─── Coluna Direita: PROCEDIMENTOS E CONTATO ───────────────────────────── */}
          <div className={styles.columnRight}>
            {/* ─── PROCEDURES (pode ignorar por ora) ──────────────────────────────── */}
            <section className={styles.proceduresSection}>
              <h3 className={styles.sectionTitle}>
                <i className={`fas fa-procedures ${styles.icon}`}></i>{" "}
                {t("profile.procedures")}
              </h3>
              <ul className={styles.proceduresList}>
                {procedures.map((procedure, index) => (
                  <li key={index}>
                    <i className={`fas fa-check-circle ${styles.icon}`}></i>{" "}
                    {procedure}
                  </li>
                ))}
              </ul>
            </section>

            {/* ─── CONTATO (telefone, email, emergência) ────────────────────────────── */}
            <section className={styles.contactSection}>
              <h3 className={styles.sectionTitle}>
                <i className={`fas fa-address-card ${styles.icon}`}></i>{" "}
                {t("profile.contact")}
              </h3>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <i className={`fas fa-phone ${styles.icon}`}></i>
                  <div>
                    <p>{t("profile.tell")}</p>
                    <a href={`tel:${phone}`}>{phone}</a>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <i className={`fas fa-envelope ${styles.icon}`}></i>
                  <div>
                    <p>{t("profile.emailP")}</p>
                    <a href={`mailto:${email}`}>{email}</a>
                  </div>
                </div>

                <div className={`${styles.contactItem} ${styles.emergency}`}>
                  <i className={`fas fa-exclamation-triangle ${styles.icon}`}></i>
                  <div>
                    <p>{t("profile.emergencies")}</p>
                    <a href={`tel:${phone}`}>{phone}</a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

     
    </div>
  );
};

export default DoctorProfilePage;
