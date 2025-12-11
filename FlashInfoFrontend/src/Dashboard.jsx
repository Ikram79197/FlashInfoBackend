import React, { useState } from "react";
import { Button, Card, Layout, Table, Tag } from "antd";
import {
  DownloadOutlined,
  PlusOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  DashboardOutlined,
  BarChartOutlined,
  FileTextOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar as RechartsBar,
  Line as RechartsLine,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import Sidebar from "./Sidebar.jsx";
import SyntheseGlobale from "./SyntheseGlobale.jsx";

const { Content } = Layout;

const dataGlobal = [
  // Vie
  {
    branche: "Capitalisation",
    ca: 32926257,
    taux: 6.03,
  },
  {
    branche: "Retraite",
    ca: 32945917,
    taux: 40.75,
  },
  {
    branche: "Décès",
    ca: 7069009,
    taux: 32.71,
  },
  // Non Vie
  {
    branche: "Auto",
    ca: 1752558855,
    taux: 9.44,
  },
  {
    branche: "AT",
    ca: 239094187,
    taux: 7.36,
  },
  {
    branche: "Maladie",
    ca: 82405719,
    taux: 30.17,
  },
  {
    branche: "Divers",
    ca: 345525988,
    taux: 11.78,
  },
];

const regionsColumns = [
  {
    title: "Region",
    dataIndex: "region",
  },
  {
    title: "YTD Revenue",
    dataIndex: "revenue",
    align: "right",
  },
  {
    title: "Evolution %",
    dataIndex: "evolution",
    align: "right",
    render: (value, record) => (
      <span className={record.colorClass}>{value}</span>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    align: "center",
    render: (value, record) => <Tag color={record.tagColor}>{value}</Tag>,
  },
];



function Dashboard() {
  return (
    <Content className="p-4 md:p-6 lg:p-8">
      {/* Header */}
        <div style={{ textAlign: "center", padding: 50, width: "100%" }}>
          <h1 className="text-2xl font-bold text-zinc-900">Tableau de bord</h1>
          <p className="text-zinc-500">
            Bon retour, voici votre résumé des revenus.
          </p>
        </div>
        {/* <div className="flex items-center gap-2">
          <Button
            icon={<CalendarOutlined />}
            className="bg-card-light border-border-light rounded-lg"
          >
            Last 30 days
          </Button>
          <Button
            icon={<DownloadOutlined />}
            className="bg-card-light border-border-light rounded-lg"
          />
          <Button type="primary" icon={<PlusOutlined />} className="rounded-lg">
            New Report
          </Button>
        </div> */}
      {/* Main content area */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Top summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* ...existing code... */}
            <Card className="bg-card-light border border-border-light rounded-lg shadow-sm">
              <div className="text-zinc-500 text-sm font-medium">CA du jour - Total</div>
              <p className="text-2xl font-semibold text-zinc-900 mt-2">3 488 484,00</p>
              <p className="text-sm text-emerald-500 mt-1">+7,11 % vs YTD</p>
            </Card>
            <Card className="bg-card-light border border-border-light rounded-lg shadow-sm">
              <div className="text-zinc-500 text-sm font-medium">CA du jour - Non Vie</div>
              <p className="text-2xl font-semibold text-zinc-900 mt-2">3 477 623,00</p>
              <p className="text-sm text-emerald-500 mt-1">+10,16 % vs YTD</p>
            </Card>
            <Card className="bg-card-light border border-border-light rounded-lg shadow-sm">
              <div className="text-zinc-500 text-sm font-medium">CA du jour - Vie</div>
              <p className="text-2xl font-semibold text-zinc-900 mt-2">10 861,00</p>
              <p className="text-sm text-emerald-500 mt-1">+6,15 % vs YTD</p>
            </Card>
            <Card className="bg-card-light border border-border-light rounded-lg shadow-sm">
              <div className="text-zinc-500 text-sm font-medium">Fill Rate</div>
              <p className="text-2xl font-semibold text-zinc-900 mt-2">19,24 %</p>
              <p className="text-sm text-red-500 mt-1">-2,5 % vs Nov. 2024</p>
            </Card>
          </div>
          {/* CA Vie / Non Vie - Graphique global Recharts */}
          <Card className="bg-card-light border border-border-light rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Graphique global CA Vie / Non Vie (J-1)</h3>
            <p className="text-xs text-zinc-500 mb-4">Barres = CA total &nbsp;•&nbsp; Courbe = taux (%).</p>
            <div className="w-full h-80">
              <ResponsiveContainer>
                <ComposedChart data={dataGlobal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="branche" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip />
                  <Legend />
                  <RechartsBar yAxisId="left" dataKey="ca" fill="#3b82f6" name="CA Total" />
                  <RechartsLine yAxisId="right" type="monotone" dataKey="taux" stroke="#ef4444" strokeWidth={2} name="Taux (%)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
          {/* Revenue by Type (donut) - moved below the global chart */}
          <Card className="bg-card-light border border-border-light rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Revenus par Type</h3>
            <div className="h-56 relative flex items-center justify-center mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#67e8f9" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#60a5fa" strokeWidth="12" strokeDasharray="189.28 62.83" strokeDashoffset="0" transform="rotate(-90 50 50)" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xs text-zinc-500">Total CA</span>
                <span className="text-2xl font-bold text-zinc-900 text-center leading-tight">11 868 520,38</span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-400 mr-2" />
                  <span>Vie</span>
                </div>
                <span className="font-medium text-zinc-900">75.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-sky-300 mr-2" />
                  <span>Non-Vie</span>
                </div>
                <span className="font-medium text-zinc-900">24.5%</span>
              </div>
            </div>
          </Card>
        </div>
        {/* Right side */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Revenue Trend */}
          <Card className="bg-white border border-zinc-200 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">
                  Tendance des Revenus
                </h3>
                <p className="text-sm text-zinc-500">Performance depuis le début de l'année</p>
              </div>
              <div className="flex items-center gap-4 mt-3 sm:mt-0 text-sm">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-primary mr-2" />
                  <span>2025</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-zinc-300 mr-2" />
                  <span>2024</span>
                </div>
              </div>
            </div>
            <div className="h-80 w-full">
              {/* SVG statique, comme dans ton HTML d'origine */}
              <svg className="font-sans text-xs" viewBox="0 0 500 250" width="100%" height="100%">
                <g className="text-zinc-400">
                  <line x1="40" y1="20" x2="40" y2="220" stroke="currentColor" strokeWidth="1" strokeDasharray="2,3" />
                  <line x1="40" y1="220" x2="480" y2="220" stroke="currentColor" strokeWidth="1" />
                  <text x="30" y="25" textAnchor="end">10k</text>
                  <text x="30" y="75" textAnchor="end">7.5k</text>
                  <text x="30" y="125" textAnchor="end">5k</text>
                  <text x="30" y="175" textAnchor="end">2.5k</text>
                  <text x="30" y="225" textAnchor="end">0</text>
                  <text x="60" y="235" textAnchor="middle">Jan</text>
                  <text x="130" y="235" textAnchor="middle">Mar</text>
                  <text x="200" y="235" textAnchor="middle">Mai</text>
                  <text x="270" y="235" textAnchor="middle">Jul</text>
                  <text x="340" y="235" textAnchor="middle">Sep</text>
                  <text x="410" y="235" textAnchor="middle">Nov</text>
                </g>
                <polyline
                  fill="none"
                  stroke="#a1a1aa"
                  strokeWidth="2"
                  points="60,180 130,160 200,120 270,140 340,110 410,90 480,100"
                />
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  points="60,150 130,130 200,80 270,90 340,60 410,40 480,25"
                />
                <circle
                  cx="480"
                  cy="25"
                  r="4"
                  fill="#3b82f6"
                  stroke="#fff"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </Card>
      
          {/* Flash Info table */}
          <Card className="bg-white border border-zinc-200 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <InfoCircleOutlined className="text-primary text-2xl mr-3" />
              <h2 className="text-lg font-semibold text-primary">Flash Info</h2>
            </div>
            <Table
              className="rounded-xl overflow-hidden text-xs"
              pagination={false}
              columns={[
                { title: '', dataIndex: 'type', key: 'type' },
                { title: 'CA 20/11/25', dataIndex: 'ca', key: 'ca', align: 'right' },
                { title: 'YTD (C.A)', dataIndex: 'ytd', key: 'ytd', align: 'right' },
                { title: 'YTD (Evo %)', dataIndex: 'evo', key: 'evo', align: 'right', render: (text) => <span className="bg-green-500 text-white rounded font-semibold px-2 py-1">{text}</span> },
              ]}
              dataSource={[
                { key: 'nonvie', type: 'Non Vie', ca: '3 477 623,00', ytd: '2 419 567 016,15', evo: '10,16 %' },
                { key: 'vie', type: 'Vie', ca: '10 861,00', ytd: '7 449 270 414,23', evo: '6,15 %' },
                { key: 'total', type: <span className="font-bold">Total</span>, ca: <span className="font-bold">3 488 484,00</span>, ytd: <span className="font-bold">9 868 837 430,38</span>, evo: <span className="font-bold">7,11 %</span> },
              ]}
              rowClassName={(record) => record.key === 'total' ? 'bg-zinc-100' : ''}
            />
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-[#C55A11] bg-opacity-70 mr-2" />
                <span className="text-zinc-600">Baisse par rapport à l'année précédente</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-[#D5A680] bg-opacity-80 mr-2" />
                <span className="text-zinc-600">Croissance inférieure à 5&nbsp;%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-[#70AD47] bg-opacity-80 mr-2" />
                <span className="text-zinc-600">Croissance supérieure à 5&nbsp;%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-[#A9D18E] bg-opacity-80 mr-2" />
                <span className="text-zinc-600">Croissance supérieure à 100&nbsp;%</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </Content>
  );
}

export default Dashboard;
