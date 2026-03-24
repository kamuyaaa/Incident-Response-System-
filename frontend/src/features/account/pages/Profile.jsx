import PhoneFrame from "../../../shared/components/PhoneFrame";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfileForm from "../components/ProfileForm";
import "./Profile.css";
import accountService from "../services/accountService";
import { useAuth } from "../../../shared/hooks/useAuth";

function ProfileContent({ profile, onBack, onSave, onCancel, onPhotoChange, isAdmin }) {
  return (
    <div className={`profile-page ${isAdmin ? "admin-profile-page" : "mobile-profile-page"}`}>
      <div className="profile-header-row">
        <button
          className="profile-back-btn"
          onClick={onBack}
          aria-label="Go back"
        >
          ←
        </button>

        <div className="profile-header-copy">
          <p className="profile-eyebrow">Account settings</p>
          <h1>{isAdmin ? "Admin Profile" : "My Profile"}</h1>
          <p>
            {isAdmin
              ? "Manage administrator details from a desktop-friendly workspace."
              : "Keep your personal details up to date for faster emergency follow-up."}
          </p>
        </div>
      </div>

      <div className={`profile-content-shell ${isAdmin ? "admin-profile-shell" : "mobile-profile-shell"}`}>
        <div className="profile-avatar-card">
          <ProfileAvatar
            profilePhoto={profile?.profilePhoto}
            onPhotoChange={onPhotoChange}
          />
        </div>

        <div className="profile-form-card">
          <ProfileForm
            initialData={profile}
            onSave={onSave}
            onCancel={onCancel}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";


  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await accountService.getProfile(user.id);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      loadProfile();
    }
  }, [user]);

  const handleSave = async (formData) => {
    try {
      await accountService.updateProfile(user.id, {
        ...formData,
        profilePhoto: selectedPhoto || profile?.profilePhoto || "",
      });
      alert("Profile saved successfully");
      navigate(-1);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handlePhotoChange = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedPhoto(reader.result?.toString() || "");
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    const loadingContent = <div className="profile-status-message">Loading profile...</div>;
    return isAdmin ? loadingContent : <PhoneFrame>{loadingContent}</PhoneFrame>;
  }

  if (error) {
    const errorContent = <div className="profile-status-message">{error}</div>;
    return isAdmin ? errorContent : <PhoneFrame>{errorContent}</PhoneFrame>;
  }
 const content = (
    <ProfileContent
      profile={profile}
      profilePhoto={selectedPhoto || profile?.profilePhoto}
      onBack={() => navigate(-1)}
      onSave={handleSave}
      onCancel={handleCancel}
      onPhotoChange={handlePhotoChange}
      isAdmin={isAdmin}
    />
  );
  return isAdmin ? content : <PhoneFrame>{content}</PhoneFrame>;
}