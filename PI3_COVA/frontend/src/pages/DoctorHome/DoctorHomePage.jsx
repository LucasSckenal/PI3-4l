import styles from './styles.module.scss';
import { useAccount } from '../../contexts/Account/AccountProvider';
import { useTranslation } from 'react-i18next';

const DoctorHomePage = () => {
  const { userData, loading } = useAccount();
  const { t } = useTranslation();

  // Dados fictícios para demonstração
  const stats = {
    totalCases: 1243,
    g43Cases: 876,
    g44Cases: 367,
    recentCases: 42,
    criticalCases: 18
  };

  const recentPatients = [
    { id: 1001, name: 'Maria Silva', age: 34, diagnosis: 'G43.1', lastVisit: '15/06/2023' },
    { id: 1002, name: 'João Santos', age: 45, diagnosis: 'G44.2', lastVisit: '14/06/2023' },
    { id: 1003, name: 'Ana Oliveira', age: 28, diagnosis: 'G43.0', lastVisit: '14/06/2023' },
    { id: 1004, name: 'Carlos Mendes', age: 52, diagnosis: 'G43.9', lastVisit: '13/06/2023' },
  ];

  if (loading) return <div>{t("common.loading")}</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Bem-vindo, {userData?.name?.split(" ").slice(0, 4).join(" ") ?? t("home.user")}</h1>
        <p className={styles.subtitle}>Painel de acompanhamento de casos CID-10 G43 e G44</p>
      </header>

      <main className={styles.content}>
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.primary}`}>
            <h3>Total de Casos</h3>
            <p>{stats.totalCases}</p>
            <small>Registrados no sistema</small>
          </div>
          <div className={`${styles.statCard} ${styles.warning}`}>
            <h3>CID-10 G43</h3>
            <p>{stats.g43Cases}</p>
            <small>Casos de enxaqueca</small>
          </div>
          <div className={`${styles.statCard} ${styles.info}`}>
            <h3>CID-10 G44</h3>
            <p>{stats.g44Cases}</p>
            <small>Outras síndromes de algias cranianas</small>
          </div>
          <div className={`${styles.statCard} ${styles.danger}`}>
            <h3>Casos Críticos</h3>
            <p>{stats.criticalCases}</p>
            <small>Necessitando atenção</small>
          </div>
        </div>

        <div className={styles.contentRow}>
          <section className={styles.recentCases}>
            <div className={styles.sectionHeader}>
              <h2>Casos Recentes</h2>
              <button className={styles.seeAllButton}>Ver todos</button>
            </div>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Paciente</th>
                    <th>Idade</th>
                    <th>Diagnóstico</th>
                    <th>Última Consulta</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPatients.map(patient => (
                    <tr key={patient.id}>
                      <td>{patient.id}</td>
                      <td>
                        <div className={styles.patientInfo}>
                          <span className={styles.patientName}>{patient.name}</span>
                        </div>
                      </td>
                      <td>{patient.age}</td>
                      <td>
                        <span className={`${styles.diagnosisBadge} ${patient.diagnosis.startsWith('G43') ? styles.migraine : styles.other}`}>
                          {patient.diagnosis}
                        </span>
                      </td>
                      <td>{patient.lastVisit}</td>
                      <td>
                        <button className={styles.actionButton}>
                          Visualizar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.quickActions}>
            <h2>Ações Rápidas</h2>
            <div className={styles.actionsGrid}>
              <button className={styles.actionButton}>
                <span className={styles.buttonIcon}>+</span>
                <span>Novo Paciente</span>
              </button>
              <button className={styles.actionButton}>
                <span className={styles.buttonIcon}>🔍</span>
                <span>Buscar CID</span>
              </button>
              <button className={styles.actionButton}>
                <span className={styles.buttonIcon}>📊</span>
                <span>Gerar Relatório</span>
              </button>
              <button className={styles.actionButton}>
                <span className={styles.buttonIcon}>📅</span>
                <span>Agendar Consulta</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DoctorHomePage;