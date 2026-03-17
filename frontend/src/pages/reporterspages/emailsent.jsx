import { useNavigate } from "react-router-dom";
import "./emailsent.css";

function EmailSentPage() {
    const navigate = useNavigate();
    
    return (
        <div className="sent-container">
            
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

            <h2 className="title">E-mail Sent</h2>

            <p className="description-1">
                We have sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
            </p>

            <p className="description-2">
                 If you don't see the email, please check your spam folder or try again.
            </p>
            
            <div className="button-group">

                <button className="try-again-btn" onClick={() => window.location.href = "/forgot-password"}>
                    Try Again
                </button>

                <button className="back-to-login-btn" onClick={() => window.location.href = "/login"}>
                    Back to Login
                </button>
            </div>

        </div>
    );
}

export default EmailSentPage;