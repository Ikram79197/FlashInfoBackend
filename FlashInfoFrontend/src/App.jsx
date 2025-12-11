import React, { useState } from "react";
import Dashboard from "./Dashboard.jsx";
import FlashInfo from "./FlashInfo";
import SyntheseGlobale from "./SyntheseGlobale.jsx";
import Sidebar from "./Sidebar.jsx";
import Login from "./Login.jsx";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";


export default function App() {
  const [activeKey, setActiveKey] = useState("flash-info");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-background-light text-zinc-800 font-display flex flex-col lg:flex-row">
      <Sidebar selectedKey={activeKey} onSelect={setActiveKey} />
      <div className="flex-1 lg:ml-56">
        {activeKey === "dashboard" && <Dashboard />}
        {activeKey === "syntheseGlobale" && <SyntheseGlobale />}
        {activeKey === "flash-info" && <FlashInfo />}
      </div>
    </div>
  );
}
