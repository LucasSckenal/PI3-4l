import React, { useState, useEffect } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../api/firebase";
import { useAccount } from "../../contexts/Account/AccountProvider";
import styles from "./styles.module.scss";

const EditProfileModal = ({ onClose }) => {
  const { userData } = useAccount();
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    genero: "",
    celular: "",
    localizacao: "",
    photo: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        nome: userData.nome || "",
        sobrenome: userData.sobrenome || "",
        genero: userData.genero || "",
        celular: userData.celular || "",
        localizacao: userData.localizacao || "",
        photo: userData.photo || "",
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      await updateDoc(userRef, {
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        genero: formData.genero,
        celular: formData.celular,
        localizacao: formData.localizacao,
        photo: formData.photo,
      });

      if (formData.password) {
        await updatePassword(user, formData.password);
      }

      alert("Perfil atualizado com sucesso!");
      onClose();
    } catch (err) {
      alert("Erro ao atualizar perfil: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}>
      <div className={styles.modal}>
        <h2>Editar Perfil</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.avatarLabel}>
            <img src={formData.photo || "/default-avatar.png"} alt="avatar" />
            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
          </label>

          <input
            name="nome"
            type="text"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
          <input
            name="sobrenome"
            type="text"
            placeholder="Sobrenome"
            value={formData.sobrenome}
            onChange={handleChange}
          />
          <input
            name="celular"
            type="text"
            placeholder="Celular"
            value={formData.celular}
            onChange={handleChange}
          />
          <input
            name="localizacao"
            type="text"
            placeholder="Localização"
            value={formData.localizacao}
            onChange={handleChange}
          />
          <select name="genero" value={formData.genero} onChange={handleChange}>
            <option value="">Selecione o Gênero</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
          <input
            name="password"
            type="password"
            placeholder="Nova Senha (opcional)"
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
