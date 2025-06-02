import styles from './styles.module.scss';

const DoctorProfilePage = () => {
  const doctor = {
    name: "Dr. Rafael Oliveira",
    title: "Neurologista Especialista em Cefaleias",
    specialties: [
      "Enxaqueca (CID-10 G43)",
      "Cefaleias Tensionais (CID-10 G44.2)",
      "Cefaleias em Salvas (CID-10 G44.0)",
      "Neuralgia do Trigêmeo (CID-10 G44.847)",
      "Cefaleias Crônicas Diárias"
    ],
    hospital: "Instituto de Neurologia Avançada",
    location: "São Paulo, SP",
    crm: "CRM-SP 45.678",
    email: "dr.rafael.oliveira@inaneuro.com.br",
    phone: "(11) 9876-5432",
    emergencyContact: "(11) 9876-5000",
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

  const handleEditProfile = () => {
      // Função vazia por enquanto, como solicitado
  };

  return (
    <div className={styles.neurologistProfile}>
      {/* Header */}
      <header className={styles.profileHeader}>
        <div className={styles.profileImage}>
          <div className={styles.avatar}>RO</div>
          <button 
            className={styles.editButton}
            onClick={handleEditProfile}
          >
            <i className={`fas fa-edit ${styles.editIcon}`}></i> Editar Perfil
          </button>
        </div>
        
        <div className={styles.headerInfo}>
          <div className={styles.titleContainer}>
            <h1>{doctor.name}</h1>
            <div className={styles.crmBadge}>{doctor.crm}</div>
          </div>
          
          <h2>{doctor.title}</h2>
          
          <div className={styles.hospitalInfo}>
            <i className={`fas fa-hospital ${styles.icon}`}></i>
            <div>
              <p className={styles.hospitalName}>{doctor.hospital}</p>
              <p className={styles.hospitalLocation}>{doctor.location}</p>
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
                    <a href={`tel:${doctor.phone}`}>{doctor.phone}</a>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <i className={`fas fa-envelope ${styles.icon}`}></i>
                  <div>
                    <p>E-mail profissional:</p>
                    <a href={`mailto:${doctor.email}`}>{doctor.email}</a>
                  </div>
                </div>
                
                <div className={`${styles.contactItem} ${styles.emergency}`}>
                  <i className={`fas fa-exclamation-triangle ${styles.icon}`}></i>
                  <div>
                    <p>Plantão/Urgências:</p>
                    <a href={`tel:${doctor.emergencyContact}`}>{doctor.emergencyContact}</a>
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