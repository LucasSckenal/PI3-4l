import { useState, useEffect } from "react";
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
import { fetchPendingReviews } from "../../api/firebase"; // Importe a função

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
      // Extrair data do timestamp do Firebase
      const dataCriacao = doc.timestamp.toDate();
      
      return {
        id: doc.id || `real-${index}`,
        codigo: extrairCodigoCID(doc.messages),
        descricao: doc.messages.map(msg => 
          `${msg.role === 'user' ? 'Paciente' : 'Assistente'}: ${msg.content}`
        ).join('\n\n'),
        prioridade: doc.priority,
        dataCriacao: dataCriacao.toISOString().split('T')[0],
        status: "pendente",
        timestamp: dataCriacao, // Mantemos o objeto Date para filtros
      };
    });
  };

  // Obter diagnósticos transformados
  const diagnosticosTransformados = transformarDados(diagnosticos);

  const getDiagnosticosPorData = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return diagnosticosTransformados.filter(
      (d) => d.dataCriacao === dateStr
    );
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

    if (mostrarCalendario) {
      const dateStr = dataSelecionada.toISOString().split("T")[0];
      diagnosticos = diagnosticos.filter((d) => d.dataCriacao === dateStr);
    }

    if (categoriaSelecionada) {
      diagnosticos = diagnosticos.filter(
        (d) => d.codigo === categoriaSelecionada
      );
    }

    if (ordemSelecionada === "prioridade") {
      const ordemPrioridade = { alta: 1, média: 2, baixa: 3 };
      diagnosticos.sort(
        (a, b) => ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade]
      );
    } else if (ordemSelecionada === "data") {
      diagnosticos.sort(
        (a, b) => new Date(a.dataCriacao) - new Date(b.dataCriacao)
      );
    }

    return diagnosticos;
  };

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {/* Cards de resumo */}
        {!isMobile && (
          <section className={styles.cardsSection}>
            <div className={styles.card}>
              <h3>{t("analysis.pendingDiagnoses")}</h3>
              <p className={styles.cardNumber}>
                {diagnosticosTransformados.length}
              </p>
            </div>
            
            <div className={`${styles.card} ${styles.cardGrave}`}>
              <h3>{t("analysis.severeCases")}</h3>
              <p className={styles.cardNumber}>
                {diagnosticosTransformados.filter(d => d.prioridade === "alta").length}
              </p>
            </div>
            <div
              className={`${styles.card} ${styles.cardCalendar}`}
              onClick={() => setMostrarCalendario(!mostrarCalendario)}
            >
              <h3>{t("analysis.date")}</h3>
              <div className={styles.calendarIcon}>
                <FiCalendar />
              </div>
            </div>
          </section>
        )}

        {mostrarCalendario && !isMobile && (
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
                  onClick={() => dia && setDataSelecionada(dia.data)}
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

        {isMobile && (
          <button
            className={styles.botaoCalendarioMobile}
            onClick={() => setMostrarCalendario(!mostrarCalendario)}
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
                  onClick={() => dia && setDataSelecionada(dia.data)}
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
            <h2 className={styles.sectionTitle}>
              {mostrarCalendario
                ? `${t("analysis.diagnoses")} - ${dataSelecionada.toLocaleDateString()}`
                : t("analysis.diagnoses")}
            </h2>

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
                    <option value="" hidden>{t("analysis.allCategories")}</option>
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
                  <div key={diagnostico.id} className={styles.itemDiagnostico}>
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