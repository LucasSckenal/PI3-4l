import { useState } from "react";
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

  const diagnosticosMockados = [
    // Diagnósticos G43 - Migraines
    {
      id: 1,
      codigo: "G43",
      descricao: "Migraine without aura",
      prioridade: "alta",
      dataCriacao: "2023-06-15",
      status: "pendente",
    },
    {
      id: 2,
      codigo: "G43",
      descricao: "Migraine with aura",
      prioridade: "alta",
      dataCriacao: "2023-06-10",
      status: "pendente",
    },
    {
      id: 3,
      codigo: "G43",
      descricao: "Chronic migraine",
      prioridade: "alta",
      dataCriacao: "2023-05-28",
      status: "analisado",
    },
    {
      id: 4,
      codigo: "G43",
      descricao: "Status migrainosus",
      prioridade: "alta",
      dataCriacao: "2023-06-05",
      status: "pendente",
    },
    {
      id: 5,
      codigo: "G43",
      descricao: "Complicated migraine",
      prioridade: "média",
      dataCriacao: "2023-05-22",
      status: "pendente",
    },
    {
      id: 6,
      codigo: "G43",
      descricao: "Basilar migraine",
      prioridade: "média",
      dataCriacao: "2023-06-12",
      status: "analisado",
    },
    {
      id: 7,
      codigo: "G43",
      descricao: "Ophthalmoplegic migraine",
      prioridade: "baixa",
      dataCriacao: "2023-05-30",
      status: "pendente",
    },
    {
      id: 8,
      codigo: "G43",
      descricao: "Retinal migraine",
      prioridade: "média",
      dataCriacao: "2023-06-08",
      status: "pendente",
    },

    // Diagnósticos G44 - Other headaches
    {
      id: 9,
      codigo: "G44",
      descricao: "Episodic tension-type headache",
      prioridade: "média",
      dataCriacao: "2023-06-18",
      status: "pendente",
    },
    {
      id: 10,
      codigo: "G44",
      descricao: "Chronic tension-type headache",
      prioridade: "média",
      dataCriacao: "2023-05-25",
      status: "analisado",
    },
    {
      id: 11,
      codigo: "G44",
      descricao: "Cluster headache",
      prioridade: "alta",
      dataCriacao: "2023-06-20",
      status: "pendente",
    },
    {
      id: 12,
      codigo: "G44",
      descricao: "Post-traumatic headache",
      prioridade: "baixa",
      dataCriacao: "2023-06-02",
      status: "pendente",
    },
    {
      id: 13,
      codigo: "G44",
      descricao: "Medication overuse headache",
      prioridade: "média",
      dataCriacao: "2023-05-20",
      status: "analisado",
    },
    {
      id: 14,
      codigo: "G44",
      descricao: "Headache attributed to psychiatric disorder",
      prioridade: "baixa",
      dataCriacao: "2023-06-14",
      status: "pendente",
    },
    {
      id: 15,
      codigo: "G44",
      descricao: "Cervicogenic headache",
      prioridade: "média",
      dataCriacao: "2023-05-31",
      status: "pendente",
    },
    {
      id: 16,
      codigo: "G44",
      descricao: "Hypnic headache",
      prioridade: "baixa",
      dataCriacao: "2023-06-09",
      status: "analisado",
    },

    // Recent cases for testing sorting
    {
      id: 17,
      codigo: "G43",
      descricao: "Vestibular migraine",
      prioridade: "média",
      dataCriacao: "2023-06-25",
      status: "pendente",
    },
    {
      id: 18,
      codigo: "G44",
      descricao: "New daily persistent headache",
      prioridade: "alta",
      dataCriacao: "2023-06-24",
      status: "pendente",
    },
    {
      id: 19,
      codigo: "G43",
      descricao: "Menstrual migraine",
      prioridade: "média",
      dataCriacao: "2023-06-22",
      status: "pendente",
    },
    {
      id: 20,
      codigo: "G44",
      descricao: "Trigeminal neuralgia headache",
      prioridade: "alta",
      dataCriacao: "2023-06-21",
      status: "analisado",
    },

    // Various cases for testing
    {
      id: 21,
      codigo: "G43",
      descricao: "Prolonged aura migraine",
      prioridade: "alta",
      dataCriacao: "2023-05-12",
      status: "pendente",
    },
    {
      id: 22,
      codigo: "G44",
      descricao: "Cough headache",
      prioridade: "baixa",
      dataCriacao: "2023-06-01",
      status: "analisado",
    },
    {
      id: 23,
      codigo: "G43",
      descricao: "Familial hemiplegic migraine",
      prioridade: "alta",
      dataCriacao: "2023-05-08",
      status: "pendente",
    },
    {
      id: 24,
      codigo: "G44",
      descricao: "Exertional headache",
      prioridade: "média",
      dataCriacao: "2023-06-17",
      status: "pendente",
    },
  ];

  const getDiagnosticosPorData = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return diagnosticosMockados.filter(
      (d) => d.dataCriacao === dateStr && d.status === "pendente"
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
    let diagnosticos = [...diagnosticosMockados];

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
        {!isMobile && (
          <section className={styles.cardsSection}>
            <div className={styles.card}>
              <h3>{t("analysis.pendingDiagnoses")}</h3>
              <p className={styles.cardNumber}>
                {
                  diagnosticosMockados.filter((d) => d.status === "pendente")
                    .length
                }
              </p>
            </div>
            <div className={`${styles.card} ${styles.cardGrave}`}>
              <h3>{t("analysis.severeCases")}</h3>
              <p className={styles.cardNumber}>
                {
                  diagnosticosMockados.filter(
                    (d) => d.status === "pendente" && d.prioridade === "alta"
                  ).length
                }
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
                ? `${t(
                    "analysis.diagnoses"
                  )} - ${dataSelecionada.toLocaleDateString()}`
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
                    <option value="">{t("analysis.allCategories")}</option>
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
                    <option value="">{t("analysis.sortBy")}</option>
                    <option value="prioridade">{t("analysis.priority")}</option>
                    <option value="data">{t("analysis.date")}</option>
                  </select>
                </div>
              </div>
            )}
          </div>

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
                  <h3>{diagnostico.descricao}</h3>
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
                    {diagnostico.status === "pendente" && (
                      <span className={styles.statusPendente}>
                        {t("analysis.pendingDiagnoses")}
                      </span>
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