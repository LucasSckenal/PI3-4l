import React, { useState } from "react";
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";
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

  // Função para determinar a fonte da imagem
  const getProfileImageSource = () => {
    if (!userData.photo) {
      return defaultProfileIcon;
    }
    
    // Verifica se é uma URL (começa com http/https)
    if (userData.photo.startsWith('http://') || userData.photo.startsWith('https://')) {
      return userData.photo;
    }
    
    // Verifica se é base64 (começa com data:image)
    if (userData.photo.startsWith('data:image')) {
      return userData.photo;
    }
    
    // Se não for nenhum dos casos acima, assume que é um caminho relativo ou usa o ícone padrão
    return defaultProfileIcon;
  };

  return (
    <div className={styles.profileCard}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img
            src={getProfileImageSource()}
            alt="Foto de perfil"
            className={styles.avatarImg}
            onError={(e) => {
              e.target.src = defaultProfileIcon; // Fallback em caso de erro ao carregar a imagem
            }}
          />
        </div>
      </div>

      <div className={styles.infoSection}>
        <button onClick={handleEditProfile} className={styles.editButton}>
          Edit profile
        </button>
        <div className={styles.infoItem}>
          <span>{`${userData?.name}`}</span>
        </div>
        <div className={styles.infoItem}>
          <span>{userData?.birthDate}</span>
        </div>
        <div className={styles.infoItem}>
          <span>{userData?.phone}</span>
        </div>
        <div className={styles.infoItem}>
          <span>{userData?.gender}</span>
        </div>
        <div className={styles.infoItem}>
          <span>{userData?.email}</span>
        </div>
      </div>

      {/* Modal de Edição */}
      {isModalOpen && <EditProfileModal isOpen={isModalOpen} onClose={handleCloseModal} />}
    </div>
  );
};

export default ProfilePage;