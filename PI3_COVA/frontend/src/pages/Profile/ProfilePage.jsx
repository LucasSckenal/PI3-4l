import React, { useState } from "react";
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";
import styles from "./styles.module.scss";
import { useAccount } from "../../contexts/Account/AccountProvider";
import defaultProfileIcon from "../../public/UserDefault.webp";

const ProfilePage = () => {
  const { userData, loading } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading || !userData) {
    return <div className={styles.loading}>Carregando perfil...</div>;
  }

  const handleEditProfile = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const getProfileImageSource = () => {
    if (!userData.photo) return defaultProfileIcon;
    if (
      userData.photo.startsWith("http") ||
      userData.photo.startsWith("data:image")
    )
      return userData.photo;
    return defaultProfileIcon;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.header}>
        <div className={styles.profileHeaderContent}>
          <div className={styles.profilePicContainer}>
            <img
              src={getProfileImageSource()}
              alt="Foto de perfil"
              className={styles.profilePic}
              onError={(e) => (e.target.src = defaultProfileIcon)}
            />
          </div>
          <div className={styles.userNameSection}>
            <h2 className={styles.userName}>{userData.name}</h2>
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.infoItem}>
          Email: <span>{userData?.email}</span>
        </div>
        <div className={styles.infoItem}>
          Localização: <span>{userData?.location}</span>
        </div>
        <div className={styles.infoItem}>
          Data de Nascimento: <span>{formatDate(userData?.birthDate)}</span>
        </div>
        <div className={styles.infoItem}>
          Celular: <span>{userData?.phone}</span>
        </div>
        <div className={styles.infoItem}>
          Gênero:{" "}
          <span>
            {userData?.gender == "male"
              ? "Masculino"
              : userData?.gender == "female"
              ? "Feminino"
              : "Outro"}
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.editButton} onClick={handleEditProfile}>
          Editar Perfil
        </button>
      </div>

      {isModalOpen && (
        <EditProfileModal isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProfilePage;
