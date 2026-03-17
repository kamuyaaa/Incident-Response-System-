import { useNavigate } from "react-router-dom";
import "./forgotpassword.css";

function ForgotPasswordPage() {
    const navigate = useNavigate();

    return (
        <div className="forgot-container">

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
            

            <h2 className="title">Reset Your Password</h2>

            <p className="description">
                Enter your registered email address below, and we'll send you instructions on how to reset your password.
            </p>

            <div className="form-group">
                <input
                    type="email"
                    placeholder="Enter your email"
                />
            </div>
            
            <button className="reset-link-btn" onClick={() => window.location.href = "/email-sent"}>
                Send Reset Link to Your Email
            </button>

        </div>
    );
}

export default ForgotPasswordPage;