import React, { useState } from "react";
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal"; // Importa o modal
import styles from "./styles.module.scss";
import { useAccount } from "../../contexts/Account/AccountProvider";
import defaultProfileIcon from "../../public/UserDefault.webp";

const ProfilePage = () => {
  const { userData, loading } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading || !userData) {
    return <div>Carregando perfil...</div>;
  }

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.profileCard}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img
            src={userData.photo ? userData.photo : defaultProfileIcon}
            alt="Foto de perfil"
            className={styles.avatarImg}
          />
        </div>
      </div>

      <div className={styles.infoSection}>
        <button onClick={handleEditProfile} className={styles.editButton}>
          Edit profile
        </button>
        <div className={styles.infoItem}>
          <span>{`${userData.nome} ${userData.sobrenome}`}</span>
        </div>
        <div className={styles.infoItem}>
          <span>{userData.nascimento}</span>
        </div>
        <div className={styles.infoItem}>
          <span>{userData.celular}</span>
        </div>
        <div className={styles.infoItem}>
          <span>{userData.genero}</span>
        </div>
        <div className={styles.infoItem}>
          <span>{userData.email}</span>
        </div>
      </div>

      {/* Modal de Edição */}
      {isModalOpen && <EditProfileModal isOpen={isModalOpen} onClose={handleCloseModal} />}
    </div>
  );
};

export default ProfilePage;
