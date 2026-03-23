import { useRef } from "react";
import "./ProfileAvatar.css";

export default function ProfileAvatar({ profilePhoto, onPhotoChange }) {
  const fileInputRef = useRef(null);

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onPhotoChange) {
      onPhotoChange(file);
    }
  };

  return (
    <div className="profile-avatar-section">
      <div className="profile-avatar-wrap" onClick={handlePickImage}>
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Profile"
            className="profile-avatar-image"
          />
        ) : (
          <div className="profile-avatar-placeholder">📷</div>
        )}
      </div>

      <button
        type="button"
        className="change-photo-btn"
        onClick={handlePickImage}
      >
        Change Profile Photo
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden-file-input"
        onChange={handleFileChange}
      />
    </div>
  );
}