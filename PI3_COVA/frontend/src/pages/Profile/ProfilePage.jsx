import { useState } from "react";
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";
import styles from "./styles.module.scss";
import { useAccount } from "../../contexts/Account/AccountProvider";
import defaultProfileIcon from "../../public/UserDefault.webp";
import { useTranslation } from "react-i18next";
import {
  IoCalendarOutline,
  IoWaterOutline,
  IoBarbellOutline,
  IoLocationOutline,
  IoMailOutline,
  IoMaleFemaleOutline, 
} from "react-icons/io5";

const ProfilePage = () => {
  const { userData, loading } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-US" : "pt-BR";

  if (loading || !userData) {
    return <div className={styles.loading}>{t("profile.loading")}</div>;
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
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <img
          src={getProfileImageSource()}
          alt="Profile"
          className={styles.profileImage}
          onError={(e) => (e.target.src = defaultProfileIcon)}
        />
        <h2 className={styles.userName}>
          {userData?.name || "No Name"}
        </h2>
        <button className={styles.editButton} onClick={handleEditProfile}>
          {t("profile.edit")}
        </button>
      </div>

      <div className={styles.personalInfo}>
        <h3 className={styles.infoTitle}>{t('profile.personalInformation')}</h3>
        <div className={styles.infoItem}>
          <IoCalendarOutline className={styles.icon} />
          <span>{formatDate(userData?.birthDate)}</span>
        </div>
        <div className={styles.infoItem}>
          <IoWaterOutline className={styles.icon} />
          <span>{userData?.bloodType || "O-"}</span>
        </div>
        <div className={styles.infoItem}>
          <IoMaleFemaleOutline className={styles.icon} />
          <span>{userData?.gender || t("profile.genderUnknown")}</span>
        </div>
        <div className={styles.infoItem}>
          <IoBarbellOutline className={styles.icon} />
          <span>{userData?.weight ? `${userData.weight} kg` : "65 kg"}</span>
        </div>
        <div className={styles.infoItem}>
          <IoLocationOutline className={styles.icon} />
          <span>{userData?.location || "New York, USA"}</span>
        </div>
        <div className={styles.infoItem}>
          <IoMailOutline className={styles.icon} />
          <span>{userData?.email}</span>
        </div>
      </div>

      {isModalOpen && (
        <EditProfileModal isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProfilePage;
