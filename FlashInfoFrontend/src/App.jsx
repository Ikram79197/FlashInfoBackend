import React, { useState } from "react";
import Login from "./Login";
import FlashInfo from "./FlashInfo";
import Sidebar from "./Sidebar";
import ChangePassword from "./ChangePassword";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleOtpSuccess = (token, passwordChangedFromApi) => {
    localStorage.setItem("flashinfo_token", token);
    if (passwordChangedFromApi === "0" || passwordChangedFromApi === 0) {
      setShowChangePassword(true); 
    } else {
      setIsLoggedIn(true); 
    }
  };
  const handleBackToLogin = () => {
    setShowChangePassword(false);
  };

  const handlePasswordChanged = () => {
    setShowChangePassword(false);
    setIsLoggedIn(true); 
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setShowChangePassword(false);
  };

  return (
    <div className="min-h-screen bg-background-light text-zinc-800">
      {/* 1. Écran Login */}
      {!isLoggedIn && !showChangePassword && (
        <div className="flex items-center justify-center min-h-screen">
          <Login onLogin={handleOtpSuccess} /> {/* Passe la fonction modifiée */}
        </div>
      )}

      {/* 2. Écran ChangePassword (seulement si password_changed = 0) */}
      {showChangePassword && (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <ChangePassword
            onBack={handleBackToLogin}
            onPasswordChanged={handlePasswordChanged}
          />
        </div>
      )}

      {/* 3. Dashboard */}
      {isLoggedIn && (
        <div className="flex">
          <Sidebar onLogout={handleLogout} />
          <div className="flex-1 lg:ml-56">
            <FlashInfo />
          </div>
        </div>
      )}
    </div>
  );
}