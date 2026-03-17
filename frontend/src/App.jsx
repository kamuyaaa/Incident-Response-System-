import { Routes, Route } from "react-router-dom";

import ReporterLogin from "./pages/reporterspages/reporterslogin";

import ReportersRegistration from "./pages/reporterspages/reportersregistration";

import Homepage from "./pages/reporterspages/homepage";

import ForgotPasswordPage from "./pages/reporterspages/forgotpassword";

import EmailSentPage from "./pages/reporterspages/emailsent";

import ReportIncidentPage from "./pages/reporterspages/reportincidentpage";

import EmergencyNumbers from "./pages/reporterspages/emergencynumbers";

import ReportedByYou from "./pages/reporterspages/reportedbyyou";

import ReportedByOthers from "./pages/reporterspages/reportedbyothers";

import AccountSettings from "./pages/reporterspages/accountsettings";

import IncidentCategories from "./pages/reporterspages/incidentcategories";

import IncidentDescription from "./pages/reporterspages/incidentdescription";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />

      <Route path="/login" element={<ReporterLogin />} />

      <Route path="/register" element={<ReportersRegistration />} />

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/email-sent" element={<EmailSentPage />} />

      <Route path="/report-incident" element={<ReportIncidentPage />} />

      <Route path="/emergency-numbers" element={<EmergencyNumbers />} />

      <Route path="/reported-by-you" element={<ReportedByYou />} />

      <Route path="/reported-by-others" element={<ReportedByOthers />} />

      <Route path="/account-settings" element={<AccountSettings />} />

      <Route path="/incident-categories" element={<IncidentCategories />} />

      <Route path="/incident-description/:type" element={<IncidentDescription />} />
    </Routes>
  );
}

export default App;