import { Link } from "react-router-dom";
import "./homepage.css";
import safereportlogo from "../../assets/safereportlogo.png";

function HomePage() {
    return (
        <div className="homepage-container">

            <img src={safereportlogo} alt="SafeReport Logo" />

            <h2 className="title">Welcome to SafeReport</h2>

            <p className="description">
                Report emergencies, safety hazards, and incidents in real time.<br></br> Help authorities respond faster and keep our communities safe.
            </p>
            
            <button className="get-started-btn" onClick={() => window.location.href = "/login"}>
                Get Started
            </button>
            
            <p className="guest-link">
                <Link to="/login">Continue as a Guest</Link>
            </p>

        </div>
    );
}

export default HomePage;