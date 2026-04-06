import { useNavigate } from "react-router-dom";
import PhoneFrame from "../shared/components/PhoneFrame";
import HeroSection from "./landing/HeroSection";
import FeaturesSection from "./landing/FeaturesSection";
import DemoLoginCard from "./landing/DemoLoginCard";
import Footer from "./landing/Footer";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      <div className="landing-page">
        <HeroSection
          onLogin={() => navigate("/login")}
          onGuest={() => navigate("/reporter/report")}
        />
        <FeaturesSection />
        <DemoLoginCard />
        <Footer />
      </div>
    </PhoneFrame>
  );
}
