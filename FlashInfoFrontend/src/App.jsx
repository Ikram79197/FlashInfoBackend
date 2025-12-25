import React, { useState } from "react";
import Login from "./Login";
import FlashInfo from "./FlashInfo";
import Sidebar from "./Sidebar";

export default function App() {
  // 🔹 Par défaut = PAS CONNECTÉ → LOGIN affiché
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // LOGIN
  const handleLogin = (token) => {
    localStorage.setItem("flashinfo_token", token);
    setIsLoggedIn(true);
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("flashinfo_token");
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-background-light text-zinc-800">
      
      {/* 🔥 PREMIÈRE PAGE = LOGIN */}
      {!isLoggedIn && (
        <div className="flex items-center justify-center min-h-screen">
          <Login onLogin={handleLogin} />
        </div>
      )}

      {/* 🔥 APRÈS LOGIN */}
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
