import { useAccount } from '../../contexts/Account/AccountProvider';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './styles.module.scss';

// Registre os componentes do Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

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

  // Dados para o gráfico - evolução mensal
  const monthlyData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'CID-10 G43 (Enxaqueca)',
        data: [65, 59, 70, 81, 76, 75, 80, 91, 85, 93, 106, 102],
        borderColor: '#4e79a7', // Cor para G43
        backgroundColor: 'rgba(78, 121, 167, 0.1)',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'CID-10 G44 (Outras cefaleias)',
        data: [28, 32, 35, 40, 42, 38, 45, 50, 48, 52, 55, 60],
        borderColor: '#f28e2b', // Cor para G44
        backgroundColor: 'rgba(242, 142, 43, 0.1)',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e0e0e0',
          font: {
            family: "'Reddit Sans Condensed', sans-serif"
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#ffffff',
        bodyColor: '#e0e0e0',
        bodyFont: {
          family: "'Reddit Sans Condensed', sans-serif"
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#b0b0b0'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#b0b0b0',
          callback: function(value) {
            return value;
          }
        }
      }
    }
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

          {/* Nova seção de gráfico substituindo as ações rápidas */}
          <section className={styles.chartsSection}>
            <h2>Evolução Mensal de Casos</h2>
            <div className={styles.chartContainer}>
              <Line data={monthlyData} options={chartOptions} />
            </div>
            <div className={styles.chartFooter}>
              <span className={styles.footerItem}>
                <span className={styles.indicatorG43}></span>
                CID-10 G43: Enxaqueca
              </span>
              <span className={styles.footerItem}>
                <span className={styles.indicatorG44}></span>
                CID-10 G44: Outras cefaleias
              </span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DoctorHomePage;