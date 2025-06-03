import { useState } from "react";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import styles from './styles.module.scss';
import { useTranslation } from "react-i18next";


const ExperienceSection = ({ experiences, onAdd, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const [isAdding, setIsAdding] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(null);
  const [formData, setFormData] = useState({
    position: '',
    institution: '',
    period: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentExperience !== null) {
      onEdit(currentExperience, formData);
    } else {
      onAdd(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      position: '',
      institution: '',
      period: '',
      description: ''
    });
    setCurrentExperience(null);
    setIsAdding(false);
  };

  const handleEditClick = (index) => {
    setCurrentExperience(index);
    setFormData(experiences[index]);
    setIsAdding(true);
  };

  return (
    <section className={styles.experienceSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>
          <i className={`fas fa-briefcase ${styles.icon}`}></i>{" "}
          {t("profile.experience")}
        </h3>
        <button className={styles.addButton} onClick={() => setIsAdding(true)}>
          <FaPlus /> {t("profile.add")}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className={styles.experienceForm}>
          <div className={styles.formGroup}>
            <label>{t("profile.")}</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Instituição</label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Período</label>
            <input
              type="text"
              name="period"
              value={formData.period}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>
              {currentExperience !== null ? "Atualizar" : "Salvar"}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={resetForm}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

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
    </section>
  );
};

export default ExperienceSection;