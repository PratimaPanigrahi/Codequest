import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import ProgressDashboard from "../../pages/progress/ProgressDashboard.jsx";
import "./Layout.css";

const Layout = ({ children }) => {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleDashboardToggle = () => setShowDashboard(prev => !prev);

  return (
    <div className="layout-wrapper">
      <Navbar onDashboardClick={handleDashboardToggle} />

      <div className="layout-main">
        {showDashboard && (
          <aside className="dashboard-sidebar">
            <ProgressDashboard />
          </aside>
        )}

        <div className="layout-content">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
