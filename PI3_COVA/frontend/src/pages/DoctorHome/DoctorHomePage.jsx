import { useAccount } from '../../contexts/Account/AccountProvider';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  TimeScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  CategoryScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { fetchPendingReviews } from '../../api/firebase';
import {
  collection,
  getDocs
} from 'firebase/firestore';
import { db } from '../../api/firebase';
import { Link } from 'react-router-dom';
import { useScreenResize } from "../../contexts/ScreenResizeProvider/ScreenResizeProvider";
ChartJS.register(
  CategoryScale,
  LineElement,
  PointElement,
  TimeScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const DoctorHomePage = () => {
  const { userData, loading } = useAccount();
  const { isMobile } = useScreenResize();
  const { t } = useTranslation();

  // States para casos
  const [stats, setStats] = useState({
    totalCases: 0,
    g43Cases: 0,
    g44Cases: 0,
    criticalCases: 0
  });
  const [chartData, setChartData] = useState({ datasets: [] });
  const [loadingCases, setLoadingCases] = useState(true);
  // States para análises pendentes
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);

  const formatDate = (timestamp) => {
  
  const date = timestamp?.toDate ? timestamp.toDate() : timestamp;

  if (!(date instanceof Date) || isNaN(date)) return '--/--/----';

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

  const extractCID = (messages) => {
    const ia = messages.find(m => m.role === 'assistant')?.content || '';
    const match = ia.match(/CID-10\s*(G43|G44)/);
    return match ? match[1] : 'G44';
  };

  

  // Carrega casos para stats e gráfico
  useEffect(() => {
    const loadCases = async () => {
      setLoadingCases(true);
      try {
        const casesRef = collection(db, 'Cases');
        const snapshot = await getDocs(casesRef);
        let g43 = 0, g44 = 0, critical = 0;
        
        const monthly = Array(12).fill().map(() => ({ G43: 0, G44: 0 }));
        const monthlyCount = Array.from({ length: 12 }, () => ({ G43: 0, G44: 0 }));
        snapshot.forEach(doc => {
          const data = doc.data();

          // 1. Pega o campo correto (no seu JSON é "CID", não "cid")
          const cid = data.CID || '';            

          // 2. Converte a string ISO em Date
          let date;
          if (data.Timestamp instanceof Date) {
            date = data.Timestamp;
          } else {
            date = new Date(data.Timestamp);
          }

          if (date instanceof Date && !isNaN(date)) {
            const m = date.getMonth();
            if (cid.startsWith('G43')) monthlyCount[m].G43++;
            if (cid.startsWith('G44')) monthlyCount[m].G44++;
          }
        });


        const labels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
        
        snapshot.forEach(doc => {
          const data = doc.data();
          const cid = data.CID || data.cid;
          const intensity = (data.intensidade || '').toLowerCase();
          const priority = (data.Priority || "").toLowerCase();
          if (cid.startsWith('G43')) g43++;
          else if (cid.startsWith('G44')) g44++;
          if (intensity === 'incapacitante' || priority === "vermelho") critical++;
          const date = data.createdAt?.toDate();
          if (date) {
            const m = date.getMonth();
            if (cid.startsWith('G43')) monthly[m].G43++;
            else if (cid.startsWith('G44')) monthly[m].G44++;
          }
        });
        setStats({ totalCases: snapshot.size, g43Cases: g43, g44Cases: g44, criticalCases: critical });
        // Chart data
        setChartData({
          labels,
          datasets: [
            {
              label: 'G43',
              data: monthlyCount.map(m => m.G43),
              borderColor: '#4e79a7',
              backgroundColor: 'rgba(78,121,167,0.1)',
              tension: 0.3,
              borderWidth: 2
            },
            {
              label: 'G44',
              data: monthlyCount.map(m => m.G44),
              borderColor: '#c77320',
              backgroundColor: 'rgba(242,142,43,0.1)',
              tension: 0.3,
              borderWidth: 2
            }
          ]
        });
      } catch (err) {
        console.error('Erro loadCases:', err);
      } finally {
        setLoadingCases(false);
      }
    };
    loadCases();
  }, []);

useEffect(() => {
  const loadAnalyses = async () => {
    setLoadingAnalyses(true);
    try {
      const pendings = await fetchPendingReviews();

      const processed = pendings.map(p => ({
        ...p,
        timestamp: p.timestamp?.toDate ? p.timestamp.toDate() : new Date(0) 
      }));

      const sorted = processed.sort((a, b) => b.timestamp - a.timestamp);

      const recents = sorted.slice(0, 5).map(p => ({
        id: p.id,
        codigo: extractCID(p.messages),
        priority: p.priority,
        date: formatDate(p.timestamp),
      }));

      setRecentAnalyses(recents);
    } catch (err) {
      console.error("Erro loadAnalyses:", err);
    } finally {
      setLoadingAnalyses(false);
    }
  };

  loadAnalyses();
}, []);



  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Evolução Mensal de Casos' }
    },
    scales: {
      x: { type: 'category', ticks: { autoSkip: false } },
      y: { beginAtZero: true }
    }
  };

  if (loading || loadingCases) return <div className={styles.loading}>{t('common.loading')}</div>;

  if (isMobile) {
      return (
  <div className={styles.container}>
    <header className={styles.header}>
      <h1>Bem‑vindo, {userData?.name?.split(' ').slice(0,4).join(' ')}</h1>
      <p>Painel de acompanhamento de casos e análises</p>
    </header>

    <main className={styles.content}>
      {/* Estatísticas de Cases: grid 2x2 */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.primary}`}>
          <h3>Total de Casos</h3>
          <p>{stats.totalCases}</p>
          <small>Registrados no sistema</small>
        </div>
        <div className={`${styles.statCard} ${styles.warning}`}>
          <h3>Casos G43</h3>
          <p>{stats.g43Cases}</p>
          <small>Enxaqueca</small>
        </div>
        <div className={`${styles.statCard} ${styles.info}`}>
          <h3>Casos G44</h3>
          <p>{stats.g44Cases}</p>
          <small>Algias cranianas</small>
        </div>
        <div className={`${styles.statCard} ${styles.danger}`}>
          <h3>Casos Críticos</h3>
          <p>{stats.criticalCases}</p>
          <small>Necessitam atenção</small>
        </div>
      </div>

      {/* Análises Recentes: cada célula como link */}
      <section className={styles.recentCases}>
        <div className={styles.sectionHeader}>
          <h2>Análises Recentes</h2>
          <Link to="/analysis" className={styles.seeAllButton}>
            Ver todos
          </Link>
        </div>
        <div className={styles.tableContainer}>
          {loadingAnalyses ? (
            <p>Carregando...</p>
          ) : (
            <table style={{ width: '100%', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Prioridade</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {recentAnalyses.map(a => (
                  <tr key={a.id} style={{ cursor: 'pointer' }}>
                    <td>
                      <Link
                        to={`/analysis/${a.id}`}
                        style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none', color: 'inherit' }}
                      >
                        {a.codigo}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/analysis/${a.id}`}
                        style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none', color: 'inherit' }}
                      >
                        {a.priority}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/analysis/${a.id}`}
                        style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none', color: 'inherit' }}
                      >
                        {a.date}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Gráfico de Casos Mensais: responsivo */}
      <section className={styles.chartsSection}>
        <h2>Evolução Mensal de Casos</h2>
        <div className={styles.chartContainer} style={{ width: '100%', height: '300px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </section>
    </main>
  </div>
);

  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Bem-vindo, {userData?.name?.split(' ').slice(0,4).join(' ')}</h1>
        <p>Painel de acompanhamento de casos e análises</p>
      </header>

      <main className={styles.content}>
        {/* Estatísticas de Cases */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.primary}`}><h3>Total de Casos</h3><p>{stats.totalCases}</p><small>Registrados no sistema</small></div>
          <div className={`${styles.statCard} ${styles.warning}`}><h3>CID-10 G43</h3><p>{stats.g43Cases}</p><small>Casos de enxaqueca</small></div>
          <div className={`${styles.statCard} ${styles.info}`}><h3>CID-10 G44</h3><p>{stats.g44Cases}</p><small>Outras síndromes de algias cranianas</small></div>
          <div className={`${styles.statCard} ${styles.danger}`}><h3>Casos Críticos</h3><p>{stats.criticalCases}</p><small>Necessitando atenção</small></div>
        </div>

      <div className={styles.contentRow}>
        {/* Análises Recentes */}
        <section className={styles.recentCases}>
      <div className={styles.sectionHeader}>
        <h2>Análises Recentes</h2>
        <Link to="/analysis" className={styles.seeAllButton}>
          Ver todos
        </Link>
      </div>
      <div className={styles.tableContainer}>
        {loadingAnalyses ? (
          <p>Carregando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Prioridade</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {recentAnalyses.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>
                    <span
                      className={`${styles.code} ${
                        a.codigo === 'G43'
                          ? styles.g43
                          : a.codigo === 'G44'
                          ? styles.g44
                          : ''
                      }`}>
                      {a.codigo}
                    </span>
                  </td>
                  <td>
                    <span className={styles[a.priority.toLowerCase()]}> 
                      {a.priority}
                    </span>
                  </td>
                  <td>{a.date}</td>
                  <td>
                    <Link
                      to={`/analysis/${a.id}`}
                      className={styles.actionButton}
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>

        {/* Gráfico de Casos Mensais */}
        <section className={styles.chartsSection}>
          <h2>Evolução Mensal de Casos</h2>
            <div className={styles.chartContainer}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </section>
        </div>
      </main>
    </div>
  );
};

export default DoctorHomePage;
