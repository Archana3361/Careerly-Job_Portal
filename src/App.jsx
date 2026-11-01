import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashboard";
import MyApplications from "./pages/MyApplications";
import SavedJobs from "./pages/SavedJobs";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminApplications from "./pages/AdminApplications";
import AdminApplicationDetails from "./pages/AdminApplicationDetails";

// Routes that don't show the main Navbar/Footer
const NO_SHELL = ["/login", "/register"];

// Routes that don't show Footer
const NO_FOOTER = [
  "/dashboard", "/my-applications", "/saved-jobs",
  "/notifications", "/profile", "/admin"
];

const ProtectedRoute = ({ children, requireRole }) => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && currentUser.role !== requireRole) {
    return <Navigate to={currentUser.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return children;
};

const AppShell = () => {
  const location = useLocation();
  const path = location.pathname;

  const hideShell = NO_SHELL.some(p => path === p);
  const hideFooter = NO_FOOTER.some(p => path.startsWith(p));

  return (
    <>
      {!hideShell && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/apply/:id" element={<ApplyJob />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute requireRole="candidate"><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/my-applications" element={<ProtectedRoute requireRole="candidate"><MyApplications /></ProtectedRoute>} />
          <Route path="/saved-jobs" element={<ProtectedRoute requireRole="candidate"><SavedJobs /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute requireRole="candidate"><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute requireRole="candidate"><Profile /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute requireRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/applications" element={<ProtectedRoute requireRole="admin"><AdminApplications /></ProtectedRoute>} />
          <Route path="/admin/applications/:appId" element={<ProtectedRoute requireRole="admin"><AdminApplicationDetails /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={
            <div className="container py-5 text-center">
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "6rem", fontWeight: 900, color: "var(--lavender)", lineHeight: 1 }}>404</div>
              <h3 style={{ fontFamily: "Playfair Display, serif" }}>Page not found</h3>
              <p style={{ color: "var(--text-muted)" }}>The page you're looking for doesn't exist.</p>
              <a href="/" className="btn-lime btn mt-3">Back to Home</a>
            </div>
          } />
        </Routes>
      </main>

      {!hideShell && !hideFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;
