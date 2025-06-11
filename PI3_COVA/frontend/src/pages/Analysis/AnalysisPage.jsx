import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFilter,
  FiChevronDown,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useScreenResize } from "../../contexts/ScreenResizeProvider/ScreenResizeProvider";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { fetchPendingReviews } from "../../api/firebase"; 
import CalendarModal from "../../components/Calendar/Calendar";

const AnalysisPage = () => {
  const { isMobile } = useScreenResize();
  const { t } = useTranslation();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [ordemSelecionada, setOrdemSelecionada] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [mesAtual, setMesAtual] = useState(new Date().getMonth());
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroDataAtivo, setFiltroDataAtivo] = useState(false);
  const navigate = useNavigate();

  // Buscar diagnósticos reais do Firebase
  useEffect(() => {
    const carregarDiagnosticos = async () => {
      try {
        setCarregando(true);
        const diagnosticosReais = await fetchPendingReviews();
        setDiagnosticos(diagnosticosReais);
      } catch (error) {
        console.error("Erro ao carregar diagnósticos:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDiagnosticos();
  }, []);

  const formatarDataBrasilia = (date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
};

  // Função para extrair o código CID das mensagens (G43 ou G44)
  const extrairCodigoCID = (messages) => {
    const mensagemIA = messages.find(msg => msg.role === "assistant")?.content || "";
    
    // Expressão regular para encontrar códigos CID
    const match = mensagemIA.match(/CID-10\s*(G43|G44)/);
    return match ? match[1] : "G44";
  };

  // Transformar dados do Firebase no formato esperado pela página
  const transformarDados = (diagnosticosReais) => {
    return diagnosticosReais.map((doc, index) => {
      const dataCriacao = doc.timestamp.toDate();
      
      return {
        id: doc.id || `real-${index}`,
        codigo: extrairCodigoCID(doc.messages),
        descricao: doc.messages.map(msg => 
          `${msg.role === 'user' ? 'Paciente' : 'Assistente'}: ${msg.content}`
        ).join('\n\n'),
        prioridade: doc.priority,
        dataCriacao: formatarDataBrasilia(dataCriacao), // Usar novo formatter
        status: "pendente",
        timestamp: dataCriacao,
      };
    });
  };

  // Obter diagnósticos transformados
  const diagnosticosTransformados = transformarDados(diagnosticos);

  const getDiagnosticosPorData = (date) => {
    return diagnosticosTransformados.filter((d) => {
      const dData = d.timestamp;
      return (
        dData.getFullYear() === date.getFullYear() &&
        dData.getMonth() === date.getMonth() &&
        dData.getDate() === date.getDate()
      );
    });
  };


  const mudarMes = (offset) => {
    const novaData = new Date(anoAtual, mesAtual + offset, 1);
    setMesAtual(novaData.getMonth());
    setAnoAtual(novaData.getFullYear());
  };

  const gerarDiasDoMes = () => {
    const primeiroDia = new Date(anoAtual, mesAtual, 1);
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);
    const diasNoMes = ultimoDia.getDate();

    const dias = [];
    const diaSemanaInicio = primeiroDia.getDay();

    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }

    for (let i = 1; i <= diasNoMes; i++) {
      const dataDia = new Date(anoAtual, mesAtual, i);
      const diagnosticosDia = getDiagnosticosPorData(dataDia).length;
      dias.push({
        numero: i,
        data: dataDia,
        temPendentes: diagnosticosDia > 0,
      });
    }

    return dias;
  };

  const nomesMeses = t("date.months", { returnObjects: true });
  const nomesDias = t("date.days", { returnObjects: true });

  const getDiagnosticosFiltrados = () => {
  let diagnosticos = [...diagnosticosTransformados];

  // Filtro por data (comparação por dia, ignorando hora)
  if (filtroDataAtivo) {
    diagnosticos = diagnosticos.filter((d) => {
      const dData = d.timestamp;
      return (
        dData.getFullYear() === dataSelecionada.getFullYear() &&
        dData.getMonth() === dataSelecionada.getMonth() &&
        dData.getDate() === dataSelecionada.getDate()
      );
    });
  }

  // Filtro por categoria CID
  if (categoriaSelecionada) {
    diagnosticos = diagnosticos.filter(
      (d) => d.codigo === categoriaSelecionada
    );
  }

  // Ordenação por prioridade ou por data (timestamp)
  if (ordemSelecionada === "prioridade") {
    const ordemPrioridade = {
      Vermelho: 1,
      Laranja: 2,
      Amarelo: 3,
      Verde: 4,
      Azul: 5,
    };
    diagnosticos.sort(
      (a, b) => ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade]
    );
  } else if (ordemSelecionada === "data") {
    diagnosticos.sort((a, b) => a.timestamp - b.timestamp); // Mais antigos no topo
  }

  return diagnosticos;
};


