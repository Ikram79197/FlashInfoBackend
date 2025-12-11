import React, { useState, useEffect } from "react";
import { Table, Collapse } from "antd";
import { getCaVie, getCaNonVie, getCaNonVieMensuel, getEmissions500KDHS } from "./Api/FlashInfoApi";

// Fonction utilitaire pour déterminer la couleur selon la valeur d'évolution
function getEvolutionColor(value) {
  if (value === "" || value == null) return "";
  // Nettoyer la valeur (ex: "-4,29%" ou "38,15%")
  const num = parseFloat(value.replace("%", "").replace(",", "."));
  if (isNaN(num)) return "";
  if (num < 0) return "bg-red-500 text-white"; // baisse
  if (num < 5) return "bg-orange-400"; // <5%
  if (num < 100) return "bg-green-500 text-white"; // >5%
  return "bg-green-700 text-white"; // >100%
}

function SyntheseGlobale() {
  const [syntheseVieData, setSyntheseVieData] = useState([]);
  const [syntheseNonVieData, setSyntheseNonVieData] = useState([]);
  const [emissions500Data, setEmissions500Data] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vieData, nonVieData, emissionsData] = await Promise.all([
          getCaVie(),
          getCaNonVie(),
          getEmissions500KDHS()
        ]);
        setSyntheseVieData(Array.isArray(vieData) ? vieData : []);
        setSyntheseNonVieData(Array.isArray(nonVieData) ? nonVieData : []);
        setEmissions500Data(Array.isArray(emissionsData) ? emissionsData : []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Set empty arrays in case of error to prevent crashes
        setSyntheseVieData([]);
        setSyntheseNonVieData([]);
        setEmissions500Data([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction helper pour parser les nombres formatés
  const parseIntSafe = (str) => {
    if (!str || str === '0') return 0;
    return parseInt(str.replace(/\s/g, ''), 10) || 0;
  };

  // Transformer les données de l'API en format tableau
  const getTableData = () => {
    if (!syntheseVieData || syntheseVieData.length === 0) {
      return [
        { key: 'mac', bu: 'MAC', capitalisation: '0', retraite: '0', deces: '0', total: '0' },
        { key: 'mcma', bu: 'MCMA', capitalisation: '0', retraite: '0', deces: '0', total: '0' },
        { key: 'total', bu: 'Total', capitalisation: '0', retraite: '0', deces: '0', total: '0' }
      ];
    }

    // L'API retourne des lignes avec format: { bu: "MCMA - Capitalisation", vie: 198256.8 }
    // On doit regrouper par BU (MAC/MCMA) et créer des colonnes pour chaque branche
    const grouped = {};
    
    syntheseVieData.forEach(item => {
      // Extraire BU et branche du champ "bu" (ex: "MCMA - Capitalisation")
      const parts = item.bu.split(' - ');
      const bu = parts[0]; // "MCMA" ou "MAC"
      const branche = parts[1]; // "Capitalisation", "Retraite", "Décés"
      
      if (!grouped[bu]) {
        grouped[bu] = {
          key: bu.toLowerCase(),
          bu: bu,
          capitalisation: '0',
          retraite: '0',
          deces: '0',
          total: 0
        };
      }
      
      const montant = Math.round(item.vie || 0);
      const formatted = montant.toLocaleString('fr-FR').replace(/,/g, ' ');
      
      if (branche === 'Capitalisation') {
        grouped[bu].capitalisation = formatted;
      } else if (branche === 'Retraite') {
        grouped[bu].retraite = formatted;
      } else if (branche === 'Décés') {
        grouped[bu].deces = formatted;
      }
      
      grouped[bu].total += montant;
    });
    
    // Formater les totaux par BU
    Object.keys(grouped).forEach(bu => {
      grouped[bu].total = grouped[bu].total.toLocaleString('fr-FR').replace(/,/g, ' ');
    });
    
    // Créer le tableau final avec MAC, MCMA et Total
    const result = [];
    if (grouped['MAC']) result.push(grouped['MAC']);
    if (grouped['MCMA']) result.push(grouped['MCMA']);
    
    // Calculer le total général
    const totalCap = (parseIntSafe(grouped['MAC']?.capitalisation) + parseIntSafe(grouped['MCMA']?.capitalisation));
    const totalRet = (parseIntSafe(grouped['MAC']?.retraite) + parseIntSafe(grouped['MCMA']?.retraite));
    const totalDec = (parseIntSafe(grouped['MAC']?.deces) + parseIntSafe(grouped['MCMA']?.deces));
    const totalGen = totalCap + totalRet + totalDec;
    
    result.push({
      key: 'total',
      bu: 'Total',
      capitalisation: totalCap.toLocaleString('fr-FR').replace(/,/g, ' '),
      retraite: totalRet.toLocaleString('fr-FR').replace(/,/g, ' '),
      deces: totalDec.toLocaleString('fr-FR').replace(/,/g, ' '),
      total: totalGen.toLocaleString('fr-FR').replace(/,/g, ' ')
    });
    
    return result;
  };

  if (loading) {
    return (
      <div className="p-2 sm:p-4 md:p-8 space-y-6 flex justify-center items-center">
        <div className="text-lg">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-8 space-y-6">
      <div className="text-center py-8">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900">Synthèse globale du CA</h1>
      </div>

      {/* Bloc 1 : CA du jour / CA du mois (Ant Design Table) */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-2 flex flex-col md:flex-row gap-4 items-start mx-auto">
        {/* Table à gauche */}
        <div className="flex-1 min-w-0">
          {/* Titre au-dessus du tableau */}
          <h2 className="text-lg font-semibold text-zinc-900 mb-2 text-left">CA du jour </h2>
          <div className="w-full flex justify-center">
            <div className="w-full max-w-5xl overflow-x-auto">
              <Table
                className="rounded-xl overflow-hidden text-lg w-full min-w-[600px]"
                pagination={false}
                columns={[
                  { title: '', dataIndex: 'type', key: 'type', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-medium text-blue-900'}>{text}</span> },
                  { title: 'CA du jour', dataIndex: 'caJour', key: 'caJour', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  { title: 'CA du mois de Novembre arrêté au 25/11/2025', dataIndex: 'caMoisNov', key: 'caMoisNov', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  { title: 'CA du mois de Novembre 2024', dataIndex: 'caMois2024', key: 'caMois2024', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  { title: 'Taux de remplissage 2025 %', dataIndex: 'tauxRemplissage', key: 'tauxRemplissage', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold bg-green-200 text-blue-900 px-2 py-1 rounded' : 'bg-green-300 text-blue-900 px-2 py-1 rounded'}>{text}</span> },
                ]}
                dataSource={[
                  { key: 'nonvie', type: 'Non Vie', caJour: '3 385 336', caMoisNov: '86 210 582', caMois2024: '99 944 035', tauxRemplissage: '86,26 %' },
                  { key: 'vie', type: 'Vie', caJour: '410 840 165', caMoisNov: '646 362 187', caMois2024: '648 408 028', tauxRemplissage: '99,68 %' },
                  { key: 'total', type: 'Total', caJour: '414 225 501', caMoisNov: '732 572 769', caMois2024: '748 352 063', tauxRemplissage: '97,89 %' },
                ]}
                rowClassName={(record) => record.key === 'total' ? 'bg-blue-100 font-bold' : 'bg-blue-50'}
              />
            </div>
          </div>
        </div>
        {/* Barres à droite */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mt-2 space-y-6">
            <div className="flex items-center text-sm space-x-4">
              <span className="font-medium w-24">Non Vie</span>
              <div className="flex-1 bg-zinc-200 rounded-full h-4">
                <div
                  className="bg-emerald-500 h-4 rounded-full text-white text-xs flex items-center justify-end pr-2"
                  style={{ width: "50.26%" }}
                />
              </div>
            </div>
            <div className="flex items-center text-sm space-x-4">
              <span className="font-medium w-24">Vie</span>
              <div className="flex-1 bg-zinc-200 rounded-full h-4">
                <div
                  className="bg-emerald-500 h-4 rounded-full text-white text-xs flex items-center justify-end pr-2"
                  style={{ width: "99.68%" }}
                />
              </div>
            </div>
          </div>
          {/* Graduation sous les barres */}
          <div className="flex items-center text-xs text-zinc-600 mt-4 w-full px-2">
            <span className="w-24" />
            <div className="flex-1 flex justify-between">
              <span className="text-center">0%</span>
              <span className="text-center">20%</span>
              <span className="text-center">40%</span>
              <span className="text-center">60%</span>
              <span className="text-center">80%</span>
              <span className="text-center">100%</span>
              <span className="text-center">120%</span>
              <span className="text-center">140%</span>
              <span className="text-center">160%</span>
            </div>
          </div>
          {/* Légende des couleurs sous les barres */}
          <div className="flex flex-wrap items-center gap-6 mt-8 justify-center">
            <div className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-1 shadow-sm">
              <span className="h-4 w-4 rounded-full bg-red-500 border-2 border-white shadow"></span>
              <span className="text-sm text-gray-700 font-medium">Chiffre d’affaires en baisse</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-1 shadow-sm">
              <span className="h-4 w-4 rounded-full bg-orange-400 border-2 border-white shadow"></span>
              <span className="text-sm text-gray-700 font-medium">Croissance inférieure à 5 %</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-1 shadow-sm">
              <span className="h-4 w-4 rounded-full bg-green-500 border-2 border-white shadow"></span>
              <span className="text-sm text-gray-700 font-medium">Croissance supérieure à 5 %</span>
            </div>
            <div className="flex items-center gap-2 bg-green-100 rounded-lg px-3 py-1 shadow-sm">
              <span className="h-4 w-4 rounded-full bg-green-700 border-2 border-white shadow"></span>
              <span className="text-sm text-gray-700 font-medium">Croissance supérieure à 100 %</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bloc 3 : CA Non Vie par branche et par BU */}
      <Collapse
        defaultActiveKey={['1']}
        items={[{
          key: '1',
          label: (
            <span className="text-lg font-semibold text-zinc-900">
              CA Non Vie du 25/11/2025 par branche et par BU
            </span>
          ),
          children: (
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-2">
              <Table
                className="rounded-xl overflow-hidden text-xs compact-table"
                size="small"
                pagination={false}
                columns={[
                  {
                    title: 'BU', dataIndex: 'bu', key: 'bu', align: 'left', render: (text, record) =>
                      <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-medium text-blue-900'}>{text}</span>
                  },
                  { title: 'AUTO', dataIndex: 'auto', key: 'auto', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  { title: 'AT', dataIndex: 'at', key: 'at', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  { title: 'MALADIE', dataIndex: 'maladie', key: 'maladie', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  { title: 'DIVERS', dataIndex: 'divers', key: 'divers', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  { title: 'Total', dataIndex: 'total', key: 'total', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold bg-blue-100 text-blue-900 px-1 py-0.5 rounded' : 'font-bold bg-blue-50 text-blue-900 px-1 py-0.5 rounded'}>{text}</span> },
                ]}
                dataSource={(() => {
                  // Grouper par BU (hors Total), additionner les montants
                  const grouped = {};
                  let totalAuto = 0, totalAt = 0, totalMaladie = 0, totalDivers = 0, totalTotal = 0;
                  
                  // Helper pour convertir string ou number en number
                  const toNumber = (val) => {
                    if (typeof val === 'number') return val;
                    if (typeof val === 'string') return parseInt(val.replace(/\s/g, '').replace(/,/g, '')) || 0;
                    return 0;
                  };
                  
                  (syntheseNonVieData || []).forEach(item => {
                    if (!item.bu || item.bu.toLowerCase() === 'total') return;
                    const bu = item.bu;
                    const auto = toNumber(item.auto);
                    const at = toNumber(item.at);
                    const maladie = toNumber(item.maladie);
                    const divers = toNumber(item.divers);
                    const total = toNumber(item.total) || (auto+at+maladie+divers);
                    if (!grouped[bu]) {
                      grouped[bu] = { bu, auto: 0, at: 0, maladie: 0, divers: 0, total: 0 };
                    }
                    grouped[bu].auto += auto;
                    grouped[bu].at += at;
                    grouped[bu].maladie += maladie;
                    grouped[bu].divers += divers;
                    grouped[bu].total += total;
                  });
                  // Formatage
                  const format = n => n.toLocaleString('fr-FR').replace(/,/g, ' ');
                  const rows = Object.values(grouped).map((item, idx) => {
                    totalAuto += item.auto;
                    totalAt += item.at;
                    totalMaladie += item.maladie;
                    totalDivers += item.divers;
                    totalTotal += item.total;
                    return {
                      key: item.bu.toLowerCase().replace(/[^a-z0-9]/g, ''),
                      bu: item.bu,
                      auto: format(item.auto),
                      at: format(item.at),
                      maladie: format(item.maladie),
                      divers: format(item.divers),
                      total: format(item.total)
                    };
                  });
                  // Ligne total
                  rows.push({
                    key: 'total',
                    bu: 'Total',
                    auto: format(totalAuto),
                    at: format(totalAt),
                    maladie: format(totalMaladie),
                    divers: format(totalDivers),
                    total: format(totalTotal)
                  });
                  return rows;
                })()}
                rowClassName={(record) => record.key === 'total' ? 'bg-zinc-100 font-bold' : ''}
              />
            </div>
          )
        }]}
      />
      <Collapse
        defaultActiveKey={['1']}
        items={[
          {
            key: '1',
            label: (
              <span className="text-lg font-semibold text-zinc-900">
                CA Vie du 25/11/2025 par branche et par BU
              </span>
            ),
            children: (
              <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-2">
                <Table
                  className="rounded-xl overflow-hidden text-xs compact-table"
                  size="small"
                  pagination={false}
                  columns={[
                    {
                      title: 'BU',
                      dataIndex: 'bu',
                      key: 'bu',
                      align: 'left',
                      render: (text, record) => (
                        <span
                          className={
                            record.key === 'total'
                              ? 'font-bold text-blue-900'
                              : 'font-medium text-blue-900'
                          }
                        >
                          {text}
                        </span>
                      ),
                    },
                    {
                      title: 'Capitalisation',
                      dataIndex: 'capitalisation',
                      key: 'capitalisation',
                      align: 'right',
                      render: (text, record) => (
                        <span className="font-bold text-blue-900">{text}</span>
                      ),
                    },
                    {
                      title: 'Retraite',
                      dataIndex: 'retraite',
                      key: 'retraite',
                      align: 'right',
                      render: (text, record) => (
                        <span className="font-bold text-blue-900">{text}</span>
                      ),
                    },
                    {
                      title: 'Décès',
                      dataIndex: 'deces',
                      key: 'deces',
                      align: 'right',
                      render: (text, record) => (
                        <span className="font-bold text-blue-900">{text}</span>
                      ),
                    },
                    {
                      title: 'Total',
                      dataIndex: 'total',
                      key: 'total',
                      align: 'right',
                      render: (text, record) => (
                        <span
                          className={
                            record.key === 'total'
                              ? 'font-bold bg-blue-100 text-blue-900 px-1 py-0.5 rounded' : 'font-bold bg-blue-50 text-blue-900 px-1 py-0.5 rounded'
                          }
                        >
                          {text}
                        </span>
                      ),
                    },
                  ]}
                  dataSource={getTableData()}
                  rowClassName={(record) =>
                    record.key === 'total' ? 'bg-zinc-100 font-bold' : ''
                  }
                />
              </div>
            ),
          },
        ]}
      />


 <Collapse
        defaultActiveKey={['1']}
        items={[{
          key: '1',
          label: (
            <span className="text-lg font-semibold text-zinc-900">
              Les émissions supérieures à 500 KDHS
            </span>
          ),
          children: (
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-4">
              <Table
                className="rounded-xl overflow-hidden text-xs"
                pagination={{ pageSize: 10 }}
                columns={[
                  { title: 'NON VIE', dataIndex: 'nonVie', key: 'nonVie', align: 'center', render: (text) => <span className="font-medium text-blue-900">{text}</span> },
                  { title: 'Compagnie', dataIndex: 'compagnie', key: 'compagnie', align: 'center', render: (text) => <span className="font-medium text-blue-900">{text}</span> },
                  { title: 'Segment', dataIndex: 'segment', key: 'segment', align: 'center', render: (text) => <span className="font-medium text-blue-900">{text}</span> },
                  { title: 'Nom site', dataIndex: 'nomSite', key: 'nomSite', align: 'center', render: (text) => <span className="font-medium text-blue-900">{text}</span> },
                  { title: 'Police', dataIndex: 'police', key: 'police', align: 'center', render: (text) => <span className="font-medium text-blue-900">{text}</span> },
                  { title: 'Nom client', dataIndex: 'nomClient', key: 'nomClient', align: 'center', render: (text) => <span className="font-medium text-blue-900">{text}</span> },
                  { title: 'Produit', dataIndex: 'produit', key: 'produit', align: 'center', render: (text) => <span className="font-medium text-blue-900">{text}</span> },
                  { title: 'Avenant', dataIndex: 'avenant', key: 'avenant', align: 'center', render: (text) => <span className="font-medium text-blue-900">{text}</span> },
                  { title: 'Date Effet', dataIndex: 'dateEffet', key: 'dateEffet', align: 'center', render: (text) => <span className="font-medium text-blue-900">{text}</span> },
                  { title: 'Date émission', dataIndex: 'dateEmission', key: 'dateEmission', align: 'center', render: (text) => <span className="font-medium text-blue-900">{text}</span> },
                  { title: 'Prime Nette', dataIndex: 'primeNette', key: 'primeNette', align: 'center', render: (text) => <span className="font-bold text-blue-900">{text}</span> },
                ]}
                rowClassName={() => 'bg-blue-50'}
                dataSource={emissions500Data.map((item, index) => ({
                  key: index,
                  nonVie: item.source || '',
                  compagnie: item.compagnie || '',
                  segment: item.segment || '',
                  nomSite: item.nomSite || '',
                  police: item.police || '',
                  nomClient: item.nomClient || '',
                  produit: item.produit || '',
                  avenant: item.avenant || '',
                  dateEffet: item.dateEffet ? new Date(item.dateEffet).toLocaleDateString('fr-FR') : '',
                  dateEmission: item.dateEmission ? new Date(item.dateEmission).toLocaleDateString('fr-FR') : '',
                  primeNette: item.primeNette ? item.primeNette.toLocaleString('fr-FR') : '0'
                }))}
                scroll={{ x: 1200 }}
              />
            </div>
          )
        }]}
      />
      <Collapse
        defaultActiveKey={['1']}
        items={[{
          key: '1',
          label: (
            <span className="text-lg font-semibold text-zinc-900">
              CA Non Vie du mois de Novembre au 25/11/2025 par branche et par BU
            </span>
          ),
          children: (
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-4">
              <Table
                className="rounded-xl overflow-hidden text-xs"
                pagination={false}
                columns={[
                  { title: 'BU', dataIndex: 'bu', key: 'bu', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-medium text-blue-900'}>{text}</span> },
                  { title: 'AUTO CA', dataIndex: 'autoCa', key: 'autoCa', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  {
                    title: 'AUTO Taux de remplissage', dataIndex: 'autoEvo', key: 'autoEvo', align: 'right', render: (text, record) => {
                      const color = getEvolutionColor(text);
                      let style = "px-2 py-1 rounded font-bold ";
                      if (color.includes("red")) style += "bg-red-500 text-white";
                      else if (color.includes("orange")) style += "bg-orange-400 text-white";
                      else if (color.includes("green-500")) style += "bg-green-500 text-white";
                      else if (color.includes("green-700")) style += "bg-green-700 text-white";
                      else style += "bg-gray-100 text-blue-900";
                      return <span className={record.key === 'total' ? style + ' bg-blue-100' : style + ' bg-blue-50'}>{text}</span>;
                    }
                  },
                  { title: 'AT CA', dataIndex: 'atCa', key: 'atCa', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  {
                    title: 'AT Taux de remplissage', dataIndex: 'atEvo', key: 'atEvo', align: 'right', render: (text, record) => {
                      const color = getEvolutionColor(text);
                      let style = "px-2 py-1 rounded font-bold ";
                      if (color.includes("red")) style += "bg-red-500 text-white";
                      else if (color.includes("orange")) style += "bg-orange-400 text-white";
                      else if (color.includes("green-500")) style += "bg-green-500 text-white";
                      else if (color.includes("green-700")) style += "bg-green-700 text-white";
                      else style += "bg-gray-100 text-blue-900";
                      return <span className={record.key === 'total' ? style + ' bg-blue-100' : style + ' bg-blue-50'}>{text}</span>;
                    }
                  },
                  { title: 'MALADIE CA', dataIndex: 'maladieCa', key: 'maladieCa', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  {
                    title: 'MALADIE Taux de remplissage', dataIndex: 'maladieEvo', key: 'maladieEvo', align: 'right', render: (text, record) => {
                      const color = getEvolutionColor(text);
                      let style = "px-2 py-1 rounded font-bold ";
                      if (color.includes("red")) style += "bg-red-500 text-white";
                      else if (color.includes("orange")) style += "bg-orange-400 text-white";
                      else if (color.includes("green-500")) style += "bg-green-500 text-white";
                      else if (color.includes("green-700")) style += "bg-green-700 text-white";
                      else style += "bg-gray-100 text-blue-900";
                      return <span className={record.key === 'total' ? style + ' bg-blue-100' : style + ' bg-blue-50'}>{text}</span>;
                    }
                  },
                  { title: 'DIVERS CA', dataIndex: 'diversCa', key: 'diversCa', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  {
                    title: 'DIVERS Taux de remplissage', dataIndex: 'diversEvo', key: 'diversEvo', align: 'right', render: (text, record) => {
                      const color = getEvolutionColor(text);
                      let style = "px-2 py-1 rounded font-bold ";
                      if (color.includes("red")) style += "bg-red-500 text-white";
                      else if (color.includes("orange")) style += "bg-orange-400 text-white";
                      else if (color.includes("green-500")) style += "bg-green-500 text-white";
                      else if (color.includes("green-700")) style += "bg-green-700 text-white";
                      else style += "bg-gray-100 text-blue-900";
                      return <span className={record.key === 'total' ? style + ' bg-blue-100' : style + ' bg-blue-50'}>{text}</span>;
                    }
                  },
                  { title: 'Total CA', dataIndex: 'totalCa', key: 'totalCa', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  {
                    title: 'Total Taux de remplissage', dataIndex: 'totalEvo', key: 'totalEvo', align: 'right', render: (text, record) => {
                      const color = getEvolutionColor(text);
                      let style = "px-2 py-1 rounded font-bold ";
                      if (color.includes("red")) style += "bg-red-500 text-white";
                      else if (color.includes("orange")) style += "bg-orange-400 text-white";
                      else if (color.includes("green-500")) style += "bg-green-500 text-white";
                      else if (color.includes("green-700")) style += "bg-green-700 text-white";
                      else style += "bg-gray-100 text-blue-900";
                      return <span className={record.key === 'total' ? style + ' bg-blue-100' : style + ' bg-blue-50'}>{text}</span>;
                    }
                  },
                ]}
                dataSource={[
                  { key: 'courtage', bu: 'COURTAGE', autoCa: '4 213 941', autoEvo: '24,09 %', atCa: '-68 368', atEvo: '-3,27 %', maladieCa: '4 885 681', maladieEvo: '76,72 %', diversCa: '3 199 363', diversEvo: '106,90 %', totalCa: '12 230 617', totalEvo: '42,25 %' },
                  { key: 'maem', bu: 'MAEM', autoCa: '17 820 999', autoEvo: '98,68 %', atCa: '380 297', atEvo: '93,47 %', maladieCa: '149 439', maladieEvo: '87,30 %', diversCa: '1 125 957', diversEvo: '82,71 %', totalCa: '19 476 691', totalEvo: '97,39 %' },
                  { key: 'mamda', bu: 'MAMDA_HORS_MRC', autoCa: '25 009 865', autoEvo: '91,71 %', atCa: '11 164 836', atEvo: '340,96 %', maladieCa: '20 000', maladieEvo: '2,80 %', diversCa: '1 067 309', diversEvo: '67,59 %', totalCa: '37 262 009', totalEvo: '113,47 %' },
                  { key: 'mcma', bu: 'MCMA_DIRECT', autoCa: '15 130 796', autoEvo: '95,76 %', atCa: '410 387', atEvo: '78,97 %', maladieCa: '752 133', maladieEvo: '151,55 %', diversCa: '947 949', diversEvo: '70,53 %', totalCa: '17 241 265', totalEvo: '94,94 %' },
                  { key: 'total', bu: 'Total', autoCa: '62 175 601', autoEvo: '79,08 %', atCa: '11 887 151', atEvo: '188,95 %', maladieCa: '5 807 253', maladieEvo: '74,92 %', diversCa: '6 340 578', diversEvo: '87,13 %', totalCa: '86 210 582', totalEvo: '86,26 %' },
                ]}
                rowClassName={(record) => record.key === 'total' ? 'bg-zinc-100 font-bold' : ''}
              />
            </div>
          )
        }]}
      />
     

      <Collapse
        defaultActiveKey={['1']}
        items={[{
          key: '1',
          label: (
            <span className="text-lg font-semibold text-zinc-900">
              CA Vie du mois de Novembre au 25/11/2025 par branche et par BU
            </span>
          ),
          children: (
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-4">
              <Table
                className="rounded-xl overflow-hidden text-xs"
                pagination={false}
                columns={[
                  {
                    title: 'BU',
                    dataIndex: 'bu',
                    key: 'bu',
                    render: (text, record) =>
                      <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-medium text-blue-900'}>{text}</span>
                  },

                  // --- CAPITALISATION ---
                  {
                    title: 'Capitalisation CA', dataIndex: 'capCa', key: 'capCa', align: 'right',
                    render: (text) => <span className="font-bold text-blue-900">{text}</span>
                  },
                  {
                    title: 'Capitalisation Taux de remplissage',
                    dataIndex: 'capEvo',
                    key: 'capEvo',
                    align: 'right',
                    render: (text) => {
                      const color = getEvolutionColor(text);
                      let style = "px-2 py-1 rounded font-bold ";

                      if (color.includes("red")) style += "bg-red-500 text-white";
                      else if (color.includes("orange")) style += "bg-orange-400 text-white";
                      else if (color.includes("green-500")) style += "bg-green-500 text-white";
                      else if (color.includes("green-700")) style += "bg-green-700 text-white";
                      else style += "bg-gray-100 text-blue-900";

                      return <span className={style}>{text}</span>;
                    }
                  },

                  // --- RETRAITE ---
                  {
                    title: 'Retraite CA', dataIndex: 'retCa', key: 'retCa', align: 'right',
                    render: (text) => <span className="font-bold text-blue-900">{text}</span>
                  },
                  {
                    title: 'Retraite Taux de remplissage',
                    dataIndex: 'retEvo',
                    key: 'retEvo',
                    align: 'right',
                    render: (text) => {
                      const color = getEvolutionColor(text);
                      let style = "px-2 py-1 rounded font-bold ";

                      if (color.includes("red")) style += "bg-red-500 text-white";
                      else if (color.includes("orange")) style += "bg-orange-400 text-white";
                      else if (color.includes("green-500")) style += "bg-green-500 text-white";
                      else if (color.includes("green-700")) style += "bg-green-700 text-white";
                      else style += "bg-gray-100 text-blue-900";

                      return <span className={style}>{text}</span>;
                    }
                  },

                  // --- DECES ---
                  {
                    title: 'Décés CA', dataIndex: 'decesCa', key: 'decesCa', align: 'right',
                    render: (text) => <span className="font-bold text-blue-900">{text}</span>
                  },

                  {
                    title: 'Décés Taux de remplissage',
                    dataIndex: 'decesEvo',
                    key: 'decesEvo',
                    align: 'right',
                    render: (text) => {
                      const color = getEvolutionColor(text);
                      let style = "px-2 py-1 rounded font-bold ";

                      if (color.includes("red")) style += "bg-red-500 text-white";
                      else if (color.includes("orange")) style += "bg-orange-400 text-white";
                      else if (color.includes("green-500")) style += "bg-green-500 text-white";
                      else if (color.includes("green-700")) style += "bg-green-700 text-white";
                      else style += "bg-gray-100 text-blue-900";

                      return <span className={style}>{text}</span>;
                    }
                  },

                  // --- TOTAL ---
                  {
                    title: 'Total CA', dataIndex: 'totalCa', key: 'totalCa', align: 'right',
                    render: (text) => <span className="font-bold text-blue-900">{text}</span>
                  },

                  {
                    title: 'Total Taux de remplissage',
                    dataIndex: 'totalEvo',
                    key: 'totalEvo',
                    align: 'right',
                    render: (text) => {
                      const color = getEvolutionColor(text);
                      let style = "px-2 py-1 rounded font-bold ";

                      if (color.includes("red")) style += "bg-red-500 text-white";
                      else if (color.includes("orange")) style += "bg-orange-400 text-white";
                      else if (color.includes("green-500")) style += "bg-green-500 text-white";
                      else if (color.includes("green-700")) style += "bg-green-700 text-white";
                      else style += "bg-gray-100 text-blue-900";

                      return <span className={style}>{text}</span>;
                    }
                  },
                ]}
                dataSource={[
                  {
                    key: 'mac', bu: 'MAC',
                    capCa: '548 128 521', capEvo: '109,04 %',
                    retCa: '43 476 570', retEvo: '56,40 %',
                    decesCa: '10 162 874', decesEvo: '75,56 %',
                    totalCa: '601 767 965', totalEvo: '101,44 %'
                  },
                  {
                    key: 'mcma', bu: 'MCMA',
                    capCa: '29 608 463', capEvo: '68,42 %',
                    retCa: '1 137 710', retEvo: '30,32 %',
                    decesCa: '13 848 048', decesEvo: '169,72 %',
                    totalCa: '44 594 222', totalEvo: '80,81 %'
                  },
                  {
                    key: 'total', bu: 'Total',
                    capCa: '577 736 985', capEvo: '105,82 %',
                    retCa: '44 614 280', retEvo: '55,19 %',
                    decesCa: '24 010 922', decesEvo: '111,11 %',
                    totalCa: '646 362 187', totalEvo: '99,68 %'
                  },
                ]}
                rowClassName={(record) => record.key === 'total' ? 'bg-zinc-100 font-bold' : ''}
              />
            </div>
          )
        }]}
      />


    </div>
  );
}
export default SyntheseGlobale;

