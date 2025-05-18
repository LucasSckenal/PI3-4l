import React, { useState, useEffect } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../api/firebase";
import { useAccount } from "../../contexts/Account/AccountProvider";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";

const EditProfileModal = ({ onClose }) => {
  const { userData } = useAccount();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    phone: "",
    location: "",
    photo: "",
    password: "",
    birthDate: "",
  });

  const [loading, setLoading] = useState(false);

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 11);
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);

    if (!match) return value;

    const [, ddd, part1, part2] = match;
    let formatted = "";
    if (ddd) formatted += `(${ddd}`;
    if (ddd && ddd.length === 2) formatted += `) `;
    if (part1) formatted += part1;
    if (part2) formatted += `-${part2}`;
    return formatted.trim();
  };

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        name: userData.name || "",
        gender: userData.gender || "",
        phone: userData.phone || "",
        location: userData.location || "",
        photo: userData.photo || "",
        birthDate: userData.birthDate || "",
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "phone") {
      newValue = formatPhone(value);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      const userRef = doc(db, "Users", user.uid);

      const updatedData = {
        name: formData.name,
        gender: formData.gender,
        phone: formData.phone,
        location: formData.location,
        photo: formData.photo,
      };

      if (!userData.birthDate && formData.birthDate) {
        updatedData.birthDate = formData.birthDate;
      }

      await updateDoc(userRef, updatedData);

      if (formData.password) {
        await updatePassword(user, formData.password);
      }

      toast.success("Perfil atualizado com sucesso!");
      onClose();
    } catch (err) {
      toast.error("Erro ao atualizar o perfil: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.modal}>
        <h2>Editar Perfil</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.avatarLabel}>
            <img src={formData.photo || "/default-avatar.png"} alt="avatar" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>

          <input
            name="name"
            type="text"
            placeholder="Nome completo"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            type="tel"
            placeholder="Celular"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            name="location"
            type="text"
            placeholder="Localização"
            value={formData.location}
            onChange={handleChange}
          />

          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Selecione o gênero</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
            <option value="other">Outro</option>
          </select>

          <div className={styles.birthDateContainer}>
            <input
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              disabled={!!userData?.birthDate}
              required={!userData?.birthDate}
              className={userData?.birthDate ? styles.disabledInput : ""}
            />
            {userData?.birthDate && (
              <small className={styles.helperText}>
                A data de nascimento só pode ser definida uma vez.
              </small>
            )}
          </div>

          <input
            name="password"
            type="password"
            placeholder="Nova senha (opcional)"
            value={formData.password}
            onChange={handleChange}
          />

          <div className={styles.buttons}>
            <button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" onClick={onClose} className={styles.cancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