return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {/* Cards de resumo */}
        {!isMobile && (
          <section className={styles.cardsSection}>
            <div className={`${styles.card} ${styles.cardPending}`}>
              <h3>{t("analysis.pendingDiagnoses")}</h3>
              <p className={styles.cardNumber}>
                {diagnosticosTransformados.length}
              </p>
            </div>
            
            <div className={`${styles.card} ${styles.cardGrave}`}>
              <h3>{t("analysis.severeCases")}</h3>
              <p className={styles.cardNumber}>
                {diagnosticosTransformados.filter(d => d.prioridade === "Vermelho").length}
              </p>
            </div>
            <div
              className={`${styles.card} ${styles.cardCalendar}`}
              onClick={() => {
                setMostrarCalendario(!mostrarCalendario);
                setFiltroDataAtivo(true); // Ativa o filtro quando abre o calendário
              }}
            >
              <h3>{t("analysis.date")}</h3>
              <div className={styles.calendarIcon}>
                <FiCalendar />
              </div>
            </div>
          </section>
        )}

        {mostrarCalendario && !isMobile && (
          <CalendarModal onClose={() => setMostrarCalendario(false)}>
          <section className={styles.calendarioDesktop}>
            <div className={styles.calendarioHeader}>
              <button
                className={styles.botaoNavegacao}
                onClick={() => mudarMes(-1)}
              >
                <FiChevronLeft />
              </button>
              <h3>
                {nomesMeses[mesAtual]} {anoAtual}
              </h3>
              <button
                className={styles.botaoNavegacao}
                onClick={() => mudarMes(1)}
              >
                <FiChevronRight />
              </button>
            </div>

            <div className={styles.diasSemana}>
              {nomesDias.map((dia) => (
                <div key={dia} className={styles.diaSemana}>
                  {dia}
                </div>
              ))}
            </div>

            <div className={styles.gridCalendario}>
              {gerarDiasDoMes().map((dia, index) => (
                <div
                  key={index}
                  className={`${styles.diaCalendario} ${
                    !dia
                      ? styles.diaVazio
                      : dia.data.toDateString() ===
                        dataSelecionada.toDateString()
                      ? styles.diaSelecionado
                      : dia.temPendentes
                      ? styles.diaComPendentes
                      : ""
                  }`}
                  onClick={() => {
                    if (dia) {
                      setDataSelecionada(dia.data);
                      setMostrarCalendario(false);
                      setFiltroDataAtivo(true);
                    }
                  }}
                >
                  {dia?.numero}
                  {dia?.temPendentes && (
                    <span className={styles.pontoPendente}></span>
                  )}
                </div>
              ))}
            </div>
          </section>
          </CalendarModal>
        )}

        {isMobile && (
          <button
            className={styles.botaoCalendarioMobile}
            onClick={() => {
              setMostrarCalendario(!mostrarCalendario);
              setFiltroDataAtivo(true); 
            }}
          >
            <FiCalendar className={styles.iconeCalendario} />
            {t("analysis.viewByDate")}
          </button>
        )}

        {mostrarCalendario && isMobile && (
          <section className={styles.calendarioMobile}>
            <div className={styles.calendarioHeader}>
              <button onClick={() => mudarMes(-1)}>
                <FiChevronLeft />
              </button>
              <h3>
                {nomesMeses[mesAtual]} {anoAtual}
              </h3>
              <button onClick={() => mudarMes(1)}>
                <FiChevronRight />
              </button>
            </div>

            <div className={styles.diasSemana}>
              {nomesDias.map((dia) => (
                <div key={dia} className={styles.diaSemana}>
                  {dia.charAt(0)}
                </div>
              ))}
            </div>

            <div className={styles.diasMes}>
              {gerarDiasDoMes().map((dia, index) => (
                <div
                  key={index}
                  className={`${styles.dia} ${
                    !dia
                      ? styles.diaVazio
                      : dia.data.toDateString() ===
                        dataSelecionada.toDateString()
                      ? styles.diaSelecionado
                      : dia.temPendentes
                      ? styles.diaComPendentes
                      : ""
                  }`}
                  onClick={() => {
                    if (dia) {
                      setDataSelecionada(dia.data);
                      setMostrarCalendario(false);
                      setFiltroDataAtivo(true); 
                    }
                  }}
                >
                  {dia?.numero}
                  {dia?.temPendentes && (
                    <span className={styles.pontoPendente}></span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className={styles.listaDiagnosticos}>
          <div className={styles.listaHeader}>
            <div className={styles.tituloContainer}>
              <h2 className={styles.sectionTitle}>
                {filtroDataAtivo
                  ? `${t("analysis.diagnoses")} - ${formatarDataBrasilia(dataSelecionada)}`
                  : t("analysis.diagnoses")}
              </h2>
              
              {/* Botão para limpar filtro de data */}
              {filtroDataAtivo && (
                <button 
                  className={styles.botaoLimparFiltro}
                  onClick={() => setFiltroDataAtivo(false)}
                >
                  {t("analysis.clearFilter")}
                </button>
              )}
            </div>

            {isMobile ? (
              <div className={styles.filtroMobile}>
                <button
                  className={styles.botaoFiltro}
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                >
                  <FiFilter className={styles.iconeFiltro} />
                  <FiChevronDown
                    className={`${styles.iconeSeta} ${
                      mostrarFiltros ? styles.viradoParaCima : ""
                    }`}
                  />
                </button>
              </div>
            ) : (
              <div className={styles.filtroDesktop}>
                <div className={styles.grupoFiltro}>
                  <select
                    className={styles.selectFiltro}
                    value={categoriaSelecionada || ""}
                    onChange={(e) =>
                      setCategoriaSelecionada(e.target.value || null)
                    }
                  >
                    <option value="" >{t("analysis.allCategories")}</option>
                    <option value="G43">G43</option>
                    <option value="G44">G44</option>
                  </select>
                </div>

                <div className={styles.grupoFiltro}>
                  <select
                    className={styles.selectFiltro}
                    value={ordemSelecionada || ""}
                    onChange={(e) =>
                      setOrdemSelecionada(e.target.value || null)
                    }
                  >
                    <option value="" hidden>{t("analysis.sortBy")}</option>
                    <option value="prioridade">{t("analysis.priority")}</option>
                    <option value="data">{t("analysis.date")}</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {carregando ? (
            <div className={styles.carregando}>
              <p>{t("common.loading")}...</p>
            </div>
          ) : (
            <>
              {mostrarFiltros && isMobile && (
            <div className={styles.menuFiltros}>
              <div className={styles.grupoFiltro}>
                <h4>{t("analysis.category")}</h4>
                <select
                  className={styles.selectFiltro}
                  value={categoriaSelecionada || ""}
                  onChange={(e) =>
                    setCategoriaSelecionada(e.target.value || null)
                  }
                >
                  <option value="">{t("analysis.allCategories")}</option>
                  <option value="G43">G43</option>
                  <option value="G44">G44</option>
                </select>
              </div>

              <div className={styles.grupoFiltro}>
                <h4>{t("analysis.sortBy")}</h4>
                <select
                  className={styles.selectFiltro}
                  value={ordemSelecionada || ""}
                  onChange={(e) => setOrdemSelecionada(e.target.value || null)}
                >
                  <option value="">{t("analysis.default")}</option>
                  <option value="prioridade">{t("analysis.priority")}</option>
                  <option value="data">{t("analysis.date")}</option>
                </select>
              </div>
            </div>
          )}

          <div className={styles.listaItens}>
                {getDiagnosticosFiltrados().map((diagnostico) => (
                  <div key={diagnostico.id} className={styles.itemDiagnostico} onClick={() => navigate(`/analysis/${diagnostico.id}`)}>
                    <div className={styles.codigo}>{diagnostico.codigo}</div>
                    <div className={styles.detalhes}>
                      <h3>
                        {diagnostico.descricao.split('\n')[0].substring(0, 100)}
                        {diagnostico.descricao.length > 100 && '...'}
                      </h3>
                      <div className={styles.metaInfo}>
                        <span
                          className={styles.prioridade}
                          data-prioridade={diagnostico.prioridade}
                        >
                          {diagnostico.prioridade}
                        </span>
                        <span className={styles.data}>
                          {diagnostico.dataCriacao}
                        </span>
                        <span className={styles.statusPendente}>
                          {t("analysis.pendingDiagnoses")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default AnalysisPage;