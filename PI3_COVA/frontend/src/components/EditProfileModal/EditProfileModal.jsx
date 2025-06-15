// Novo EditProfileModal.jsx com animação e visual profissional + peso e sangue
import React, { useState, useEffect } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../api/firebase";
import { useAccount } from "../../contexts/Account/AccountProvider";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";

const EditProfileModal = ({ onClose }) => {
  const { userData } = useAccount();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    phone: "",
    location: "",
    photo: "",
    password: "",
    birthDate: "",
    weight: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        gender: userData.gender || "",
        phone: userData.phone || "",
        location: userData.location || "",
        photo: userData.photo || "",
        password: "",
        birthDate: userData.birthDate || "",
        weight: userData.weight || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "phone" ? formatPhone(value) : value }));
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 11);
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (!match) return value;
    const [, ddd, part1, part2] = match;
    let formatted = "";
    if (ddd) formatted += `(${ddd}`;
    if (ddd.length === 2) formatted += ") ";
    if (part1) formatted += part1;
    if (part2) formatted += `-${part2}`;
    return formatted;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData((prev) => ({ ...prev, photo: reader.result }));
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
        weight: formData.weight,
      };
      if (!userData.birthDate && formData.birthDate) {
        updatedData.birthDate = formData.birthDate;
      }
      await updateDoc(userRef, updatedData);

      if (formData.password) {
        await updatePassword(user, formData.password);
      }

      toast.success(t("editProfile.success"));
      onClose();
    } catch (err) {
      toast.error(t("editProfile.error") + ": " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2>{t("editProfile.title")}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.avatarLabel}>
            <img src={formData.photo || "/default-avatar.png"} alt={t("editProfile.avatarAlt")} />
            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
          </label>

          <input name="name" type="text" placeholder={t("editProfile.name")} value={formData.name} onChange={handleChange} required />
          <input name="phone" type="tel" placeholder={t("editProfile.phone")} value={formData.phone} onChange={handleChange} />
          <input name="location" type="text" placeholder={t("editProfile.location")} value={formData.location} onChange={handleChange} />
          <input name="weight" type="number" placeholder={t("editProfile.weight")} value={formData.weight} onChange={handleChange} min="0" />

          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="" hidden>{t("editProfile.gender.select")}</option>
            <option value="male">{t("editProfile.gender.male")}</option>
            <option value="female">{t("editProfile.gender.female")}</option>
            <option value="other">{t("editProfile.gender.other")}</option>
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
            {userData?.birthDate && <small className={styles.helperText}>{t("editProfile.birthDateNote")}</small>}
          </div>

          {userData?.bloodType && (
            <div className={styles.readOnlyField}>
              <label>{t("editProfile.bloodType")}:</label>
              <span>{userData.bloodType}</span>
            </div>
          )}

          <input name="password" type="password" placeholder={t("editProfile.password")} value={formData.password} onChange={handleChange} />

          <div className={styles.buttons}>
            <button type="submit" disabled={loading}>
              {loading ? t("editProfile.saving") : t("editProfile.save")}
            </button>
            <button type="button" onClick={onClose} className={styles.cancel}>
              {t("editProfile.cancel")}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;
