import { useAccount } from '../../contexts/Account/AccountProvider';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../api/firebase/';

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

  const [stats, setStats] = useState({
    totalCases: 0,
    g43Cases: 0,
    g44Cases: 0,
    criticalCases: 0
  });

  useEffect(() => {
    const fetchCases = async () => {
      const casesRef = collection(db, 'Cases');
      console.log(casesRef)
      const snapshot = await getDocs(casesRef);

      let g43 = 0, g44 = 0, critical = 0;

      snapshot.forEach(doc => {
        const data = doc.data();
        const cid = data.cid;
        const intensidade = data.intensidade;

        if (typeof cid === 'string') {
          if (cid.startsWith('G43')) g43++;
          else if (cid.startsWith('G44')) g44++;
        }

        if (intensidade === 'incapacitante') {
          critical++;
        }
      });

      setStats({
        totalCases: snapshot.size,
        g43Cases: g43,
        g44Cases: g44,
        criticalCases: critical
      });
    };

    fetchCases();
  }, []);

  // Dados mockados para a tabela de casos recentes
  const mockRecentPatients = [
    {
      id: 'ABC123',
      name: 'João Silva',
      age: 34,
      diagnosis: 'G43.0',
      lastVisit: '10/05/2025'
    },
    {
      id: 'DEF456',
      name: 'Maria Oliveira',
      age: 28,
      diagnosis: 'G44.2',
      lastVisit: '08/05/2025'
    },
    {
      id: 'GHI789',
      name: 'Carlos Souza',
      age: 45,
      diagnosis: 'G43.1',
      lastVisit: '05/05/2025'
    },
    {
      id: 'JKL012',
      name: 'Ana Paula',
      age: 38,
      diagnosis: 'G44.8',
      lastVisit: '01/05/2025'
    }
  ];

  const monthlyData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'CID-10 G43 (Enxaqueca)',
        data: [65, 59, 70, 81, 76, 75, 80, 91, 85, 93, 106, 102],
        borderColor: '#4e79a7',
        backgroundColor: 'rgba(78, 121, 167, 0.1)',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'CID-10 G44 (Outras cefaleias)',
        data: [28, 32, 35, 40, 42, 38, 45, 50, 48, 52, 55, 60],
        borderColor: '#f28e2b',
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
          color: '#b0b0b0'
        }
      }
    }
  };

  if (loading) return <div>{t('common.loading')}</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Bem-vindo, {userData?.name?.split(' ').slice(0, 4).join(' ') ?? t('home.user')}</h1>
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
                  {mockRecentPatients.map(patient => (
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
                        <button className={styles.actionButton}>Visualizar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

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
