import React, { useState, useEffect } from "react";
import { Table, Collapse } from "antd";
import { getAllChiffreAffaires, getCaVie, getCaNonVie, getCaNonVieMensuel, getCaVieMensuel, getEmissions500KDHS, getCaNonVieThisMonth, getCaVieThisMonth, getCaNonVieExercice, getCaVieExercice } from "./Api/FlashInfoApi";
import { formatNumber, formatPercent, EvolutionBadge } from './utils/formatters';
import './styles/table.css';

// Fonctions utilitaires pour les dates
function getCurrentDate() {
  const today = new Date();
  // Soustraire 1 jour pour obtenir J-1
  today.setDate(today.getDate() - 1);
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

function getCurrentMonthName() {
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const today = new Date();
  // Soustraire 1 jour pour obtenir J-1
  today.setDate(today.getDate() - 1);
  return months[today.getMonth()];
}

function getCurrentYear() {
  return new Date().getFullYear();
}

function getPreviousYear() {
  return new Date().getFullYear() - 1;
}

// Fonction pour obtenir le mois précédent et l'année correspondante
function getPreviousMonthNameAndYear() {
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const today = new Date();
  today.setDate(today.getDate() - 1); // Pour gérer le cas J-1
  let month = today.getMonth();
  let year = today.getFullYear();
  if (month === 0) {
    month = 11;
    year = year - 1;
  } else {
    month = month - 1;
  }
  return `${months[month]} ${year}`;
}

// Evolution color logic moved to `src/utils/formatters.js` (getEvolutionClass / EvolutionBadge)

function SyntheseGlobale() {
  const [syntheseVieData, setSyntheseVieData] = useState([]);
  const [syntheseNonVieData, setSyntheseNonVieData] = useState([]);
  const [emissions500Data, setEmissions500Data] = useState([]);
  const [caNonVieMensuelData, setCaNonVieMensuelData] = useState([]);
  const [caVieMensuelData, setCaVieMensuelData] = useState([]);
  const [caNonVieThisMonthData, setCaNonVieThisMonthData] = useState([]);
  const [caVieThisMonthData, setCaVieThisMonthData] = useState([]);
  const [caNonVieExerciceData, setCaNonVieExerciceData] = useState([]);
  const [caVieExerciceData, setCaVieExerciceData] = useState([]);
  const [allChiffreAffairesData, setAllChiffreAffairesData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allCaData, vieData, nonVieData, emissionsData, nonVieMensuelData, vieMensuelData, caNonVieThisMonth, caVieThisMonth, caNonVieExercice, caVieExercice] = await Promise.all([
          getAllChiffreAffaires(),
          getCaVie(),
          getCaNonVie(),
          getEmissions500KDHS(),
          getCaNonVieMensuel(),
          getCaVieMensuel(),
          getCaNonVieThisMonth(),
          getCaVieThisMonth(),
          getCaNonVieExercice(),
          getCaVieExercice()
        ]);
        console.log('caVieThisMonth:', caVieThisMonth);
        console.log('caVieExercice :', caVieExercice);
        console.log('allChiffreAffaires:', allCaData);
        setAllChiffreAffairesData(Array.isArray(allCaData) ? allCaData : []);
        setSyntheseVieData(Array.isArray(vieData) ? vieData : []);
        setSyntheseNonVieData(Array.isArray(nonVieData) ? nonVieData : []);
        setEmissions500Data(Array.isArray(emissionsData) ? emissionsData : []);
        setCaNonVieMensuelData(Array.isArray(nonVieMensuelData) ? nonVieMensuelData : []);
        setCaVieMensuelData(Array.isArray(vieMensuelData) ? vieMensuelData : []);
        setCaNonVieThisMonthData(Array.isArray(caNonVieThisMonth) ? caNonVieThisMonth : []);
        setCaVieThisMonthData(Array.isArray(caVieThisMonth) ? caVieThisMonth : []);
        setCaNonVieExerciceData(Array.isArray(caNonVieExercice) ? caNonVieExercice : []);
        setCaVieExerciceData(Array.isArray(caVieExercice) ? caVieExercice : []);

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Set empty arrays in case of error to prevent crashes
        setSyntheseVieData([]);
        setSyntheseNonVieData([]);
        setEmissions500Data([]);
        setCaNonVieMensuelData([]);
        setCaVieMensuelData([]);
        setCaNonVieThisMonthData([]);
        setCaNonVieExerciceData([]);
        setCaVieExerciceData([]);
      } finally {
        setLoading(false);
      }
    };

    // Charger les données immédiatement
    fetchData();
  }, []);

  // Fonction helper pour parser les nombres formatés
  const parseIntSafe = (str) => {
    if (!str || str === '0') return 0;
    return parseInt(str.replace(/\s/g, ''), 10) || 0;
  };
  const parsePercentToNumber = (v) => {
    if (v == null) return 0;
    if (typeof v === 'number') return v;
    let s = String(v).trim();
    // remove non-breaking spaces and normal spaces
    s = s.replace(/\u00A0/g, '').replace(/\s/g, '');
    // remove percent sign and replace comma by dot
    s = s.replace('%', '').replace(',', '.');
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };

  // Extraire taux de remplissage pour Non Vie / Vie / Total depuis les données reçues
  const _findByKeyOrType = (needleFn) => {
    if (!allChiffreAffairesData || allChiffreAffairesData.length === 0) return null;
    return allChiffreAffairesData.find(item => {
      const key = (item.key || '').toString().toLowerCase();
      const type = (item.type || '').toString().toLowerCase();
      return needleFn(key, type);
    }) || null;
  };

  const nonVieItem = _findByKeyOrType((k, t) => k.includes('non') || t.includes('non'));
  const vieItem = _findByKeyOrType((k, t) => (k.includes('vie') || t.includes('vie')) && !k.includes('non') && !t.includes('non'));
  const totalItem = _findByKeyOrType((k, t) => k === 'total' || t === 'total');

  const nonVieTaux = parsePercentToNumber(nonVieItem?.taux_remplissage ?? nonVieItem?.tauxRemplissage ?? nonVieItem?.taux ?? 0);
  const vieTaux = parsePercentToNumber(vieItem?.taux_remplissage ?? vieItem?.tauxRemplissage ?? vieItem?.taux ?? 0);
  const totalTaux = parsePercentToNumber(totalItem?.taux_remplissage ?? totalItem?.tauxRemplissage ?? totalItem?.taux ?? 0);

  // Transformer les données de l'API en format tableau
  const getTableData = () => {
    if (!syntheseVieData || syntheseVieData.length === 0) {
      return [
        { key: 'mac', bu: 'MAC', capitalisation: '0', retraite: '0', deces: '0', total: '0' },
        { key: 'mcma', bu: 'MCMA', capitalisation: '0', retraite: '0', deces: '0', total: '0' },
        { key: 'total', bu: 'Total', capitalisation: '0', retraite: '0', deces: '0', total: '0' }
      ];
    }

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

      {/* Bloc 1 : CA du jour / CA du mois  */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-4 grid grid-cols-[1fr_420px] gap-6 items-start mx-auto">
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
                  { title: `CA du mois de ${getCurrentMonthName()} arrêté au ${getCurrentDate()}`, dataIndex: 'caMoisActuel', key: 'caMoisActuel', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  { title: `CA du mois de ${getCurrentMonthName()} ${getPreviousYear()}`, dataIndex: 'caMoisAnneePrecedente', key: 'caMoisAnneePrecedente', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  { title: `Taux de remplissage ${getCurrentYear()} %`, dataIndex: 'tauxRemplissage', key: 'tauxRemplissage', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold bg-green-200 text-blue-900 px-2 py-1 rounded' : 'bg-green-300 text-blue-900 px-2 py-1 rounded'}>{text}</span> },
                ]}
                dataSource={(allChiffreAffairesData && allChiffreAffairesData.length > 0) ? allChiffreAffairesData.map((item, idx) => ({
                  key: item.key || `row-${idx}`,
                  type: item.type || item.key || '',
                  caJour: formatNumber(item.ca_du_jour ?? item.caDuJour ?? 0),
                  caMoisActuel: formatNumber(item.ca_mois_actuel ?? item.caMoisActuel ?? 0),
                  caMoisAnneePrecedente: formatNumber(item.ca_mois_annee_precedente ?? item.caMoisAnneePrecedente ?? 0),
                  tauxRemplissage: formatPercent(item.taux_remplissage ?? item.tauxRemplissage ?? 0)
                })) : [
                  { key: 'nonvie', type: 'Non Vie', caJour: formatNumber(0), caMoisActuel: formatNumber(0), caMoisAnneePrecedente: formatNumber(0), tauxRemplissage: formatPercent(0) },
                  { key: 'vie', type: 'Vie', caJour: formatNumber(0), caMoisActuel: formatNumber(0), caMoisAnneePrecedente: formatNumber(0), tauxRemplissage: formatPercent(0) },
                  { key: 'total', type: 'Total', caJour: formatNumber(0), caMoisActuel: formatNumber(0), caMoisAnneePrecedente: formatNumber(0), tauxRemplissage: formatPercent(0) },
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
                  style={{ width: `${Math.max(0, Math.min(nonVieTaux, 160))}%` }}
                >
                  <span className="pr-2">{formatPercent(nonVieTaux)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center text-sm space-x-4">
              <span className="font-medium w-24">Vie</span>
              <div className="flex-1 bg-zinc-200 rounded-full h-4">
                <div
                  className="bg-emerald-500 h-4 rounded-full text-white text-xs flex items-center justify-end pr-2"
                  style={{ width: `${Math.max(0, Math.min(vieTaux, 160))}%` }}
                >
                  <span className="pr-2">{formatPercent(vieTaux)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Légende des couleurs sous les barres */}
          <div className="grid grid-cols-2 gap-6 mt-8 justify-items-center">
            <div className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-1 shadow-sm w-full max-w-[420px]">
              <span className="h-4 w-4 rounded-full bg-red-500 border-2 border-white shadow"></span>
              <span className="text-sm text-gray-700 font-medium">Chiffre d’affaires en baisse</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-1 shadow-sm w-full max-w-[420px]">
              <span className="h-4 w-4 rounded-full bg-orange-400 border-2 border-white shadow"></span>
              <span className="text-sm text-gray-700 font-medium">Croissance inférieure à 5 %</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-1 shadow-sm w-full max-w-[420px]">
              <span className="h-4 w-4 rounded-full bg-green-500 border-2 border-white shadow"></span>
              <span className="text-sm text-gray-700 font-medium">Croissance supérieure à 5 %</span>
            </div>
            <div className="flex items-center gap-2 bg-green-100 rounded-lg px-3 py-1 shadow-sm w-full max-w-[420px]">
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
              CA Non Vie du {getCurrentDate()} par branche et par BU
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
                dataSource={
                  (syntheseNonVieData || []).map((item, idx) => ({
                    key: item.bu && item.bu.toLowerCase() === 'total' ? 'total' : (item.bu || `row-${idx}`),
                    bu: item.bu || '',
                    auto: formatNumber(item.auto),
                    at: formatNumber(item.at),
                    maladie: formatNumber(item.maladie),
                    divers: formatNumber(item.divers),
                    total: formatNumber(item.total)
                  }))
                }
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
                CA Vie du {getCurrentDate()} par branche et par BU
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
                locale={{
                  emptyText: (
                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', color: '#1e40af', fontWeight: '600', marginBottom: '8px' }}>
                        Il n'y a pas d'émissions supérieures à 500K
                      </div>
                      <div style={{ fontSize: '14px', color: '#64748b' }}>
                        Aucune émission n'a dépassé le seuil de 500 000 DHS
                      </div>
                    </div>
                  )
                }}
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
                  primeNette: formatNumber(item.primeNette)
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
              CA Non Vie du mois de {getCurrentMonthName()} au {getCurrentDate()} par branche et par BU
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
                    render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-medium text-blue-900'}>{text}</span>
                  },
                  {
                    title: 'AUTO',
                    children: [
                      {
                        title: 'CA',
                        dataIndex: 'auto',
                        key: 'auto',
                        align: 'right',
                        render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span>
                      },
                      {
                        title: 'Taux de remplissage',
                        dataIndex: 'tauxRemplissageAuto',
                        key: 'tauxRemplissageAuto',
                        align: 'right',
                        render: (text) => <EvolutionBadge value={text} />
                      }
                    ]
                  },
                  {
                    title: 'AT',
                    children: [
                      {
                        title: 'CA',
                        dataIndex: 'at',
                        key: 'at',
                        align: 'right',
                        render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span>
                      },
                      {
                        title: 'Taux de remplissage',
                        dataIndex: 'tauxRemplissageAt',
                        key: 'tauxRemplissageAt',
                        align: 'right',
                        render: (text) => <EvolutionBadge value={text} />
                      }
                    ]
                  },
                  {
                    title: 'MALADIE',
                    children: [
                      {
                        title: 'CA',
                        dataIndex: 'maladie',
                        key: 'maladie',
                        align: 'right',
                        render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span>
                      },
                      {
                        title: 'Taux de remplissage',
                        dataIndex: 'tauxRemplissageMaladie',
                        key: 'tauxRemplissageMaladie',
                        align: 'right',
                        render: (text) => <EvolutionBadge value={text} />
                      }
                    ]
                  },
                  {
                    title: 'DIVERS',
                    children: [
                      {
                        title: 'CA',
                        dataIndex: 'divers',
                        key: 'divers',
                        align: 'right',
                        render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span>
                      },
                      {
                        title: 'Taux de remplissage',
                        dataIndex: 'tauxRemplissageDivers',
                        key: 'tauxRemplissageDivers',
                        align: 'right',
                        render: (text) => <EvolutionBadge value={text} />
                      }
                    ]
                  },
                  {
                    title: 'Total',
                    children: [
                      {
                        title: 'CA',
                        dataIndex: 'total',
                        key: 'total',
                        align: 'right',
                        render: (text, record) => <span className={record.key === 'total' ? 'font-bold bg-blue-100 text-blue-900 px-1 py-0.5 rounded' : 'font-bold bg-blue-50 text-blue-900 px-1 py-0.5 rounded'}>{text}</span>
                      },
                      {
                        title: 'Taux de remplissage',
                        dataIndex: 'tauxRemplissageTotal',
                        key: 'tauxRemplissageTotal',
                        align: 'right',
                        render: (text) => <EvolutionBadge value={text} />
                      }
                    ]
                  }
                ]}
                dataSource={caNonVieMensuelData.map((item, index) => ({
                  key: item.bu?.toLowerCase().replace(/[^a-z0-9]/g, '') || `row-${index}`,
                  bu: item.bu || '',
                  auto: item.auto || '0',
                  tauxRemplissageAuto: item.tauxRemplissageAuto || '0,00 %',
                  at: item.at || '0',
                  tauxRemplissageAt: item.tauxRemplissageAt || '0,00 %',
                  maladie: item.maladie || '0',
                  tauxRemplissageMaladie: item.tauxRemplissageMaladie || '0,00 %',
                  divers: item.divers || '0',
                  tauxRemplissageDivers: item.tauxRemplissageDivers || '0,00 %',
                  total: item.total || '0',
                  tauxRemplissageTotal: item.tauxRemplissageTotal || '0,00 %'
                }))}
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
              CA Vie du mois de {getCurrentMonthName()} au {getCurrentDate()} par branche et par BU
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
                    dataIndex: 'capEvo', key: 'capEvo', align: 'right', render: (text) => <EvolutionBadge value={text} />
                  },

                  // --- RETRAITE ---
                  {
                    title: 'Retraite CA', dataIndex: 'retCa', key: 'retCa', align: 'right',
                    render: (text) => <span className="font-bold text-blue-900">{text}</span>
                  },
                  { title: 'Retraite Taux de remplissage', dataIndex: 'retEvo', key: 'retEvo', align: 'right', render: (text) => <EvolutionBadge value={text} /> },

                  // --- DECES ---
                  {
                    title: 'Décés CA', dataIndex: 'decesCa', key: 'decesCa', align: 'right',
                    render: (text) => <span className="font-bold text-blue-900">{text}</span>
                  },

                  { title: 'Décés Taux de remplissage', dataIndex: 'decesEvo', key: 'decesEvo', align: 'right', render: (text) => <EvolutionBadge value={text} /> },

                  // --- TOTAL ---
                  {
                    title: 'Total CA', dataIndex: 'totalCa', key: 'totalCa', align: 'right',
                    render: (text, record) => <span className={record.key === 'total' ? 'font-bold bg-blue-100 text-blue-900 px-1 py-0.5 rounded' : 'font-bold bg-blue-50 text-blue-900 px-1 py-0.5 rounded'}>{text}</span>
                  },

                  { title: 'Total Taux de remplissage', dataIndex: 'totalEvo', key: 'totalEvo', align: 'right', render: (text) => <EvolutionBadge value={text} /> },
                ]}
                dataSource={caVieMensuelData.map((item, index) => ({
                  key: item.mutuelle?.toLowerCase() || `row-${index}`,
                  bu: item.mutuelle || '',
                  capCa: item.capitalisation || '0',
                  capEvo: item.tauxRemplissageCapitalisation || '0,00 %',
                  retCa: item.retraite || '0',
                  retEvo: item.tauxRemplissageRetraite || '0,00 %',
                  decesCa: item.deces || '0',
                  decesEvo: item.tauxRemplissageDeces || '0,00 %',
                  totalCa: item.total || '0',
                  totalEvo: item.tauxRemplissageTotal || '0,00 %'
                }))}
                rowClassName={(record) => record.key === 'total' ? 'bg-zinc-100 font-bold' : ''}
              />
            </div>
          )
        }]}
      />


      {/* CA Non Vie de l'exercice */}
      <Collapse
        defaultActiveKey={['1']}
        items={[{
          key: '1',
          label: (
            <span className="text-lg font-semibold text-zinc-900">
              CA Non Vie de l'exercice {getCurrentYear()} au {getCurrentDate()} par branche et par BU
            </span>
          ),
          children: (
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-4">
              <Table
                className="rounded-xl overflow-hidden text-xs"
                pagination={false}
                columns={[
                  { title: 'BU', dataIndex: 'bu', key: 'bu', align: 'left', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-medium text-blue-900'}>{text}</span> },
                  {
                    title: 'AUTO', children: [
                      { title: `CA ${getCurrentYear()}`, dataIndex: 'autoCourante', key: 'autoCourante', align: 'right', render: (text) => <span className='font-bold text-blue-900'>{text}</span> },
                      { title: `CA ${getPreviousYear()}`, dataIndex: 'autoPrecedente', key: 'autoPrecedente', align: 'right', render: (text) => <span className='font-bold text-blue-900'>{text}</span> },
                      { title: 'Taux', dataIndex: 'autoTaux', key: 'autoTaux', align: 'right', render: (text) => <EvolutionBadge value={text} /> }
                    ]
                  },
                  {
                    title: 'AT', children: [
                      { title: `CA ${getCurrentYear()}`, dataIndex: 'atCourante', key: 'atCourante', align: 'right', render: (text) => <span className='font-bold text-blue-900'>{text}</span> },
                      { title: `CA ${getPreviousYear()}`, dataIndex: 'atPrecedente', key: 'atPrecedente', align: 'right', render: (text) => <span className='font-bold text-blue-900'>{text}</span> },
                      { title: 'Taux', dataIndex: 'atTaux', key: 'atTaux', align: 'right', render: (text) => <EvolutionBadge value={text} /> }
                    ]
                  },
                  {
                    title: 'MALADIE', children: [
                      { title: `CA ${getCurrentYear()}`, dataIndex: 'maladieCourante', key: 'maladieCourante', align: 'right', render: (text) => <span className='font-bold text-blue-900'>{text}</span> },
                      { title: `CA ${getPreviousYear()}`, dataIndex: 'maladiePrecedente', key: 'maladiePrecedente', align: 'right', render: (text) => <span className='font-bold text-blue-900'>{text}</span> },
                      { title: 'Taux', dataIndex: 'maladieTaux', key: 'maladieTaux', align: 'right', render: (text) => <EvolutionBadge value={text} /> }
                    ]
                  },
                  {
                    title: 'DIVERS', children: [
                      { title: `CA ${getCurrentYear()}`, dataIndex: 'diversCourante', key: 'diversCourante', align: 'right', render: (text) => <span className='font-bold text-blue-900'>{text}</span> },
                      { title: `CA ${getPreviousYear()}`, dataIndex: 'diversPrecedente', key: 'diversPrecedente', align: 'right', render: (text) => <span className='font-bold text-blue-900'>{text}</span> },
                      { title: 'Taux', dataIndex: 'diversTaux', key: 'diversTaux', align: 'right', render: (text) => <EvolutionBadge value={text} /> }
                    ]
                  },
                  {
                    title: 'Total', children: [
                      { title: `CA ${getCurrentYear()}`, dataIndex: 'totalCourante', key: 'totalCourante', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold bg-blue-100 text-blue-900 px-1 py-0.5 rounded' : 'font-bold bg-blue-50 text-blue-900 px-1 py-0.5 rounded'}>{text}</span> },
                      { title: `CA ${getPreviousYear()}`, dataIndex: 'totalPrecedente', key: 'totalPrecedente', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold bg-blue-100 text-blue-900 px-1 py-0.5 rounded' : 'font-bold bg-blue-50 text-blue-900 px-1 py-0.5 rounded'}>{text}</span> },
                      { title: 'Taux', dataIndex: 'totalTaux', key: 'totalTaux', align: 'right', render: (text) => <EvolutionBadge value={text} /> }
                    ]
                  }
                ]}
                dataSource={(caNonVieExerciceData || []).map((item, idx) => ({
                  key: item.bu?.toLowerCase() || `row-${idx}`,
                  bu: item.bu || '',
                  // Prefer formatted fields from backend when available, fallback to formatting numbers here
                  autoCourante: item.formattedCaAutoAnneeCourante || formatNumber(item.caAutoAnneeCourante || 0),
                  autoPrecedente: item.formattedCaAutoAnneePrecedente || formatNumber(item.caAutoAnneePrecedente || 0),
                  autoTaux: formatPercent(item.tauxAuto ?? 0),
                  atCourante: item.formattedCaAtAnneeCourante || formatNumber(item.caAtAnneeCourante || 0),
                  atPrecedente: item.formattedCaAtAnneePrecedente || formatNumber(item.caAtAnneePrecedente || 0),
                  atTaux: formatPercent(item.tauxAt ?? 0),
                  maladieCourante: item.formattedCaMaladieAnneeCourante || formatNumber(item.caMaladieAnneeCourante || 0),
                  maladiePrecedente: item.formattedCaMaladieAnneePrecedente || formatNumber(item.caMaladieAnneePrecedente || 0),
                  maladieTaux: formatPercent(item.tauxMaladie ?? 0),
                  diversCourante: item.formattedCaDiversAnneeCourante || formatNumber(item.caDiversAnneeCourante || 0),
                  diversPrecedente: item.formattedCaDiversAnneePrecedente || formatNumber(item.caDiversAnneePrecedente || 0),
                  diversTaux: formatPercent(item.tauxDivers ?? 0),
                  totalCourante: item.formattedCaTotalAnneeCourante || formatNumber(item.caTotalAnneeCourante || 0),
                  totalPrecedente: item.formattedCaTotalAnneePrecedente || formatNumber(item.caTotalAnneePrecedente || 0),
                  totalTaux: formatPercent(item.tauxTotal ?? 0),
                }))}
                rowClassName={(record) => record.key === 'total' ? 'bg-zinc-100 font-bold' : ''}
                scroll={{ x: 1500 }}
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
              CA Vie de l'exercice {getCurrentYear()} au {getCurrentDate()} par branche et par BU
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
                    dataIndex: 'segment',
                    key: 'segment',
                    align: 'left',
                    render: (text, record) =>
                      <span className={record.segment === 'TOTAL' ? 'font-bold text-blue-900' : 'font-medium text-blue-900'}>
                        {text}
                      </span>
                  },
                  {
                    title: 'Capitalisation',
                    children: [
                      {
                        title: `CA ${getCurrentYear()}`,
                        dataIndex: 'formattedCapCaCourante',
                        key: 'capCaCourante',
                        align: 'right',
                        render: (text) => <span className='font-bold text-blue-900'>{text}</span>
                      },
                      {
                        title: `CA ${getPreviousYear()}`,
                        dataIndex: 'formattedCapCaPrecedente',
                        key: 'capCaPrecedente',
                        align: 'right',
                        render: (text) => <span className='font-bold text-blue-900'>{text}</span>
                      },
                      {
                        title: 'Taux',
                        dataIndex: 'capTaux',
                        key: 'capTaux',
                        align: 'right',
                        render: (text) => <EvolutionBadge value={text} />
                      }
                    ]
                  },
                  {
                    title: 'Retraite',
                    children: [
                      {
                        title: `CA ${getCurrentYear()}`,
                        dataIndex: 'formattedRetCaCourante',
                        key: 'retCaCourante',
                        align: 'right',
                        render: (text) => <span className='font-bold text-blue-900'>{text}</span>
                      },
                      {
                        title: `CA ${getPreviousYear()}`,
                        dataIndex: 'formattedRetCaPrecedente',
                        key: 'retCaPrecedente',
                        align: 'right',
                        render: (text) => <span className='font-bold text-blue-900'>{text}</span>
                      },
                      {
                        title: 'Taux',
                        dataIndex: 'retTaux',
                        key: 'retTaux',
                        align: 'right',
                        render: (text) => <EvolutionBadge value={text} />
                      }
                    ]
                  },
                  {
                    title: 'Décès',
                    children: [
                      {
                        title: `CA ${getCurrentYear()}`,
                        dataIndex: 'formattedDecCaCourante',
                        key: 'decCaCourante',
                        align: 'right',
                        render: (text) => <span className='font-bold text-blue-900'>{text}</span>
                      },
                      {
                        title: `CA ${getPreviousYear()}`,
                        dataIndex: 'formattedDecCaPrecedente',
                        key: 'decCaPrecedente',
                        align: 'right',
                        render: (text) => <span className='font-bold text-blue-900'>{text}</span>
                      },
                      {
                        title: 'Taux',
                        dataIndex: 'decTaux',
                        key: 'decTaux',
                        align: 'right',
                        render: (text) => <EvolutionBadge value={text} />
                      }
                    ]
                  },
                  {
                    title: 'Total',
                    children: [
                      {
                        title: `CA ${getCurrentYear()}`,
                        dataIndex: 'formattedTotalCaCourante',
                        key: 'totalCaCourante',
                        align: 'right',
                        render: (text, record) =>
                          <span className={record.segment === 'TOTAL' ?
                            'font-bold bg-blue-100 text-blue-900 px-1 py-0.5 rounded' :
                            'font-bold bg-blue-50 text-blue-900 px-1 py-0.5 rounded'
                          }>
                            {text}
                          </span>
                      },
                      {
                        title: `CA ${getPreviousYear()}`,
                        dataIndex: 'formattedTotalCaPrecedente',
                        key: 'totalCaPrecedente',
                        align: 'right',
                        render: (text, record) =>
                          <span className={record.segment === 'TOTAL' ?
                            'font-bold bg-blue-100 text-blue-900 px-1 py-0.5 rounded' :
                            'font-bold bg-blue-50 text-blue-900 px-1 py-0.5 rounded'
                          }>
                            {text}
                          </span>
                      },
                      {
                        title: 'Taux',
                        dataIndex: 'totalTaux',
                        key: 'totalTaux',
                        align: 'right',
                        render: (text) => <EvolutionBadge value={text} />
                      }
                    ]
                  }
                ]}
                dataSource={(caVieExerciceData || []).map((item) => {
                  // Formatage des données
                  const formattedItem = {
                    key: item.segment?.toLowerCase() || '',
                    segment: item.segment || '',
                    // Formatage pour l'affichage
                    formattedCapCaCourante: formatNumber(item.capCaCourante),
                    formattedCapCaPrecedente: formatNumber(item.capCaPrecedente),
                    capTaux: `${(item.capTaux || 0).toFixed(2).replace('.', ',')} %`,

                    formattedRetCaCourante: formatNumber(item.retCaCourante),
                    formattedRetCaPrecedente: formatNumber(item.retCaPrecedente),
                    retTaux: `${(item.retTaux || 0).toFixed(2).replace('.', ',')} %`,

                    formattedDecCaCourante: formatNumber(item.decCaCourante),
                    formattedDecCaPrecedente: formatNumber(item.decCaPrecedente),
                    decTaux: `${(item.decTaux || 0).toFixed(2).replace('.', ',')} %`,

                    formattedTotalCaCourante: formatNumber(item.totalCaCourante ||
                      (item.capCaCourante || 0) + (item.retCaCourante || 0) + (item.decCaCourante || 0)
                    ),
                    formattedTotalCaPrecedente: formatNumber(item.totalCaPrecedente ||
                      (item.capCaPrecedente || 0) + (item.retCaPrecedente || 0) + (item.decCaPrecedente || 0)
                    ),
                    totalTaux: `${(item.totalTaux || 0).toFixed(2).replace('.', ',')} %`,
                  };

                  return formattedItem;
                })}
                rowClassName={(record) => record.segment === 'TOTAL' ? 'bg-zinc-100 font-bold' : ''}
                scroll={{ x: 1500 }}
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
              CA Non Vie à fin de {getPreviousMonthNameAndYear()} par branche et par BU
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
                    align: 'left',
                    render: (text, record) =>
                      <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-medium text-blue-900'}>{text}</span>
                  },
                  {
                    title: 'AUTO',
                    children: [
                      {
                        title: 'CA',
                        dataIndex: 'auto',
                        key: 'auto',
                        align: 'right',
                        render: (text, record) =>
                          <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span>
                      },
                      {
                        title: "Taux d'évolution",
                        dataIndex: 'tauxAuto',
                        key: 'tauxAuto',
                        align: 'right',
                        render: (text) => <EvolutionBadge value={text} />
                      }
                    ]
                  },
                  {
                    title: 'AT',
                    children: [
                      {
                        title: 'CA',
                        dataIndex: 'at',
                        key: 'at',
                        align: 'right',
                        render: (text, record) =>
                          <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span>
                      },
                      {
                        title: "Taux d'évolution",
                        dataIndex: 'tauxAt',
                        key: 'tauxAt',
                        align: 'right',
                        render: (text) => <EvolutionBadge value={text} />
                      }
                    ]
                  },
                  {
                    title: 'MALADIE',
                    children: [
                      {
                        title: 'CA',
                        dataIndex: 'maladie',
                        key: 'maladie',
                        align: 'right',
                        render: (text, record) =>
                          <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span>
                      },
                      {
                        title: "Taux d'évolution",
                        dataIndex: 'tauxMaladie',
                        key: 'tauxMaladie',
                        align: 'right',
                        render: (text) => <EvolutionBadge value={text} />
                      }
                    ]
                  },
                  {
                    title: 'DIVERS',
                    children: [
                      {
                        title: 'CA',
                        dataIndex: 'divers',
                        key: 'divers',
                        align: 'right',
                        render: (text, record) =>
                          <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span>
                      },
                      { title: "Taux d'évolution", dataIndex: 'tauxDivers', key: 'tauxDivers', align: 'right', render: (text) => <EvolutionBadge value={text} /> }
                    ]
                  },
                  {
                    title: 'Total',
                    children: [
                      {
                        title: 'CA',
                        dataIndex: 'total',
                        key: 'total',
                        align: 'right',
                        render: (text, record) =>
                          <span className={record.key === 'total' ? 'font-bold bg-blue-100 text-blue-900 px-1 py-0.5 rounded' : 'font-bold bg-blue-50 text-blue-900 px-1 py-0.5 rounded'}>{text}</span>
                      },
                      { title: "Taux d'évolution", dataIndex: 'tauxTotal', key: 'tauxTotal', align: 'right', render: (text) => <EvolutionBadge value={text} /> }
                    ]
                  }
                ]}
                dataSource={(caNonVieThisMonthData || []).map((item, idx) => ({
                  key: item.bu?.toLowerCase() || `row-${idx}`,
                  bu: item.bu || '',
                  auto: formatNumber(item.ca_auto_annee_courante),
                  tauxAuto: formatPercent(item.taux_auto),
                  at: formatNumber(item.ca_at_annee_courante),
                  tauxAt: formatPercent(item.taux_at),
                  maladie: formatNumber(item.ca_maladie_annee_courante),
                  tauxMaladie: formatPercent(item.taux_maladie),
                  divers: formatNumber(item.ca_divers_annee_courante),
                  tauxDivers: formatPercent(item.taux_divers),
                  total: formatNumber(item.ca_total_annee_courante),
                  tauxTotal: formatPercent(item.taux_total),
                }))}
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
              CA Vie à fin de {getPreviousMonthNameAndYear()} par branche et par BU

            </span>
          ),
          children: (
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-4">
              {caVieThisMonthData && caVieThisMonthData.length > 0 ? (
                <Table
                  className="rounded-xl overflow-hidden text-xs"
                  pagination={false}
                  columns={[
                    {
                      title: 'BU',
                      dataIndex: 'bu',
                      key: 'bu',
                      align: 'left',
                      render: (text, record) =>
                        <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-medium text-blue-900'}>{text}</span>
                    },
                    {
                      title: 'Capitalisation',
                      children: [
                        {
                          title: 'CA',
                          dataIndex: 'capitalisation',
                          key: 'capitalisation',
                          align: 'right',
                          render: (text) => <span className="font-bold text-blue-900">{text}</span>
                        },
                        { title: "Taux d'évolution", dataIndex: 'tauxCapitalisation', key: 'tauxCapitalisation', align: 'right', render: (text) => <EvolutionBadge value={text} /> }
                      ]
                    },
                    {
                      title: 'Retraite',
                      children: [
                        {
                          title: 'CA',
                          dataIndex: 'retraite',
                          key: 'retraite',
                          align: 'right',
                          render: (text) => <span className="font-bold text-blue-900">{text}</span>
                        },
                        { title: "Taux d'évolution", dataIndex: 'tauxRetraite', key: 'tauxRetraite', align: 'right', render: (text) => <EvolutionBadge value={text} /> }
                      ]
                    },
                    {
                      title: 'Décès',
                      children: [
                        {
                          title: 'CA',
                          dataIndex: 'deces',
                          key: 'deces',
                          align: 'right',
                          render: (text) => <span className="font-bold text-blue-900">{text}</span>
                        },
                        { title: "Taux d'évolution", dataIndex: 'tauxDeces', key: 'tauxDeces', align: 'right', render: (text) => <EvolutionBadge value={text} /> }
                      ]
                    },
                    {
                      title: 'Total',
                      children: [
                        {
                          title: 'CA',
                          dataIndex: 'total',
                          key: 'total',
                          align: 'right',
                          render: (text, record) =>
                            <span className={record.key === 'total' ? 'font-bold bg-blue-100 text-blue-900 px-1 py-0.5 rounded' : 'font-bold bg-blue-50 text-blue-900 px-1 py-0.5 rounded'}>{text}</span>
                        },
                        { title: "Taux d'évolution", dataIndex: 'tauxTotal', key: 'tauxTotal', align: 'right', render: (text) => <EvolutionBadge value={text} /> }
                      ]
                    }
                  ]}
                  dataSource={(() => {
                    // Log pour déboguer
                    console.log('Données de l\'API caVieThisMonthData:', caVieThisMonthData);

                    if (!caVieThisMonthData || caVieThisMonthData.length === 0) {
                      console.log('Aucune donnée API disponible');
                      return [];
                    }

                    // Use shared formatNumber/formatPercent utilities

                    // Calculer les totaux
                    let totalCapitalisation = 0;
                    let totalRetraite = 0;
                    let totalDeces = 0;
                    let totalGeneral = 0;

                    // D'abord, calculer les totaux
                    caVieThisMonthData.forEach(item => {
                      if (item.bu !== 'TOTAL') {
                        totalCapitalisation += parseFloat(item.caCapitalisation || 0);
                        totalRetraite += parseFloat(item.caRetr || 0);
                        totalDeces += parseFloat(item.caDeces || 0);
                      }
                    });

                    totalGeneral = totalCapitalisation + totalRetraite + totalDeces;

                    // Calculer les taux moyens pondérés
                    const tauxMoyenCapitalisation = caVieThisMonthData.length > 0
                      ? caVieThisMonthData.reduce((sum, item) => sum + parseFloat(item.tauxCapitalisation || 0), 0) / caVieThisMonthData.length
                      : 0;

                    const tauxMoyenRetraite = caVieThisMonthData.length > 0
                      ? caVieThisMonthData.reduce((sum, item) => sum + parseFloat(item.tauxRetr || 0), 0) / caVieThisMonthData.length
                      : 0;

                    const tauxMoyenDeces = caVieThisMonthData.length > 0
                      ? caVieThisMonthData.reduce((sum, item) => sum + parseFloat(item.tauxDeces || 0), 0) / caVieThisMonthData.length
                      : 0;

                    const tauxMoyenTotal = caVieThisMonthData.length > 0
                      ? caVieThisMonthData.reduce((sum, item) => sum + parseFloat(item.tauxTotal || 0), 0) / caVieThisMonthData.length
                      : 0;

                    // Créer les lignes du tableau
                    const rows = caVieThisMonthData
                      .filter(item => item.bu && item.bu !== 'TOTAL') // Exclure le total s'il existe déjà dans l'API
                      .map((item, index) => ({
                        key: item.bu?.toLowerCase() || `row-${index}`,
                        bu: item.bu || '',
                        capitalisation: formatNumber(item.caCapitalisation),
                        tauxCapitalisation: formatPercent(item.tauxCapitalisation),
                        retraite: formatNumber(item.caRetr),
                        tauxRetraite: formatPercent(item.tauxRetr),
                        deces: formatNumber(item.caDeces),
                        tauxDeces: formatPercent(item.tauxDeces),
                        total: formatNumber((parseFloat(item.caCapitalisation || 0) + parseFloat(item.caRetr || 0) + parseFloat(item.caDeces || 0))),
                        tauxTotal: formatPercent(item.tauxTotal),
                      }));

                    console.log('Données formatées pour le tableau:', rows);
                    return rows;
                  })()}
                  rowClassName={(record) => record.key === 'total' ? 'bg-zinc-100 font-bold' : ''}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="text-lg text-blue-900 font-semibold mb-2">
                    Chargement des données...
                  </div>
                  <div className="text-sm text-gray-600">
                    Les données du CA Vie sont en cours de chargement.
                  </div>
                </div>
              )}
            </div>
          )
        }]}
      />


    </div>
  );
}
export default SyntheseGlobale;


