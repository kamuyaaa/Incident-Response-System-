import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./incidentcategories.css";

function IncidentCategories() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [actionType, setActionType] = useState("");
    const profileImage = null; 
    const navigate = useNavigate(); 
    
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

    return (
        <div className="incident-categories-container">
            <svg
                onClick={() => navigate(-1)}
                className="back-arrow"
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
                            <h4>John Doe</h4>
                            <p>johndoe@example.com</p>
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

            <h2 className="title">
                What kind of emergency are you experiencing?
            </h2>
            
            <Link to="/incident-description/Medical Emergency" className="category-item">
                <span className="category-left">

                    <svg
                        className="category-item-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        viewBox="0 -960 960 960"
                        width="40"
                        fill="#000000"
                    >
                        <path d="M450-300h60v-150h150v-60H510v-150h-60v150H300v60h150v150ZM224.62-160q-27.62 0-46.12-18.5Q160-197 160-224.62v-510.76q0-27.62 18.5-46.12Q197-800 224.62-800h510.76q27.62 0 46.12 18.5Q800-763 800-735.38v510.76q0 27.62-18.5 46.12Q763-160 735.38-160H224.62Zm0-40h510.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93v-510.76q0-9.24-7.69-16.93-7.69-7.69-16.93-7.69H224.62q-9.24 0-16.93 7.69-7.69 7.69-7.69 16.93v510.76q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69ZM200-760v560-560Z"/>
                    </svg>
                            
                        Medical Emergency
                            
                </span>
            </Link>

            <Link to="/incident-description/Crime & Safety" className="category-item">
                <span className="category-left">

                    <svg
                        className="category-item-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        viewBox="0 -960 960 960"
                        width="40"
                        fill="#000000"
                    >
                        <path d="M397.23-376 480-440l80.77 62.46-31.23-100.61 85.84-66.47H513.23L480-646.77l-33.23 102.15H344.62l83.84 66.47L397.23-376ZM480-121.54q-120.54-35.77-200.27-146.04Q200-377.85 200-516v-216.31l280-104.61 280 104.61V-516q0 138.15-79.73 248.42Q600.54-157.31 480-121.54Zm0-42.46q104-33 172-132t68-220v-189l-240-89.23L240-705v189q0 121 68 220t172 132Zm0-315.23Z"/>
                    </svg>
                            
                        Crime & Safety
                            
                </span>
            </Link>

            <Link to="/incident-description/Natural Disaster" className="category-item">
                <span className="category-left">

                    <svg
                        className="category-item-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        viewBox="0 -960 960 960"
                        width="40"
                        fill="#000000"
                    >
                        <path d="M100-140.77v-40.77q33.38-6.15 49.58-21.92 16.19-15.77 64.42-15.77 52.08 0 71.62 20 19.53 20 61.38 20t61.38-20q19.54-20 71.62-20 50.85 0 72.12 20 21.26 20 61.88 20 41.85 0 61.38-20 19.54-20 71.62-20 48.23 0 63.92 15.77 15.7 15.77 49.08 21.92v40.77q-38-4.61-57-21.54-19-16.92-56-16.92-40.85 0-61.38 20-20.54 20-71.62 20-51.08 0-72.12-20-21.03-20-61.88-20-41.85 0-61.38 20-19.54 20-71.62 20-52.08 0-71.62-20-19.53-20-61.38-20-37 0-56 16.92-19 16.93-58 21.54ZM347-280q-50.08 0-71.23-20-21.15-20-61.77-20-35 0-55.62 16.92-20.61 16.93-58.38 21.54v-40.77q33.38-6.15 49.46-21.92Q165.54-360 213.77-360q17.54 0 32.77 4.35 15.23 4.34 41 19.19l-58-218.46-61.16 76.61-31.46-24.61 266.39-329.39 395.61 151.39-14.38 37.3-90.92-35.53L780-355.08q20.92 2.62 39.42 15.39T860-322.31v40q-37.77-4.84-57-21.27Q783.77-320 747-320q-41.85 0-61.38 20-19.54 20-71.62 20-50.85 0-72.12-20-21.26-20-61.88-20-41.85 0-61.38 20-19.54 20-71.62 20Zm0-40q33.85 0 51.88-14.38 18.04-14.39 50.5-22.39L407-512l155-41 61.38 232q34.08-2.77 52.08-19.65 18-16.89 61.16-19.12l-89.85-337.15L416.23-784 260.77-593.69l72.85 272.46q4 1 7.34 1.11 3.35.12 6.04.12Zm152.08-232Z"/>
                    </svg>
                            
                        Natural Disaster
                            
                </span>
            </Link>

            <Link to="/incident-description/Road & Transport" className="category-item">
                <span className="category-left">

                    <svg
                        className="category-item-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        viewBox="0 -960 960 960"
                        width="40"
                        fill="#000000"
                    >
                        <path d="M160-240v-193.85V-240Zm-40-193.85L199.38-660q2.93-9.54 11.27-14.77Q219-680 229.23-680h180.69q-.69 10 .08 20 .77 10 2.23 20H235.54l-58.92 166.15h346.69q23.92 16.31 50.69 26.43 26.77 10.11 57.38 13.57H160V-240h560v-185.31q9.46-.69 20.23-4t19.77-8.46V-140q0 8.5-5.75 14.25T740-120h-9.23q-8.5 0-14.25-5.75T710.77-140v-60H169.23v60q0 8.5-5.75 14.25T149.23-120H140q-8.5 0-14.25-5.75T120-140v-293.85Zm503.26 141.54q18.66 0 31.55-13.06 12.88-13.07 12.88-31.73 0-18.67-13.06-31.55-13.07-12.89-31.73-12.89-18.67 0-31.55 13.07-12.89 13.06-12.89 31.73 0 18.66 13.07 31.55 13.06 12.88 31.73 12.88Zm-366.16 0q18.67 0 31.55-13.06 12.89-13.07 12.89-31.73 0-18.67-13.07-31.55-13.06-12.89-31.73-12.89-18.66 0-31.55 13.07-12.88 13.06-12.88 31.73 0 18.66 13.06 31.55 13.07 12.88 31.73 12.88ZM664.3-520q-66.53 0-113.11-46.58-46.57-46.57-46.57-113.71 0-66.33 46.49-113.02T664.93-840q66.53 0 113.11 46.58 46.58 46.57 46.58 113.42t-46.9 113.42Q730.83-520 664.3-520Zm-15.07-135.38H680v-120h-30.77v120Zm15.39 73.84q8 0 12.84-5.23 4.85-5.23 5.62-12.46 0-7.69-5.23-13.46-5.23-5.77-13.23-5.77t-13.24 5.23q-5.23 5.23-5.23 13.23t5.23 13.23q5.24 5.23 13.24 5.23Z"/>
                    </svg>
                            
                        Road & Transport
                            
                </span>
            </Link>

            <Link to="/incident-description/Fire & Rescue" className="category-item">
                <span className="category-left">

                    <svg
                        className="category-item-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        viewBox="0 -960 960 960"
                        width="40"
                        fill="#000000"
                    >
                        <path d="M240-400q0 68.92 36.77 126.58 36.77 57.65 98.85 86.5-7.93-11.93-11.77-24.77Q360-224.54 360-238q0-23.54 9.31-44.62 9.31-21.07 26.15-37.92L480-403.85l85.31 83.31q16.84 16.85 25.77 37.92Q600-261.54 600-238q0 13.46-3.85 26.31-3.84 12.84-11.77 24.77 62.08-28.85 98.85-86.5Q720-331.08 720-400q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62.77 0-108.27-41-45.5-41-51.73-102.54-39 32.23-69 67.73-30 35.5-50.5 72.77-20.5 37.27-31 75.27-10.5 38-10.5 75.77Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm-40-420.46V-708q0 50.92 35.04 85.46Q510.08-588 561-588q18.77 0 36.58-6.35 17.8-6.34 33.65-18.27l17.23-13.53q52.46 38.92 82 98.92T760-400q0 117.08-81.46 198.54T480-120q-117.08 0-198.54-81.46T200-400q0-102.85 64.58-201.15Q329.15-699.46 440-768.46Z"/>
                    </svg>
                            
                        Fire & Rescue
                            
                </span>
            </Link>

            <Link to="/incident-description/Public Safety & Welfare" className="category-item">
                <span className="category-left">

                    <svg
                        className="category-item-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        viewBox="0 -960 960 960"
                        width="40"
                        fill="#000000"
                    >
                       <path d="M85.69-422.62q-22.61-37.53-34.15-76.46Q40-538 40-576q0-93.54 65.23-158.77T264-800q60.69 0 116.54 31.5Q436.38-737 480-677.69q43.62-59.31 99.46-90.81Q635.31-800 696-800q93.54 0 158.77 65.23T920-576q0 36.46-11.54 74.62-11.54 38.15-34.15 78-6.26-8.27-14.78-14.79-8.53-6.52-17.76-10.91 19-33.77 28.61-65.38Q880-546.08 880-576q0-77.23-53.38-130.62Q773.23-760 696-760q-61.77 0-112.19 37.19Q533.38-685.62 480-616q-53.38-69.85-103.81-106.92Q325.77-760 264-760q-77.23 0-130.62 53.38Q80-653.23 80-576q0 31.46 9.62 63.46 9.61 32 27.84 64.23-9.23 5.16-17.31 11.31-8.07 6.15-14.46 14.38ZM40-118.46V-153q0-37.08 39.16-61.27 39.16-24.19 101.63-24.19 11.44 0 21.9.88 10.46.89 19.93 2.89-8.62 15.38-13.31 32.31-4.69 16.93-4.69 36.07v47.85H40Zm240 0v-45q0-49.62 55.48-78.85 55.47-29.23 144.73-29.23 90.1 0 144.94 29.23Q680-213.08 680-163.46v45H280Zm475.38 0v-47.85q0-19.14-4.19-36.07t-12.57-32.31q9.46-2 19.95-2.89 10.49-.88 21.43-.88 63 0 101.5 24.19T920-153v34.54H755.38ZM479.91-231.54q-67.68 0-112.29 18.08-44.62 18.08-46.47 46.54v8.46h317.93v-8.46q-2.08-28.46-46.2-46.54-44.11-18.08-112.97-18.08Zm-299.14-44.61q-23.48 0-40.2-16.73-16.72-16.72-16.72-40.2 0-23.23 16.72-39.69 16.72-16.46 40.2-16.46 23.23 0 40.08 16.46 16.84 16.46 16.84 39.69 0 23.48-16.84 40.2-16.85 16.73-40.08 16.73Zm599.23 0q-23 0-39.96-16.73-16.96-16.72-16.96-40.2 0-23.23 16.96-39.69 16.96-16.46 40.11-16.46 23.85 0 40.31 16.46t16.46 39.69q0 23.48-16.36 40.2-16.37 16.73-40.56 16.73Zm-299.73-25.39q-36.42 0-62.19-25.58-25.77-25.57-25.77-62.11 0-37.27 25.57-62.48 25.58-25.21 62.12-25.21 37.27 0 62.48 25.13 25.21 25.13 25.21 62.29 0 36.42-25.13 62.19-25.13 25.77-62.29 25.77ZM480-436.92q-19.31 0-33.5 13.71-14.19 13.71-14.19 33.98 0 19.31 14.19 33.5 14.19 14.19 33.88 14.19 19.7 0 33.5-14.19 13.81-14.19 13.81-33.89 0-19.69-13.71-33.5-13.71-13.8-33.98-13.8Zm0 47.69Zm.23 230.77Z"/>
                    </svg>
                            
                        Public Safety & Welfare
                            
                </span>
            </Link>

            <Link to="/incident-description/Other" className="category-item">
                <span className="category-left">

                    <svg
                        className="category-item-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        viewBox="0 -960 960 960"
                        width="40"
                        fill="#000000"
                    >
                        <path d="M652.15-216.31q7.85-7.84 7.85-19.07 0-11.24-7.85-19.08-7.84-7.85-19.07-7.85T614-254.46q-7.85 7.84-7.85 19.08 0 11.23 7.85 19.07 7.85 7.85 19.08 7.85 11.23 0 19.07-7.85Zm86.93 0q7.84-7.84 7.84-19.07 0-11.24-7.84-19.08-7.85-7.85-19.08-7.85-11.23 0-19.08 7.85-7.84 7.84-7.84 19.08 0 11.23 7.84 19.07 7.85 7.85 19.08 7.85 11.23 0 19.08-7.85Zm86.92 0q7.85-7.84 7.85-19.07 0-11.24-7.85-19.08-7.85-7.85-19.08-7.85-11.23 0-19.07 7.85-7.85 7.84-7.85 19.08 0 11.23 7.85 19.07 7.84 7.85 19.07 7.85t19.08-7.85ZM224.62-160q-26.85 0-45.74-18.88Q160-197.77 160-224.62v-510.76q0-26.85 18.88-45.74Q197.77-800 224.62-800h510.76q26.85 0 45.74 18.88Q800-762.23 800-735.38v238q-10.54-3.62-20.15-5.89-9.62-2.27-19.85-4.5v-227.61q0-9.24-7.69-16.93-7.69-7.69-16.93-7.69H224.62q-9.24 0-16.93 7.69-7.69 7.69-7.69 16.93v510.76q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69h226.61q1.46 11.23 3.73 20.85 2.27 9.61 5.89 19.15H224.62ZM200-240v40-560V-507.77v-3V-240Zm100-69.23h158.38q2.24-10.23 6.04-19.85 3.81-9.61 7.96-20.15H300v40ZM300-460h263.23q19.69-13.85 38.81-23.46 19.11-9.62 41.04-15.08V-500H300v40Zm0-150.77h360v-40H300v40ZM720-75.38q-66.85 0-113.42-46.58Q560-168.54 560-235.38q0-66.85 46.58-113.43 46.57-46.57 113.42-46.57t113.42 46.57Q880-302.23 880-235.38q0 66.84-46.58 113.42Q786.85-75.38 720-75.38Z"/>
                    </svg>
                            
                        Other
                            
                </span>
            </Link>
                    
        </div>
    );
}

export default IncidentCategories; 