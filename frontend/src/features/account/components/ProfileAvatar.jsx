import PhoneFrame from "../../../shared/components/PhoneFrame";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfileForm from "../components/ProfileForm";
import "../pages/Profile";

export default function Profile() {
  const navigate = useNavigate();

  const user = {
    fullname: "John Doe",
    email: "johndoe@gmail.com",
    phone: "+254 736 190 7387",
    password: "**********",
    profilePhoto: "",
  };

  const handleSave = (formData) => {
    console.log("Saving profile:", formData);
    alert("Profile saved successfully");
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handlePhotoChange = (file) => {
    console.log("Selected photo:", file);
  };

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
          profilePhoto={user.profilePhoto}
          onPhotoChange={handlePhotoChange}
        />

        <ProfileForm
          initialData={user}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </PhoneFrame>
  );
}