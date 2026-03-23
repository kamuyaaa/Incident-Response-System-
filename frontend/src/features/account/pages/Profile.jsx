import PhoneFrame from "../../../shared/components/PhoneFrame";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfileForm from "../components/ProfileForm";
import "./Profile.css";
import accountService from "../services/accountService";
import { useAuth } from "../../../shared/hooks/useAuth";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
      await accountService.updateProfile(user.id, formData);
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
    console.log("Selected photo:", file);
  };

  if (loading) {
    return (
      <PhoneFrame>
        <div className="profile-page">Loading profile...</div>
      </PhoneFrame>
    );
  }

  if (error) {
    return (
      <PhoneFrame>
        <div className="profile-page">{error}</div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="profile-page">
        <button
          className="profile-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ←
        </button>

        <ProfileAvatar
          profilePhoto={profile?.profilePhoto}
          onPhotoChange={handlePhotoChange}
        />

        <ProfileForm
          initialData={profile}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </PhoneFrame>
  );
}