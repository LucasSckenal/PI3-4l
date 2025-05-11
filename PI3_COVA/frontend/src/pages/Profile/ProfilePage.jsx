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

  const getProfileImageSource = () => {
    if (!userData.photo) {
      return defaultProfileIcon;
    }
    
    if (userData.photo.startsWith('http://') || userData.photo.startsWith('https://')) {
      return userData.photo;
    }
    
    if (userData.photo.startsWith('data:image')) {
      return userData.photo;
    }
    
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
              e.target.src = defaultProfileIcon; 
            }}
          />
        </div>
      </div>

      <div className={styles.infoSection}>
        <button onClick={handleEditProfile} className={styles.editButton}>
          Edit profile
        </button>
        <div className={styles.infoItem}>
          Nome: <span>{`${userData?.name}`}</span>
        </div>
          <div className={styles.infoItem}>
          Email: <span>{userData?.email}</span>
        </div>
        <div className={styles.infoItem}>
          Data de Nascimento: <span>{userData?.birthDate}</span>
        </div>
        <div className={styles.infoItem}>
          Celular: <span>{userData?.phone}</span>
        </div>
        <div className={styles.infoItem}>
          Gênero: <span>{userData?.gender}</span>
        </div>
      </div>

      {/* Modal de Edição */}
      {isModalOpen && <EditProfileModal isOpen={isModalOpen} onClose={handleCloseModal} />}
    </div>
  );
};

export default ProfilePage;