import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forgotpassword.css";

function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser || storedUser.email !== email) {
            alert("Email not found. Please check or register.");
            return;
        }

        alert("Password reset link sent!");

        navigate("/email-sent");
    };

    return (
        <form className="forgot-container" onSubmit={handleSubmit}> 

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            
            <button className="reset-link-btn" type="submit">
                Send Reset Link to Your Email
            </button>

        </form>
    );
}

export default ForgotPasswordPage;