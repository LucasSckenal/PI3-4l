// DoctorProfilePage.jsx
import { useState, useEffect } from "react";
import { useAccount } from "../../contexts/Account/AccountProvider";
import defaultProfileIcon from "../../public/UserDefault.webp";
import { useTranslation } from "react-i18next";
import { FaRegEdit } from "react-icons/fa";
import ExperienceSection from "../../components/ExperienceSection/ExperienceSection";
import styles from "./styles.module.scss";

import {
  saveUserBasicInfo,
  saveDoctorAbout,
  fetchUserBasicInfo,
  fetchDoctorAbout,
} from "../../api/firebase"; // Ajuste o path conforme sua estrutura

const DoctorProfilePage = () => {
  const { userData, loading } = useAccount();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Estados para os dados básicos do Usuário ---
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // --- Estados para “Sobre o Médico” ---
  const [title, setTitle] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [hospital, setHospital] = useState("");
  const [crm, setCrm] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [procedures, setProcedures] = useState([]);
  const [experiences, setExperiences] = useState([]);

  // OBS.: usamos agora o UID do usuário autenticado como chave para Firestore
  const userID = userData?.uid;

  // Função para obter a URL da imagem (se houver)
  const getProfileImageSource = () => {
    if (!userData.photo) return defaultProfileIcon;
    if (
      userData.photo.startsWith("http") ||
      userData.photo.startsWith("data:image")
    )
      return userData.photo;
    return defaultProfileIcon;
  };

  // Ao montar o componente (ou quando userData for carregado), busca do Firestore:
  // 1. Dados básicos (nome, location, phone, email) em Users/{userID}
  // 2. Dados de “About” em Users/{userID}/About/Info
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
        } else {
          // Se não existir ainda no Firestore, inicializa com dados vindos do context (se houver)
          setName(userData.name || "");
          setLocation(userData.location || "");
          setPhone(userData.phone || "");
          setEmail(userData.email || "");
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

  // Abre e fecha o modal de edição de perfil
  const handleEditProfile = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // === Funções de sincronização no Firestore ===

  // 1) Sempre que o médico alterar dados básicos (nome, location, phone, email),
  // chamamos esta função para salvar em "Users/{userID}"
  const persistBasicInfo = async (novoName, novoLocation, novoPhone, novoEmail) => {
    if (!userID) return;
    const basicData = {
      name: novoName,
      location: novoLocation,
      phone: novoPhone,
      email: novoEmail,
    };
    try {
      await saveUserBasicInfo(userID, basicData);
    } catch (err) {
      console.error("Erro ao persistir basic info:", err);
    }
  };

  // 2) Sempre que o médico alterar QUALQUER campo de “Sobre o Médico”,
  // chamamos esta função para salvar em "Users/{userID}/About/Info"
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

  // === Handlers de ExperienceSection ===

  // Ao adicionar uma nova experiência:
  const handleAddExperience = (newExperience) => {
    const updated = [...experiences, newExperience];
    setExperiences(updated);
    // Persiste já no Firestore
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

  // Ao editar uma experiência (recebemos índice e objeto atualizado):
  const handleEditExperience = (index, updatedExperience) => {
    const updatedArr = [...experiences];
    updatedArr[index] = updatedExperience;
    setExperiences(updatedArr);
    // Persiste no Firestore
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

  // Ao deletar uma experiência:
  const handleDeleteExperience = (index) => {
    const updatedArr = experiences.filter((_, i) => i !== index);
    setExperiences(updatedArr);
    // Persiste no Firestore
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

  // === Handlers para edição geral de “Sobre o Médico” (no modal) ===
  const handleSaveAllDoctorInfo = () => {
    // 1) Persistimos basic info (name, location, phone, email)
    persistBasicInfo(name, location, phone, email);

    // 2) Persistimos “Sobre”:
    persistDoctorAbout(title, specialties, hospital, crm, aboutText, procedures, experiences);

    // 3) Fechamos o modal
    setIsModalOpen(false);
  };

  if (loading) {
    return <p>{t("profile.loading")}...</p>;
  }

  return (
    <div className={styles.neurologistProfile}>
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
            <div className={styles.crmBadge}>{crm}</div>
          </div>

          <h2>{title}</h2>

          <div className={styles.hospitalInfo}>
            <div>
              <p className={styles.hospitalName}>{hospital}</p>
              <p className={styles.hospitalLocation}>{location}</p>
            </div>
          </div>

          <div className={styles.specialtiesTags}>
            {specialties.map((specialty, index) => (
              <span key={index} className={styles.specialtyTag}>
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.profileContent}>
        <section className={styles.aboutSection}>
          <h3 className={styles.sectionTitle} style={{ color: "#ffffff" }}>
            <i className={`fas fa-user-md ${styles.icon}`}></i> {t("profile.about")}
          </h3>
          <p>{aboutText}</p>
        </section>

        <div className={styles.contentColumns}>
          {/* Coluna Esquerda */}
          <div className={styles.columnLeft}>
            <ExperienceSection
              experiences={experiences}
              onAdd={handleAddExperience}
              onEdit={handleEditExperience}
              onDelete={handleDeleteExperience}
            />
          </div>

          {/* Coluna Direita */}
          <div className={styles.columnRight}>
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

      {/* ==============================
           Modal de Edição de Perfil
           ================================= */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{t("profile.editProfile")}</h2>

            {/* FORMULÁRIO BÁSICO: Nome, Location, Phone, Email */}
            <div className={styles.formGroup}>
              <label>{t("profile.name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("profile.location")}</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("profile.phone")}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("profile.emailP")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* FORMULÁRIO “SOBRE O MÉDICO”: */}
            <div className={styles.formGroup}>
              <label>{t("profile.title")}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("profile.specialties")}</label>
              <input
                type="text"
                placeholder={t("profile.specialtiesPlaceholder")}
                value={specialties.join(", ")}
                onChange={(e) =>
                  setSpecialties(
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0)
                  )
                }
              />
              <small>{t("profile.specialtiesHint")}</small>
            </div>
            <div className={styles.formGroup}>
              <label>{t("profile.hospital")}</label>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("profile.crm")}</label>
              <input
                type="text"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("profile.about")}</label>
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("profile.procedures")}</label>
              <input
                type="text"
                placeholder={t("profile.proceduresPlaceholder")}
                value={procedures.join(", ")}
                onChange={(e) =>
                  setProcedures(
                    e.target.value
                      .split(",")
                      .map((p) => p.trim())
                      .filter((p) => p.length > 0)
                  )
                }
              />
              <small>{t("profile.proceduresHint")}</small>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.saveButton}
                onClick={handleSaveAllDoctorInfo}
              >
                {t("profile.save")}
              </button>
              <button
                className={styles.cancelButton}
                onClick={handleCloseModal}
              >
                {t("profile.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfilePage;
