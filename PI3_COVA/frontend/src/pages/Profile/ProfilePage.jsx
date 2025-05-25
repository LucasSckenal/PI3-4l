import { useState } from "react";
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";
import styles from "./styles.module.scss";
import { useAccount } from "../../contexts/Account/AccountProvider";
import defaultProfileIcon from "../../public/UserDefault.webp";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const { userData, loading } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

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
              alt={t("profile.alt")}
              className={styles.profilePic}
              onError={(e) => (e.target.src = defaultProfileIcon)}
            />
          </div>
          <div className={styles.userNameSection}>
            <h2 className={styles.userName}>
              {userData?.name?.length <= 17
                ? userData.name
                : userData?.name?.split(" ").slice(0, 2).join(" ")}
            </h2>
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.infoItem}>
          {t("profile.email")}: <span>{userData?.email}</span>
        </div>
        <div className={styles.infoItem}>
          {t("profile.location")}: <span>{userData?.location}</span>
        </div>
        <div className={styles.infoItem}>
          {t("profile.birthDate")}:{" "}
          <span>{formatDate(userData?.birthDate)}</span>
        </div>
        <div className={styles.infoItem}>
          {t("profile.phone")}: <span>{userData?.phone}</span>
        </div>
        <div className={styles.infoItem}>
          {t("profile.gender.label")}:{" "}
          <span>
            {userData?.gender === "male"
              ? t("profile.gender.male")
              : userData?.gender === "female"
              ? t("profile.gender.female")
              : t("profile.gender.other")}
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.editButton} onClick={handleEditProfile}>
          {t("profile.edit")}
        </button>
      </div>

      {isModalOpen && (
        <EditProfileModal isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProfilePage;
