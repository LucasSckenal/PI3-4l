import React from "react";
import styles from "./styles.module.scss";
import { FaUser, FaBirthdayCake, FaPhone, FaInstagram, FaEnvelope, FaEye, FaArrowLeft } from "react-icons/fa";

const ProfilePage = () => {
  return (
    <div className={styles.profileCard}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <FaUser />
        </div>
        
      </div>
    
      <div className={styles.infoSection}>
        <button className={styles.editButton}>Edit profile</button>
        <div className={styles.infoItem}>
          <FaUser />
          <span>Anna Avetisyan</span>
        </div>
        <div className={styles.infoItem}>
          <FaBirthdayCake />
          <span>Birthday</span>
        </div>
        <div className={styles.infoItem}>
          <FaPhone />
          <span>818 123 4567</span>
        </div>
        <div className={styles.infoItem}>
          <FaInstagram />
          <span>Instagram account</span>
        </div>
        <div className={styles.infoItem}>
          <FaEnvelope />
          <span>info@aplusdesign.co</span>
        </div>
        <div className={styles.infoItem}>
          <FaEye />
          <span>Password</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
