import { useState, useEffect } from "react";
import { useAccount } from "../../contexts/Account/AccountProvider";
import defaultProfileIcon from "../../public/UserDefault.webp";
import { useTranslation } from "react-i18next";

import { FaRegEdit } from "react-icons/fa";

import styles from './styles.module.scss';

const DoctorProfilePage = () => {
  const { userData, loading } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  
  const handleEditProfile = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const getProfileImageSource = () => {
    if (!userData.photo) return defaultProfileIcon;
    if (
      userData.photo.startsWith("http") ||
      userData.photo.startsWith("data:image")
    )
      return userData.photo;
    return defaultProfileIcon;
  };

  
  const doctor = {
    title: "Neurologista Especialista em Cefaleias",
    specialties: [
      "Enxaqueca (CID-10 G43)",
      "Cefaleias Tensionais (CID-10 G44.2)",
      "Cefaleias em Salvas (CID-10 G44.0)",
      "Neuralgia do Trigêmeo (CID-10 G44.847)",
      "Cefaleias Crônicas Diárias"
    ],
    hospital: "Instituto de Neurologia Avançada",
    crm: "CRM-SP 45.678",
    about: "Especialista em diagnóstico e tratamento de cefaleias e enxaquecas com mais de 15 anos de experiência. Membro da Sociedade Brasileira de Cefaleia e da International Headache Society. Atua com abordagem multidisciplinar incluindo tratamentos medicamentosos, toxina botulínica e orientação comportamental.",
    experience: [
      {
        position: "Coordenador do Ambulatório de Cefaleias",
        institution: "Instituto de Neurologia Avançada",
        period: "2019 - Presente",
        description: "Liderança da equipe multidisciplinar especializada no tratamento de cefaleias primárias e secundárias."
      },
      {
        position: "Neurologista Clínico",
        institution: "Hospital Israelita Albert Einstein",
        period: "2014 - 2019",
        description: "Atendimento em emergência neurológica e ambulatório especializado em cefaleias."
      }
    ],
    procedures: [
      "Aplicação de Toxina Botulínica para Enxaqueca Crônica",
      "Bloqueios Anestésicos para Cefaleias",
      "Infusões Intravenosas para Crises Agudas",
      "Terapia de Estimulação Magnética Transcraniana",
      "Orientações sobre Gatilhos e Prevenção"
    ]
  };

  return (
    <div className={styles.neurologistProfile}>
      {/* Header */}
      <header className={styles.profileHeader}>
        <div className={styles.profileImage}>
          <img
              src={getProfileImageSource()}
              alt={t("profile.alt")}
              className={styles.avatar}
              onError={(e) => (e.target.src = defaultProfileIcon)}
            />
          <button 
            className={styles.editButton}
            onClick={handleEditProfile}
          >
            Editar Perfil
          </button>
        </div>
        
        <div className={styles.headerInfo}>
          <div className={styles.titleContainer}>
            <h1>{userData.name}</h1>
            <div className={styles.crmBadge}>{doctor.crm}</div>
          </div>
          
          <h2>{doctor.title}</h2>
          
          <div className={styles.hospitalInfo}>
            <div>
              <p className={styles.hospitalName}>{doctor.hospital}</p>
              <p className={styles.hospitalLocation}>{userData?.location}</p>
            </div>
          </div>
          
          <div className={styles.specialtiesTags}>
            {doctor.specialties.map((specialty, index) => (
              <span key={index} className={styles.specialtyTag}>{specialty}</span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.profileContent}>
        <section className={styles.aboutSection}>
          <h3 className={styles.sectionTitle} style={{color:"#ffffff"}}>
            <i className={`fas fa-user-md ${styles.icon}`}></i> Sobre o Especialista
          </h3>
          <p>{doctor.about}</p>
        </section>

        <div className={styles.contentColumns}>
          {/* Left Column */}
          <div className={styles.columnLeft}>
            <section className={styles.experienceSection}>
              <h3 className={styles.sectionTitle}>
                <i className={`fas fa-briefcase ${styles.icon}`}></i> Experiência Profissional
              </h3>
              <div className={styles.timeline}>
                {doctor.experience.map((item, index) => (
                  <div key={index} className={styles.timelineItem}>
                    <div className={styles.timelineMarker}></div>
                    <div className={styles.timelineContent}>
                      <h4>{item.position}</h4>
                      <p className={styles.institution}>{item.institution}</p>
                      <p className={styles.period}>{item.period}</p>
                      <p className={styles.description}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className={styles.columnRight}>
            <section className={styles.proceduresSection}>
              <h3 className={styles.sectionTitle}>
                <i className={`fas fa-procedures ${styles.icon}`}></i> Procedimentos Realizados
              </h3>
              <ul className={styles.proceduresList}>
                {doctor.procedures.map((procedure, index) => (
                  <li key={index}>
                    <i className={`fas fa-check-circle ${styles.icon}`}></i> {procedure}
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.contactSection}>
              <h3 className={styles.sectionTitle}>
                <i className={`fas fa-address-card ${styles.icon}`}></i> Contato
              </h3>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <i className={`fas fa-phone ${styles.icon}`}></i>
                  <div>
                    <p>Telefone para consultas:</p>
                    <a href={`tel:${userData?.phone}`}>{userData?.phone}</a>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <i className={`fas fa-envelope ${styles.icon}`}></i>
                  <div>
                    <p>E-mail profissional:</p>
                    <a href={`mailto:${userData?.email}`}>{userData?.email}</a>
                  </div>
                </div>
                
                <div className={`${styles.contactItem} ${styles.emergency}`}>
                  <i className={`fas fa-exclamation-triangle ${styles.icon}`}></i>
                  <div>
                    <p>Plantão/Urgências:</p>
                    <a href={`tel:${userData?.phone}`}>{userData?.phone}</a>
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