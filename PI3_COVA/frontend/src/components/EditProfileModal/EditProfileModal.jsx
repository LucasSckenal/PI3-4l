import React, { useState, useEffect } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../api/firebase";
import { useAccount } from "../../contexts/Account/AccountProvider";
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
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        name: userData.name || "",
        gender: userData.gender || "",
        phone: userData.phone || "",
        location: userData.location || "",
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
        name: formData.name,
        gender: formData.gender,
        phone: formData.phone,
        location: formData.location,
        photo: formData.photo,
      });

      if (formData.password) {
        await updatePassword(user, formData.password);
      }

      alert("Profile updated successfully!");
      onClose();
    } catch (err) {
      alert("Error updating profile: " + err.message);
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
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.avatarLabel}>
            <img src={formData.photo || "/default-avatar.png"} alt="avatar" />
            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
          </label>

          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            name="location"
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            name="password"
            type="password"
            placeholder="New Password (optional)"
            value={formData.password}
            onChange={handleChange}
          />
          <div className={styles.buttons}>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={onClose} className={styles.cancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
