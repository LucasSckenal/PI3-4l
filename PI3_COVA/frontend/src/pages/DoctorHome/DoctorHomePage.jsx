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
    if (!timestamp?.toDate) return '--/--/----';
    const date = timestamp.toDate();
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
          const cid = data.cid || '';
          const date = data.createdAt?.toDate();
          if (date) {
            const m = date.getMonth();
            if (cid.startsWith('G43')) monthlyCount[m].G43++;
            if (cid.startsWith('G44')) monthlyCount[m].G44++;
          }
        });

        const labels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
        
        snapshot.forEach(doc => {
          const data = doc.data();
          const cid = data.cid || '';
          const intensity = (data.intensidade || '').toLowerCase();
          const priority = (data.priority || "").toLowerCase();
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
              borderColor: '#f28e2b',
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

  // Carrega análises pendentes para seção de análises recentes
  useEffect(() => {
    const loadAnalyses = async () => {
      setLoadingAnalyses(true);
      try {
        const pendings = await fetchPendingReviews();
        const recents = pendings.slice(0,4).map(p => ({
          id: p.id,
          codigo: extractCID(p.messages),
          priority: p.priority,
          date: formatDate(p.timestamp)
        }));
        setRecentAnalyses(recents);
      } catch (err) {
        console.error('Erro loadAnalyses:', err);
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
          <div className={styles.sectionHeader}><h2>Análises Recentes</h2></div>
          <div className={styles.tableContainer}>
            {loadingAnalyses ? <p>Carregando...</p> : (
              <table>
                <thead><tr><th>ID</th><th>Código</th><th>Prioridade</th><th>Data</th></tr></thead>
                <tbody>
                  {recentAnalyses.map(a => (
                    <tr key={a.id}><td>{a.id.substring(0,6)}...</td><td>{a.codigo}</td><td>{a.priority}</td><td>{a.date}</td></tr>
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
