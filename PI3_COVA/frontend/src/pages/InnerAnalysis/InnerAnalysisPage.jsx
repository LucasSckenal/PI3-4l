import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';
import { FaUser, FaNotesMedical, FaClipboardList, FaExclamationTriangle, FaBullseye } from 'react-icons/fa';
import {
  db,
  doc,
  getDoc,
  setDoc,
  fetchUserBasicInfo,
} from '../../api/firebase';
import { deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const InnerAnalysisPage = () => {
  const { analysisId } = useParams();
  const [reviewData, setReviewData] = useState({
    cidGroup: "",
    diseaseName: "",
    recommendations: "",
    priority: "",
    accuracy: 0
  });
  const [patientInfo, setPatientInfo] = useState({
    userId: "",
    chatId: "",
    messages: [],
    timestamp: null,
    priority: "",
    status: ""
  });
  const [patientDetailsFromUserDoc, setPatientDetailsFromUserDoc] = useState({
    age: "N/A",
    gender: "N/A",
    symptoms: "N/A",
    birthDate: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchReviewAndUserDetails = async () => {
      if (!analysisId) {
        setError("ID da análise não fornecido.");
        setLoading(false);
        return;
      }

      try {
        const reviewRef = doc(db, "Pendings", analysisId);
        const reviewSnap = await getDoc(reviewRef);

        if (reviewSnap.exists()) {
          const data = reviewSnap.data();
          setPatientInfo({
            userId: data.userId,
            chatId: data.chatId,
            messages: data.messages,
            timestamp: data.timestamp?.toDate(),
            priority: data.priority,
            status: data.status
          });

          const assistantMessage = data.messages.find(msg => msg.role === 'assistant');
          if (assistantMessage && assistantMessage.content) {
            const content = assistantMessage.content;
            const cidGroupMatch = content.match(/grupo CID-10\s*([A-Z0-9]+)\)/);
            const diseaseNameMatch = content.match(/Nome da Doença:\s*(.*?)(?:\s*-\s*Recomendações:|$)/);
            const recommendationsMatch = content.match(/Recomendações:\s*(.*?)(?:\s*-\s*Gravidade da Doença:|$)/);
            const severityMatch = content.match(/Gravidade da Doença:\s*(.*?)(?:\s*-\s*Precisão do Diagnóstico:|$)/);
            const accuracyMatch = content.match(/Precisão do Diagnóstico:\s*(\d+)%/);

            setReviewData({
              cidGroup: cidGroupMatch ? cidGroupMatch[1].trim() : "G44",
              diseaseName: diseaseNameMatch ? diseaseNameMatch[1].trim() : "",
              recommendations: recommendationsMatch ? recommendationsMatch[1].trim() : "",
              priority: severityMatch ? severityMatch[1].trim() : "Amarelo",
              accuracy: accuracyMatch ? parseInt(accuracyMatch[1]) : 0
            });
          }

          if (data.userId) {
            const userBasicInfo = await fetchUserBasicInfo(data.userId);
            if (userBasicInfo) {
              const birthDate = userBasicInfo.birthDate ? new Date(userBasicInfo.birthDate) : null;
              let age = "N/A";
              if (birthDate) {
                const today = new Date();
                const diff = today.getTime() - birthDate.getTime();
                const ageDate = new Date(diff);
                age = Math.abs(ageDate.getUTCFullYear() - 1970) + " anos";
              }

              setPatientDetailsFromUserDoc({
                  age: age,
                  gender: userBasicInfo.gender === 'male' ? 'Masculino' : userBasicInfo.gender === 'female' ? 'Feminino' : 'N/A',
                  birthDate: birthDate,
                  symptoms: (() => {
                      const userMsg = data.messages.find(msg => msg.role === 'user');
                      setUserMessage(userMsg?.content || "N/A"); // Armazena a mensagem no estado
                      return userMsg?.content || "N/A";
                  })()
              });
            }
          }

        } else {
          setError("Análise não encontrada.");
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao carregar dados da análise.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewAndUserDetails();
  }, [analysisId]);

  const handleChange = (field, value) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const finalDiagnosisText = `Relatório de Triagem – Síndromes de algias cefálicas (grupo CID-10 ${reviewData.cidGroup}) - Nome da Doença: ${reviewData.diseaseName} - Recomendações: ${reviewData.recommendations} - Gravidade da Doença: ${reviewData.priority} - Precisão do Diagnóstico: ${reviewData.accuracy}%`;
    const doctorId = getAuth().currentUser?.uid;

    const finalData = {
      diagnosisText: finalDiagnosisText,
      cidGroup: reviewData.cidGroup,
      diseaseName: reviewData.diseaseName,
      recommendations: reviewData.recommendations,
      priority: reviewData.priority,
      accuracy: reviewData.accuracy,
      status: "finalizado",
      visualizada: false,
      deliveredAt: new Date(),
      doctorId,
      userMessage,
    };

    try {
      const ref = doc(db, "Users", patientInfo.userId, "AnalysisResults", analysisId);
      console.log("Caminho Firestore:", ref.path);
      await setDoc(ref, finalData);
      await deleteDoc(doc(db, "Pendings", analysisId));
      alert('Relatório enviado ao paciente!');
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert('Erro ao enviar atualização. Tente novamente.');
    }
  };

  const getAccuracyColor = (accuracy) => {
    let r, g, b = 0;
    if (accuracy < 50) {
      r = 255;
      g = Math.floor(255 * (accuracy / 50));
    } else {
      r = Math.floor(255 * ((100 - accuracy) / 50));
      g = 255;
    }
    return `rgb(${r},${g},${b})`;
  };

  if (loading) return <div className={styles.container}><p>Carregando análise...</p></div>;
  if (error) return <div className={styles.container}><p className={styles.errorText}>{error}</p></div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{t("analysisPage.medicalAnalysisReview")}</h1>

      <div className={styles.card}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FaUser className={styles.icon} /> {t("analysisPage.patientDetails")}
          </h2>
          <div className={styles.patientInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t("common.id")}:</span>
              <span className={styles.infoValue}>{patientInfo.userId}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t("common.age")}:</span>
              <span className={styles.infoValue}>{patientDetailsFromUserDoc.age}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t("common.gender")}:</span>
              <span className={styles.infoValue}>{patientDetailsFromUserDoc.gender}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t("common.description")}:</span>
              <span className={styles.infoValue}>{patientDetailsFromUserDoc.symptoms}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t("common.date")}:</span>
              <span className={styles.infoValue}>
                {patientInfo.timestamp ? patientInfo.timestamp.toLocaleDateString('pt-BR', {
                  day: 'numeric', month: 'long', year: 'numeric'
                }) : t("common.notAvailable")}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FaNotesMedical className={styles.icon} /> {t("analysisPage.diagnosis")}
          </h2>
          <div className={styles.editableField}>
            <label>{t("analysisPage.cidGroup")}</label>
            <select
              value={reviewData.cidGroup}
              onChange={(e) => handleChange('cidGroup', e.target.value)}
              className={styles.selectField}
            >
              <option value="G43">G43 - {t("analysisPage.migraine")}</option>
              <option value="G44">G44 - {t("analysisPage.otherHeadacheSyndromes")}</option>
            </select>
          </div>
          <div className={styles.editableField}>
            <label>{t("analysisPage.diseaseName")}</label>
            <input
              type="text"
              value={reviewData.diseaseName}
              onChange={(e) => handleChange('diseaseName', e.target.value)}
              className={styles.inputField}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FaClipboardList className={styles.icon} /> {t("analysisPage.recommendations")}
          </h2>
          <div className={styles.editableField}>
            <label>{t("analysisPage.patientGuidelines")}</label>
            <textarea
              value={reviewData.recommendations}
              onChange={(e) => handleChange('recommendations', e.target.value)}
              className={styles.textareaField}
              rows={4}
            />
          </div>
        </div>

        <div className={styles.flexContainer}>
          <div className={styles.sectionHalf}>
            <h2 className={styles.sectionTitle}>
              <FaExclamationTriangle className={styles.icon} /> {t("analysisPage.severity")}
            </h2>
            <div className={styles.editableField}>
              <label>{t("analysisPage.priorityLevel")}</label>
              <select
                value={reviewData.priority.split(' ')[0]} // Usa reviewData.priority
                onChange={(e) => handleChange('priority', e.target.value)}
                className={`${styles.selectField} ${styles[reviewData.priority.split(' ')[0].toLowerCase()]}`}
              >
                <option value="Vermelho" className={styles.vermelho}>{t("analysisPage.severityOptions.red")}</option>
                <option value="Laranja" className={styles.laranja}>{t("analysisPage.severityOptions.orange")}</option>
                <option value="Amarelo" className={styles.amarelo}>{t("analysisPage.severityOptions.yellow")}</option>
                <option value="Verde" className={styles.verde}>{t("analysisPage.severityOptions.green")}</option>
                <option value="Azul" className={styles.azul}>{t("analysisPage.severityOptions.blue")}</option>
              </select>
            </div>
          </div>

          <div className={styles.sectionHalf}>
            <h2 className={styles.sectionTitle}>
              <FaBullseye className={styles.icon} /> {t("analysisPage.accuracy")}
            </h2>
            <div className={styles.accuracyDisplay}>
              <div className={styles.accuracyMeter}>
                <div
                  className={styles.accuracyFill}
                  style={{
                    width: `${reviewData.accuracy}%`,
                    backgroundColor: getAccuracyColor(reviewData.accuracy)
                  }}
                ></div>
              </div>
              <div className={styles.accuracyValue}>
                {reviewData.accuracy}%
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            onClick={() => console.log('Cancelado')}
          >
            {t("common.cancel")}
          </button>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
          >
            {t("analysisPage.sendUpdateToPatient")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InnerAnalysisPage;