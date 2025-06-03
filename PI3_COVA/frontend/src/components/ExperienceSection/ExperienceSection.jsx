import { useState, useRef, useEffect } from "react";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import styles from './styles.module.scss';
import { useTranslation } from "react-i18next";

const ExperienceSection = ({ experiences, onAdd, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const formRef = useRef(null);

  const [isAdding, setIsAdding] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(null);
  const [formData, setFormData] = useState({
    position: '',
    institution: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: ''
  });

  // Scroll para o formulário quando aberto
  useEffect(() => {
    if (isAdding && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isAdding]);

  // Formatador de data para MM/AAAA
  const formatDate = (value) => {
    // Remove caracteres não numéricos
    const cleaned = value.replace(/\D/g, '');
    
    // Limita a 6 dígitos (2 para mês, 4 para ano)
    let formatted = cleaned.slice(0, 6);
    
    // Adiciona a barra após 2 dígitos
    if (formatted.length > 2) {
      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
    }
    
    return formatted;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'startDate' || name === 'endDate') {
      // Formata os campos de data
      setFormData(prev => ({
        ...prev,
        [name]: formatDate(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Formata o período para exibição
    let period = '';
    if (formData.startDate) {
      period = formData.startDate;
      if (formData.endDate || formData.isCurrent) {
        period += ' - ';
        period += formData.isCurrent ? t("profile.present") : formData.endDate;
      }
    }
    
    const experienceData = {
      position: formData.position,
      institution: formData.institution,
      period: period,
      description: formData.description
    };
    
    if (currentExperience !== null) {
      onEdit(currentExperience, experienceData);
    } else {
      onAdd(experienceData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      position: '',
      institution: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    });
    setCurrentExperience(null);
    setIsAdding(false);
  };

  const handleEditClick = (index) => {
    const experience = experiences[index];
    
    // Extrai datas do período existente
    let startDate = '';
    let endDate = '';
    let isCurrent = false;
    
    if (experience.period) {
      const [start, end] = experience.period.split(' - ');
      startDate = start;
      
      if (end === t("profile.present")) {
        isCurrent = true;
      } else if (end) {
        endDate = end;
      }
    }
    
    setFormData({
      position: experience.position,
      institution: experience.institution,
      startDate: startDate,
      endDate: endDate,
      isCurrent: isCurrent,
      description: experience.description
    });
    
    setCurrentExperience(index);
    setIsAdding(true);
  };

  return (
    <section className={styles.experienceSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>
          <i className={`fas fa-briefcase ${styles.icon}`}></i>{" "}
          {t("profile.experience")}
        </h3>
        <div className={styles.titleUnderline}></div>
      </div>

      <div className={styles.timeline}>
        {experiences.map((item, index) => (
          <div key={index} className={styles.timelineItem}>
            <div className={styles.timelineMarker}></div>
            <div className={styles.timelineContent}>
              <div className={styles.experienceHeader}>
                <h4>{item.position}</h4>
                <div className={styles.experienceActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditClick(index)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => onDelete(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className={styles.institution}>{item.institution}</p>
              <p className={styles.period}>{item.period}</p>
              <p className={styles.description}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <form ref={formRef} onSubmit={handleSubmit} className={styles.experienceForm}>
          <div className={styles.formGroup}>
            <label>{t("profile.position")}</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>{t("profile.institution")}</label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t("profile.startDate")} <span className={styles.required}>*</span></label>
              <input
                type="text"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                placeholder="MM/AAAA"
                maxLength={7}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>{t("profile.endDate")}</label>
              <input
                type="text"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                placeholder="MM/AAAA"
                maxLength={7}
                disabled={formData.isCurrent}
                className={formData.isCurrent ? styles.disabledInput : ''}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="isCurrent"
                checked={formData.isCurrent}
                onChange={handleInputChange}
              />
              <span className={styles.checkmark}></span>
              {t("profile.currentPosition")}
            </label>
          </div>
          
          <div className={styles.formGroup}>
            <label>{t("profile.description")}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>
              {currentExperience !== null ? `${t("profile.update")}` : `${t("profile.save")}`}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={resetForm}
            >
              {t("profile.cancel")}
            </button>
          </div>
        </form>
      )}

      {!isAdding && (
        <div className={styles.addButtonContainer}>
          <button className={styles.addButton} onClick={() => setIsAdding(true)}>
            <FaPlus /> {t("profile.add")}
          </button>
        </div>
      )}
    </section>
  );
};

export default ExperienceSection;