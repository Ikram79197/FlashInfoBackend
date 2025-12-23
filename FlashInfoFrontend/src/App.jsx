import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import FlashInfo from "./FlashInfo";
import SyntheseGlobale from "./SyntheseGlobale.jsx";
import Sidebar from "./Sidebar.jsx";
import Login from "./Login";
import OtpVerification from "./OtpVerification";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

// Main App Layout Component
function AppLayout({ onLogout }) {
  const [activeKey, setActiveKey] = useState("flash-info");
  const navigate = useNavigate();

  const handleNavigation = (key) => {
    setActiveKey(key);
    const routes = {
      "flash-info": "/flashInfoApp/flashInfo",
      "dashboard": "/flashInfoApp/dashboard",
      "syntheseGlobale": "/flashInfoApp/synthese-globale"
    };
    navigate(routes[key]);
  };

  const handleLogout = () => {
    localStorage.removeItem('flashinfo_token');
    onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background-light text-zinc-800 font-display flex flex-col lg:flex-row">
      <Sidebar selectedKey={activeKey} onSelect={handleNavigation} onLogout={handleLogout} />
      <div className="flex-1 lg:ml-56">
        <Routes>
          <Route path="/flashInfo" element={<FlashInfo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/synthese-globale" element={<SyntheseGlobale />} />
          <Route path="*" element={<FlashInfo />} />
        </Routes>
      </div>
    </div>
  );
}

// Authentication Wrapper
function AuthWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle successful login
  const handleLogin = (token) => {
    localStorage.setItem('flashinfo_token', token);
    setIsLoggedIn(true);
    navigate('/flashInfoApp/flashInfo', { replace: true });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('flashinfo_token');
    setIsLoggedIn(false);
    setShowOtp(false);
    setOtpData(null);
    navigate('/login', { replace: true });
  };

  // Handle OTP required
  const handleOtpRequired = (data) => {
    setOtpData(data);
    setShowOtp(true);
    navigate('/otp', { replace: true });
  };

  // Handle OTP verification
  const handleOtpVerify = (code) => {
    // OTP verified successfully
    if (otpData?.token) {
      handleLogin(otpData.token);
    }
  };

  // If not logged in, show login/OTP routes
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} onOtpRequired={handleOtpRequired} />} />
        <Route path="/otp" element={<OtpVerification onVerify={handleOtpVerify} onBack={() => navigate('/login', { replace: true })} email={otpData?.email} phone={otpData?.phone} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If logged in, show app routes
  return (
    <Routes>
      <Route path="/flashInfoApp/*" element={<AppLayout onLogout={handleLogout} />} />
      <Route path="/login" element={<Navigate to="/flashInfoApp/flashInfo" replace />} />
      <Route path="/" element={<Navigate to="/flashInfoApp/flashInfo" replace />} />
      <Route path="*" element={<Navigate to="/flashInfoApp/flashInfo" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthWrapper />
    </BrowserRouter>
  );
}
