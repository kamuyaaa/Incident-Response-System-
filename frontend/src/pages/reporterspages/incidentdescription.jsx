import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./incidentdescription.css";

function IncidentDescription() {const { type } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState("");
  const profileImage = null; 

  const navigate = useNavigate();

  const [incidentId, setIncidentId] = useState("");
  const [description, setDescription] = useState("");
  const [casualties, setCasualties] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState([]);

  const handleLogout = () => {
    setActionType("logout");
    setShowConfirm(true);
  };
    
  const handleDelete = () => {
    setActionType("delete");
    setShowConfirm(true);
  };
    
  const confirmAction = () => {
    setShowConfirm(false);
    setMenuOpen(false);
    navigate("/");
  };
    
  const cancelAction = () => {
    setShowConfirm(false);
  };
  
  useEffect(() => {
     const id = "INC-" + Date.now();
      setIncidentId(id);
  }, []);

  const handleFileUpload = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const reportData = {
      incidentId,
      emergencyType: type,
      description,
      casualties,
      location,
      files
    };

    console.log("Report Submitted:", reportData);

    navigate("/report-submitted");
  };

  return (
    <div className="incident-description-container">
      
      <svg
        onClick={() => navigate(-1)}
        className="exit-arrow"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px" 
        fill="#000000"
      >
        <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
      </svg>

      <svg
        className="menu-icon"
        xmlns="http://www.w3.org/2000/svg"
        height="28px"
        viewBox="0 -960 960 960"
        width="28px"
        fill="#000000"
        onClick={() => setMenuOpen(true)}
      >
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
      </svg>

      {menuOpen && (
        <div className="menu-popup">

          <button
            className="close-btn"
            onClick={() => setMenuOpen(false)}>
              ✕
          </button>

          <Link to="/account-settings" className="profile">
            <div className="menu-left">

              {profileImage ? (

                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-picture"
                />

                ) : (

                <svg
                  className="avatar-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  height="40"
                  viewBox="0 -960 960 960"
                  width="40"
                  fill="#000000"
                >
                   <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Z"/>
                </svg>

                )}

            </div>

            <div className="profile-info">
              <h4>
                John Doe
              </h4>

              <p>
                johndoe@example.com
              </p>

            </div>
          </Link>

          <hr />

          <p className="menu-section">
            GENERAL
          </p>

          <Link to="/report-incident" 
          className="menu-item">
            <span className="menu-left">

              <svg
                className="menu-item-icon"
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="#000000"
              >
                <path d="M720-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-600 40q-33 0-56.5-23.5T40-200v-560q0-33 23.5-56.5T120-840h560q33 0 56.5 23.5T760-760v200h-80v-80H120v440h520v80H120Zm0-600h560v-40H120v40Zm0 0v-40 40Z"/>
              </svg>

              REPORT AN INCIDENT
                            
            </span>

            <svg
              className="arrow-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="15"
              viewBox="0 -960 960 960"
              width="15"
              fill="#000000"
            >
              <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/>
            </svg>
            
          </Link>

          <Link to="/reported-by-you" className="menu-item">
            <span className="menu-left">

              <svg
                className="menu-item-icon"
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="#000000"
              >
                <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"/>
              </svg>

              REPORTED BY YOU
            </span>

            <svg
              className="arrow-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="15"
              viewBox="0 -960 960 960"
              width="15"
              fill="#000000"
            >
              <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/>
            </svg>
          </Link>

          <Link to="/reported-by-others" className="menu-item">
            <span className="menu-left">

              <svg
                className="menu-item-icon"
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="#000000"
              >
                <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-7-.5-14.5T799-507q-5 29-27 48t-52 19h-80q-33 0-56.5-23.5T560-520v-40H400v-80q0-33 23.5-56.5T480-720h40q0-23 12.5-40.5T563-789q-20-5-40.5-8t-42.5-3q-134 0-227 93t-93 227h200q66 0 113 47t47 113v40H400v110q20 5 39.5 7.5T480-160Z"/>
              </svg>
                            
              REPORTED BY OTHERS
                            
            </span>

            <svg
              className="arrow-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="15"
              viewBox="0 -960 960 960"
              width="15"
              fill="#000000"
            >
              <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/>
            </svg>
          </Link>

          <hr />

          <p className="menu-section">
            PRIVACY & SAFETY
          </p>

          <Link to="/account-settings" className="menu-item">
           <span className="menu-left">

              <svg
                className="menu-item-icon"
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="#000000"
              >
                <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Z"/>
              </svg>
                            
              ACCOUNT
                            
            </span>
                        
            <svg
              className="arrow-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="15"
              viewBox="0 -960 960 960"
              width="15"
              fill="#000000"
            >
              <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/>
            </svg>
          </Link>

          <hr />

          <p className="menu-section">
            DANGER ZONE
          </p>

          <div className="danger-item" onClick={handleLogout}>
            LOGOUT
          </div>

          <div className="danger-item" onClick={handleDelete}>
            DELETE
          </div>

        </div>
      )}

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">

            <svg
              className="arrow-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="60"
              viewBox="0 -960 960 960"
              width="60"
              fill="#CD1E1E"
            >
              <path d="M508.5-291.5Q520-303 520-320t-11.5-28.5Q497-360 480-360t-28.5 11.5Q440-337 440-320t11.5 28.5Q463-280 480-280t28.5-11.5ZM440-440h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
            </svg>

            <p>
              {actionType === "logout"
              ? "Are you sure you want to logout from this account?"
              : "Are you sure you want to delete your account? All your data will be permanently removed and cannot be recovered."}
            </p>

            <div className="confirm-buttons">

              <button
                className="confirm-btn"
                onClick={confirmAction}
              >
                {actionType === "logout" ? "LOGOUT" : "DELETE"}
              </button>

              <button
                className="cancel-btn"
                onClick={cancelAction}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="report-header">
        <h2>
          Send Report
        </h2>
      </div>

      <div className="report-info">
        <p className="incident-id">
          Incident ID: <br></br> {incidentId}
        </p>

        <p className="incident-type">
          Emergency Type: <br></br> {type}
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>

        <label>
          Description
        </label>

        <textarea
          placeholder="Describe the situation..."
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>
          Any casualties? If yes, how many?
        </label>

        <input
          type="text"
          placeholder="Yes, 1 person"
          value={casualties}
          onChange={(e) => setCasualties(e.target.value)}
        />

        <label>
          Location
        </label>

        <input
          type="text"
          placeholder="TRM, Thika Road"
          value={location}
          required
          onChange={(e) => setLocation(e.target.value)}
        />

        <label>
          Upload Pictures / Videos (optional)
        </label>

        <div className="upload-box">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
          />
        </div>

        <button className="submit-btn">
          SUBMIT REPORT
        </button>

      </form>

    </div>
  );
}

export default IncidentDescription;