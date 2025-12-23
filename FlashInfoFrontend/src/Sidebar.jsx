import React, { useState } from "react";
import { Button } from "antd";
import { Layout, Menu, Drawer } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  MenuOutlined,
  CloseOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
const { Sider } = Layout;

export default function Sidebar({ selectedKey, onSelect, onLogout }) {
  const [drawerVisible, setDrawerVisible] = useState(true);

  return (
    <>
      {/* Bouton toggle pour toutes les tailles d'écran */}
      <button
        className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-md p-3 hover:bg-gray-50 transition-colors"
        onClick={() => setDrawerVisible(true)}
      >
        <MenuOutlined style={{ fontSize: 20, color: '#374151' }} />
      </button>

      {/* Drawer pour toutes les tailles d'écran */}
      <Drawer
        placement="left"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={240}
        styles={{ body: { padding: 0 } }}
        headerStyle={{ display: 'none' }}
        mask={false}
        closable={false}
      >
        <div className="flex flex-col h-full bg-white/98 backdrop-blur-sm border-r border-gray-200 shadow-lg">
          {/* Header avec bouton de fermeture */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-blue-50/95">
            <span className="text-xl font-bold text-blue-700">Flash Info</span>
            <button
              onClick={() => setDrawerVisible(false)}
              className="p-2 hover:bg-blue-100 rounded-full transition-colors"
            >
              <CloseOutlined style={{ fontSize: 16, color: '#1d4ed8' }} />
            </button>
          </div>
          
          {/* Menu */}
          <div className="flex-1 py-4">
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={({ key }) => { onSelect(key); }}
              className="border-r-0"
              style={{ 
                backgroundColor: 'transparent',
                fontSize: '13px'
              }}
              items={[
                { 
                  key: "flash-info", 
                  icon: <InfoCircleOutlined style={{ color: '#3b82f6' }} />, 
                  label: <span className="font-medium">Flash Info</span>
                },
                { 
                  key: "syntheseGlobale", 
                  icon: <FileTextOutlined style={{ color: '#3b82f6' }} />, 
                  label: <span className="font-medium">Synthèse globale</span>
                },
                { 
                  key: "dashboard", 
                  icon: <DashboardOutlined style={{ color: '#3b82f6' }} />, 
                  label: <span className="font-medium">Dashboard</span>
                },
                { 
                  key: "settings", 
                  icon: <SettingOutlined style={{ color: '#3b82f6' }} />, 
                  label: <span className="font-medium">Settings</span>
                },
              ]}
            />
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-100 p-4">
            <Button
              type="primary"
              danger
              block
              icon={<LogoutOutlined />}
              onClick={() => {
                setDrawerVisible(false);
                if (onLogout) onLogout();
              }}
              className="font-medium"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
