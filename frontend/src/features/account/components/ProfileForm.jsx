import { useState } from "react";
import "./ProfileForm.css";

export default function ProfileForm({ initialData, onSave, onCancel, isAdmin = false }) {
  const [formData, setFormData] = useState({
    fullname: initialData?.fullname ?? initialData?.name ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      className={`profile-form ${isAdmin ? "admin-profile-form" : ""}`.trim()}
      onSubmit={handleSubmit}
    >
      <div className="profile-field">
        <label htmlFor="fullname">Full name</label>
        <div className="profile-input-row">
          <input
            id="fullname"
            name="fullname"
            type="text"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
          <span className="edit-icon" aria-hidden="true">
            ✎
          </span>
        </div>
      </div>

      <div className="profile-field">
        <label htmlFor="email">Email</label>
        <div className="profile-input-row">
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
          <span className="edit-icon" aria-hidden="true">
            ✎
          </span>
        </div>
      </div>

      <div className="profile-field">
        <label htmlFor="phone">Phone</label>
        <div className="profile-input-row">
          <input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+254 700 000 000"
            required
          />
          <span className="edit-icon" aria-hidden="true">
            ✎
          </span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="profile-save-btn" type="submit">
          Save Changes
        </button>
        <button
          className="profile-cancel-btn"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}