import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "../../layouts/PublicLayout";
import AdminLayout from "../../layouts/AdminLayout";
import ReporterLayout from "../../layouts/ReporterLayout";
import ResponderLayout from "../../layouts/ResponderLayout";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import Landing from "../../features/public/pages/Landing";
import Login from "../../features/auth/pages/Login";
import Register from "../../features/auth/pages/Register";
import ForgotPassword from "../../features/auth/pages/ForgotPassword";


import Profile from "../../features/account/pages/Profile";
import Dashboard from "../../features/admin/pages/Dashboard";
import IncidentsQueue from "../../features/admin/pages/IncidentsQueue";
import AssignResponder from "../../features/admin/pages/AssignResponder";

import ReporterHome from "../../features/reporter/pages/ReporterHome";
import ReportIncident from "../../features/reporter/pages/ReportIncident";
import ReportDetails from "../../features/reporter/pages/ReportDetails";
import MyReports from "../../features/reporter/pages/MyReports";

import MyAssignments from "../../features/responder/pages/MyAssignments";
import IncidentUpdates from "../../features/responder/pages/IncidentUpdates";
import ResponderMyReports from "../../features/responder/pages/ResponderMyReports";
import ResponderReportDetails from "../../features/responder/pages/ResponderReportDetails";
import ResponderReportIncident from "../../features/responder/pages/ResponderReportIncident";

import Unauthorized from "../../shared/components/Unauthorized";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* REPORTER (PUBLIC - Guest allowed) */}
        <Route path="/reporter" element={<ReporterLayout />}>
          <Route index element={<ReporterHome />} />
          <Route path="report" element={<ReportIncident />} />
          <Route path="report/details" element={<ReportDetails />} />
          <Route path="my-reports" element={<MyReports />} />
        </Route>

        {/* PROTECTED (Admin + Responder) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/account/profile" element={<Profile />} />

          <Route element={<RoleRoute allow={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="incidents" element={<IncidentsQueue />} />
              <Route path="assign" element={<AssignResponder />} />
            </Route>
          </Route>

          <Route element={<RoleRoute allow={["responder"]} />}>
            <Route path="/responder" element={<ResponderLayout />}>
              <Route index element={<MyAssignments />} />
              <Route path="updates" element={<IncidentUpdates />} />
              <Route path="report" element={<ResponderMyReports/>}/>
              <Route path="report/details" element={<ResponderReportDetails />} />
              <Route path="report/new" element={<ResponderReportIncident />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}