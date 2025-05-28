import { useState } from 'react';
import { FiFilter, FiChevronDown } from 'react-icons/fi';
import { useScreenResize } from '../../contexts/ScreenResizeProvider/ScreenResizeProvider';
import styles from './styles.module.scss';

const AnalysisPage = () => {
  const { isMobile } = useScreenResize();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [ordemSelecionada, setOrdemSelecionada] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Dados mockados de diagnósticos
  const diagnosticosMockados = [
  // Diagnósticos G43 - Enxaquecas
  { id: 1, codigo: 'G43', descricao: 'Enxaqueca sem aura', prioridade: 'alta', dataCriacao: '2023-06-15', status: 'pendente' },
  { id: 2, codigo: 'G43', descricao: 'Enxaqueca com aura', prioridade: 'alta', dataCriacao: '2023-06-10', status: 'pendente' },
  { id: 3, codigo: 'G43', descricao: 'Enxaqueca crônica', prioridade: 'alta', dataCriacao: '2023-05-28', status: 'analisado' },
  { id: 4, codigo: 'G43', descricao: 'Estado de mal enxaquecoso', prioridade: 'alta', dataCriacao: '2023-06-05', status: 'pendente' },
  { id: 5, codigo: 'G43', descricao: 'Enxaqueca complicada', prioridade: 'média', dataCriacao: '2023-05-22', status: 'pendente' },
  { id: 6, codigo: 'G43', descricao: 'Enxaqueca basilar', prioridade: 'média', dataCriacao: '2023-06-12', status: 'analisado' },
  { id: 7, codigo: 'G43', descricao: 'Enxaqueca oftalmoplégica', prioridade: 'baixa', dataCriacao: '2023-05-30', status: 'pendente' },
  { id: 8, codigo: 'G43', descricao: 'Enxaqueca retiniana', prioridade: 'média', dataCriacao: '2023-06-08', status: 'pendente' },
  
  // Diagnósticos G44 - Outras cefaleias
  { id: 9, codigo: 'G44', descricao: 'Cefaleia tensional episódica', prioridade: 'média', dataCriacao: '2023-06-18', status: 'pendente' },
  { id: 10, codigo: 'G44', descricao: 'Cefaleia tensional crônica', prioridade: 'média', dataCriacao: '2023-05-25', status: 'analisado' },
  { id: 11, codigo: 'G44', descricao: 'Cefaleia em salvas', prioridade: 'alta', dataCriacao: '2023-06-20', status: 'pendente' },
  { id: 12, codigo: 'G44', descricao: 'Cefaleia pós-traumática', prioridade: 'baixa', dataCriacao: '2023-06-02', status: 'pendente' },
  { id: 13, codigo: 'G44', descricao: 'Cefaleia por abuso de medicamentos', prioridade: 'média', dataCriacao: '2023-05-20', status: 'analisado' },
  { id: 14, codigo: 'G44', descricao: 'Cefaleia atribuída a transtorno psiquiátrico', prioridade: 'baixa', dataCriacao: '2023-06-14', status: 'pendente' },
  { id: 15, codigo: 'G44', descricao: 'Cefaleia cervicogênica', prioridade: 'média', dataCriacao: '2023-05-31', status: 'pendente' },
  { id: 16, codigo: 'G44', descricao: 'Cefaleia hípnica', prioridade: 'baixa', dataCriacao: '2023-06-09', status: 'analisado' },
  
  // Casos mais recentes para testar ordenação
  { id: 17, codigo: 'G43', descricao: 'Enxaqueca vestibular', prioridade: 'média', dataCriacao: '2023-06-25', status: 'pendente' },
  { id: 18, codigo: 'G44', descricao: 'Cefaleia nova diária persistente', prioridade: 'alta', dataCriacao: '2023-06-24', status: 'pendente' },
  { id: 19, codigo: 'G43', descricao: 'Enxaqueca menstrual', prioridade: 'média', dataCriacao: '2023-06-22', status: 'pendente' },
  { id: 20, codigo: 'G44', descricao: 'Cefaleia por neuralgia do trigêmeo', prioridade: 'alta', dataCriacao: '2023-06-21', status: 'analisado' },
  
  // Casos com diferentes combinações para testes
  { id: 21, codigo: 'G43', descricao: 'Enxaqueca com aura prolongada', prioridade: 'alta', dataCriacao: '2023-05-12', status: 'pendente' },
  { id: 22, codigo: 'G44', descricao: 'Cefaleia por tosse', prioridade: 'baixa', dataCriacao: '2023-06-01', status: 'analisado' },
  { id: 23, codigo: 'G43', descricao: 'Enxaqueca hemiplégica familiar', prioridade: 'alta', dataCriacao: '2023-05-08', status: 'pendente' },
  { id: 24, codigo: 'G44', descricao: 'Cefaleia por esforço físico', prioridade: 'média', dataCriacao: '2023-06-17', status: 'pendente' }
];

  // Função para filtrar e ordenar os diagnósticos
  const getDiagnosticosFiltrados = () => {
    let diagnosticos = [...diagnosticosMockados];
    
    if (categoriaSelecionada) {
      diagnosticos = diagnosticos.filter(d => d.codigo === categoriaSelecionada);
    }
    
    if (ordemSelecionada === 'prioridade') {
      const ordemPrioridade = { alta: 1, média: 2, baixa: 3 };
      diagnosticos.sort((a, b) => ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade]);
    } else if (ordemSelecionada === 'data') {
      diagnosticos.sort((a, b) => new Date(a.dataCriacao) - new Date(b.dataCriacao));
    }
    
    return diagnosticos;
  };

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {/* Seção de Cards (apenas desktop) */}
        {!isMobile && (
          <section className={styles.cardsSection}>
            <div className={styles.card}>
              <h3>Diagnósticos Pendentes</h3>
              <p className={styles.cardNumber}>
                {diagnosticosMockados.filter(d => d.status === 'pendente').length}
              </p>
            </div>
            <div className={`${styles.card} ${styles.cardGrave}`}>
              <h3>Casos Graves</h3>
              <p className={styles.cardNumber}>
                {diagnosticosMockados.filter(d => d.status === 'pendente' && d.prioridade === 'alta').length}
              </p>
            </div>
          </section>
        )}

        {/* Lista de diagnósticos com filtros */}
        <section className={styles.listaDiagnosticos}>
          <div className={styles.listaHeader}>
            <h2 className={styles.sectionTitle}>Diagnósticos</h2>
            
            {isMobile ? (
              <div className={styles.filtroMobile}>
                <button 
                  className={styles.botaoFiltro}
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                >
                  <FiFilter className={styles.iconeFiltro} />
                  <FiChevronDown className={`${styles.iconeSeta} ${mostrarFiltros ? styles.viradoParaCima : ''}`} />
                </button>
              </div>
            ) : (
              <div className={styles.filtroDesktop}>
                <div className={styles.grupoFiltro}>
                  <select 
                    className={styles.selectFiltro}
                    value={categoriaSelecionada || ''}
                    onChange={(e) => setCategoriaSelecionada(e.target.value || null)}
                  >
                    <option value="">Todas categorias</option>
                    <option value="G43">G43</option>
                    <option value="G44">G44</option>
                  </select>
                </div>
                
                <div className={styles.grupoFiltro}>
                  <select 
                    className={styles.selectFiltro}
                    value={ordemSelecionada || ''}
                    onChange={(e) => setOrdemSelecionada(e.target.value || null)}
                  >
                    <option value="">Ordenar por</option>
                    <option value="prioridade">Prioridade</option>
                    <option value="data">Data</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {mostrarFiltros && isMobile && (
            <div className={styles.menuFiltros}>
              <div className={styles.grupoFiltro}>
                <h4>Categoria</h4>
                <select 
                  className={styles.selectFiltro}
                  value={categoriaSelecionada || ''}
                  onChange={(e) => setCategoriaSelecionada(e.target.value || null)}
                >
                  <option value="">Todas</option>
                  <option value="G43">G43</option>
                  <option value="G44">G44</option>
                </select>
              </div>
              
              <div className={styles.grupoFiltro}>
                <h4>Ordenar por</h4>
                <select 
                  className={styles.selectFiltro}
                  value={ordemSelecionada || ''}
                  onChange={(e) => setOrdemSelecionada(e.target.value || null)}
                >
                  <option value="">Padrão</option>
                  <option value="prioridade">Prioridade</option>
                  <option value="data">Data</option>
                </select>
              </div>
            </div>
          )}

          <div className={styles.listaItens}>
            {getDiagnosticosFiltrados().map(diagnostico => (
              <div key={diagnostico.id} className={styles.itemDiagnostico}>
                <div className={styles.codigo}>{diagnostico.codigo}</div>
                <div className={styles.detalhes}>
                  <h3>{diagnostico.descricao}</h3>
                  <div className={styles.metaInfo}>
                    <span className={styles.prioridade} data-prioridade={diagnostico.prioridade}>
                      {diagnostico.prioridade}
                    </span>
                    <span className={styles.data}>{diagnostico.dataCriacao}</span>
                    {diagnostico.status === 'pendente' && (
                      <span className={styles.statusPendente}>Pendente</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AnalysisPage;