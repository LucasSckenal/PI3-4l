// src/components/AboutEditModal/AboutEditModal.jsx
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import styles from "./styles.module.scss"; // Crie este arquivo de SCSS/estilos

/**
 * - Abre um modal onde o médico pode editar todos os campos de “Sobre o Médico”
 *   (title, specialties, hospital, crm, aboutText, procedures).
 * - Recebe via props os valores iniciais e a função onSave que retorna
 *   um objeto com os novos campos, para o pai atualizar estado + Firestore.
 */
const AboutEditModal = ({
  initialTitle,
  initialSpecialties,
  initialHospital,
  initialCrm,
  initialAboutText,
  initialProcedures,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [specialties, setSpecialties] = useState(initialSpecialties || []);
  const [hospital, setHospital] = useState(initialHospital);
  const [crm, setCrm] = useState(initialCrm);
  const [aboutText, setAboutText] = useState(initialAboutText);
  const [procedures, setProcedures] = useState(initialProcedures || []);

  // Sempre que abrir o modal, inicializa os estados:
  useEffect(() => {
    setTitle(initialTitle);
    setSpecialties(initialSpecialties || []);
    setHospital(initialHospital);
    setCrm(initialCrm);
    setAboutText(initialAboutText);
    setProcedures(initialProcedures || []);
  }, [
    initialTitle,
    initialSpecialties,
    initialHospital,
    initialCrm,
    initialAboutText,
    initialProcedures,
  ]);

  const handleSave = () => {
    // Monte o objeto com todos os campos de “About”
    onSave({
      title: title.trim(),
      specialties: specialties.map((s) => s.trim()).filter((s) => s.length > 0),
      hospital: hospital.trim(),
      crm: crm.trim(),
      about: aboutText.trim(),
      procedures: procedures.map((p) => p.trim()).filter((p) => p.length > 0),
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        <h2>Editar Sobre o Médico</h2>

        <div className={styles.formGroup}>
          <label>Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Especialidades (separadas por vírgula)</label>
          <input
            type="text"
            placeholder="Ex: Neurologia, Pediatria"
            value={specialties.join(", ")}
            onChange={(e) =>
              setSpecialties(
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s.length > 0)
              )
            }
          />
          <small>Digite cada especialidade separando por vírgula.</small>
        </div>

        <div className={styles.formGroup}>
          <label>Hospital</label>
          <input
            type="text"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>CRM</label>
          <input
            type="text"
            value={crm}
            onChange={(e) => setCrm(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Descrição (sobre)</label>
          <textarea
            rows={4}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Procedimentos (separados por vírgula)</label>
          <input
            type="text"
            placeholder="Ex: EEG, Consulta Geral"
            value={procedures.join(", ")}
            onChange={(e) =>
              setProcedures(
                e.target.value
                  .split(",")
                  .map((p) => p.trim())
                  .filter((p) => p.length > 0)
              )
            }
          />
          <small>Digite cada procedimento separando por vírgula.</small>
        </div>

        <div className={styles.actions}>
          <button className={styles.saveButton} onClick={handleSave}>
            Salvar
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutEditModal;
