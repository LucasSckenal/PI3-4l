import React, { useState, useEffect } from 'react';
import { 
  fetchPendingReviews, 
  updatePendingReview,
  addDoctorDiagnosis
} from '../../api/firebase';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

const DoctorReviewPanel = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const loadPendingReviews = async () => {
      try {
        setIsLoading(true);
        const reviews = await fetchPendingReviews();
        setPendingReviews(reviews);
        
        // Seleciona a primeira revisão automaticamente
        if (reviews.length > 0 && !selectedReview) {
          setSelectedReview(reviews[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar revisões pendentes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPendingReviews();
    
    // Atualiza a cada 30 segundos
    const interval = setInterval(loadPendingReviews, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitDiagnosis = async () => {
    if (!selectedReview || !diagnosis.trim()) return;
    
    try {
      setIsLoading(true);
      
      // 1. Atualiza a revisão pendente
      await updatePendingReview(selectedReview.id, diagnosis);
      
      // 2. Adiciona o diagnóstico ao chat do usuário
      await addDoctorDiagnosis(
        selectedReview.userId, 
        selectedReview.chatId, 
        diagnosis
      );
      
      // 3. Atualiza a lista local
      setPendingReviews(prev => 
        prev.filter(review => review.id !== selectedReview.id)
      );
      
      // 4. Seleciona a próxima revisão
      if (pendingReviews.length > 1) {
        const nextReview = pendingReviews.find(
          review => review.id !== selectedReview.id
        );
        setSelectedReview(nextReview);
      } else {
        setSelectedReview(null);
      }
      
      setDiagnosis('');
      alert(t('doctorReview.diagnosisSubmitted'));
    } catch (error) {
      console.error('Erro ao enviar diagnóstico:', error);
      alert(t('doctorReview.submissionError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.doctorReviewPanel}>
      <h2>{t('doctorReview.title')}</h2>
      
      <div className={styles.panelLayout}>
        {/* Lista de Revisões Pendentes */}
        <div className={styles.reviewList}>
          {isLoading ? (
            <p>{t('common.loading')}...</p>
          ) : pendingReviews.length === 0 ? (
            <p>{t('doctorReview.noPendingReviews')}</p>
          ) : (
            pendingReviews.map(review => (
              <div 
                key={review.id}
                className={`${styles.reviewItem} ${
                  selectedReview?.id === review.id ? styles.selected : ''
                }`}
                onClick={() => setSelectedReview(review)}
              >
                <div className={styles.reviewHeader}>
                  <span className={styles.priority}>
                    {t('doctorReview.priority')}: {review.priority}
                  </span>
                  <span className={styles.timestamp}>
                    {new Date(review.timestamp?.toDate()).toLocaleString()}
                  </span>
                </div>
                <div className={styles.userInfo}>
                  {t('doctorReview.userId')}: {review.userId.substring(0, 8)}...
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Área de Diagnóstico */}
        {selectedReview && (
          <div className={styles.diagnosisArea}>
            <h3>{t('doctorReview.conversationHistory')}</h3>
            
            <div className={styles.conversation}>
              {selectedReview.messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`${styles.message} ${
                    msg.role === 'user' ? styles.user : styles.assistant
                  }`}
                >
                  <strong>{msg.role === 'user' ? t('doctorReview.patient') : t('doctorReview.assistant')}:</strong>
                  <p>{msg.content}</p>
                  <small>
                    {msg.createdAt?.toDate().toLocaleTimeString()}
                  </small>
                </div>
              ))}
            </div>
            
            <h3>{t('doctorReview.diagnosis')}</h3>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder={t('doctorReview.diagnosisPlaceholder')}
              disabled={isLoading}
            />
            
            <button
              onClick={handleSubmitDiagnosis}
              disabled={isLoading || !diagnosis.trim()}
              className={styles.submitButton}
            >
              {isLoading ? t('common.submitting') : t('doctorReview.submitDiagnosis')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorReviewPanel;