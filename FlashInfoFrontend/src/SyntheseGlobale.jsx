import React, { useState, useEffect } from "react";
import { Table, Collapse } from "antd";
import { getCaVie, getCaNonVie, getCaNonVieMensuel, getCaVieMensuel, getEmissions500KDHS, getCaNonVieThisMonth, getCaVieThisMonth } from "./Api/FlashInfoApi";

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

// Fonction utilitaire pour déterminer la couleur selon la valeur d'évolution
function getEvolutionColor(value) {
  if (value === "" || value == null) return "";
  
  try {
    // Nettoyer la valeur (ex: "-4,29%" ou "38,15 %")
    let numStr = value.toString().trim();
    
    // Supprimer les espaces et le signe pourcent
    numStr = numStr.replace(/\s+/g, '');
    numStr = numStr.replace('%', '');
    
    // Remplacer la virgule par un point pour le parsing
    numStr = numStr.replace(',', '.');
    
    const num = parseFloat(numStr);
    
    if (isNaN(num)) return "";
    if (num < 0) return "bg-red-500 text-white"; // baisse - texte blanc
    if (num < 5) return "bg-orange-400 text-white"; // <5% - texte blanc
    if (num < 100) return "bg-green-500 text-white"; // >5% - texte blanc
    return "bg-green-700 text-white"; // >100% - texte blanc
  } catch (error) {
    console.error('Erreur dans getEvolutionColor:', error, value);
    return "";
  }
}

function SyntheseGlobale() {
  const [syntheseVieData, setSyntheseVieData] = useState([]);
  const [syntheseNonVieData, setSyntheseNonVieData] = useState([]);
  const [emissions500Data, setEmissions500Data] = useState([]);
  const [caNonVieMensuelData, setCaNonVieMensuelData] = useState([]);
  const [caVieMensuelData, setCaVieMensuelData] = useState([]);
  const [caNonVieThisMonthData, setCaNonVieThisMonthData] = useState([]);
  const [caVieThisMonthData, setCaVieThisMonthData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vieData, nonVieData, emissionsData, nonVieMensuelData, vieMensuelData, caNonVieThisMonth ,caVieThisMonth] = await Promise.all([
          getCaVie(),
          getCaNonVie(),
          getEmissions500KDHS(),
          getCaNonVieMensuel(),
          getCaVieMensuel(),
          getCaNonVieThisMonth(),
          getCaVieThisMonth()
        ]);
        console.log('caVieThisMonth:', caVieThisMonth); 
        setSyntheseVieData(Array.isArray(vieData) ? vieData : []);
        setSyntheseNonVieData(Array.isArray(nonVieData) ? nonVieData : []);
        setEmissions500Data(Array.isArray(emissionsData) ? emissionsData : []);
        setCaNonVieMensuelData(Array.isArray(nonVieMensuelData) ? nonVieMensuelData : []);
        setCaVieMensuelData(Array.isArray(vieMensuelData) ? vieMensuelData : []);
        setCaNonVieThisMonthData(Array.isArray(caNonVieThisMonth) ? caNonVieThisMonth : []);
        setCaVieThisMonthData(Array.isArray(caVieThisMonth) ? caVieThisMonth : []);

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Set empty arrays in case of error to prevent crashes
        setSyntheseVieData([]);
        setSyntheseNonVieData([]);
        setEmissions500Data([]);
        setCaNonVieMensuelData([]);
        setCaVieMensuelData([]);
        setCaNonVieThisMonthData([]);
      } finally {
        setLoading(false);
      }
    };

    // Charger les données immédiatement
    fetchData();

    // Rafraîchir les données toutes les 5 minutes (300000 ms)
    const interval = setInterval(fetchData, 300000);

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(interval);
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
                  { title: `CA du mois de ${getCurrentMonthName()} arrêté au ${getCurrentDate()}`, dataIndex: 'caMoisNov', key: 'caMoisNov', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  { title: `CA du mois de ${getCurrentMonthName()} ${getPreviousYear()}`, dataIndex: 'caMois2024', key: 'caMois2024', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold text-blue-900' : 'font-bold text-blue-900'}>{text}</span> },
                  { title: `Taux de remplissage ${getCurrentYear()} %`, dataIndex: 'tauxRemplissage', key: 'tauxRemplissage', align: 'right', render: (text, record) => <span className={record.key === 'total' ? 'font-bold bg-green-200 text-blue-900 px-2 py-1 rounded' : 'bg-green-300 text-blue-900 px-2 py-1 rounded'}>{text}</span> },
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
            (syntheseNonVieData || []).map((item, idx) => {
              // Utiliser les données du jour (syntheseNonVieData)
              const formatNumber = (num) => {
                if (num === undefined || num === null) return '0';
                // Convertir en nombre si c'est une chaîne
                const value = typeof num === 'string' ? parseFloat(num) : num;
                return Math.round(value).toLocaleString('fr-FR');
              };
              
              return {
                key: item.bu && item.bu.toLowerCase() === 'total' ? 'total' : (item.bu || `row-${idx}`),
                bu: item.bu || '',
                auto: formatNumber(item.auto),
                at: formatNumber(item.at),
                maladie: formatNumber(item.maladie),
                divers: formatNumber(item.divers),
                total: formatNumber(item.total)
              };
            })
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
                  render: (text) => {
                    const colorClass = getEvolutionColor(text);
                    return <span className={`px-2 py-1 rounded font-bold ${colorClass}`}>{text}</span>;
                  }
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
                  render: (text) => {
                    const colorClass = getEvolutionColor(text);
                    return <span className={`px-2 py-1 rounded font-bold ${colorClass}`}>{text}</span>;
                  }
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
                  render: (text) => {
                    const colorClass = getEvolutionColor(text);
                    return <span className={`px-2 py-1 rounded font-bold ${colorClass}`}>{text}</span>;
                  }
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
                { 
                  title: "Taux d'évolution", 
                  dataIndex: 'tauxDivers', 
                  key: 'tauxDivers', 
                  align: 'right', 
                  render: (text) => {
                    const colorClass = getEvolutionColor(text);
                    return <span className={`px-2 py-1 rounded font-bold ${colorClass}`}>{text}</span>;
                  }
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
                  render: (text, record) => 
                    <span className={record.key === 'total' ? 'font-bold bg-blue-100 text-blue-900 px-1 py-0.5 rounded' : 'font-bold bg-blue-50 text-blue-900 px-1 py-0.5 rounded'}>{text}</span> 
                },
                { 
                  title: "Taux d'évolution", 
                  dataIndex: 'tauxTotal', 
                  key: 'tauxTotal', 
                  align: 'right', 
                  render: (text) => {
                    const colorClass = getEvolutionColor(text);
                    return <span className={`px-2 py-1 rounded font-bold ${colorClass}`}>{text}</span>;
                  }
                }
              ]
            }
          ]}
          dataSource={(() => {
            // Helper to format numbers with spaces (French format)
            const format = n => {
              if (!n && n !== 0) return '0';
              const num = typeof n === 'string' ? parseFloat(n.replace(/\s/g, '')) : n;
              return isNaN(num) ? '0' : Math.round(num).toLocaleString('fr-FR').replace(/,/g, ' ');
            };
            
            // Helper to format percent with 2 decimals and %
            const formatPercent = n => {
              if (n === undefined || n === null) return '0,00 %';
              const num = typeof n === 'string' ? parseFloat(n.replace(',', '.')) : n;
              return isNaN(num) ? '0,00 %' : num.toFixed(2).replace('.', ',') + ' %';
            };
            
            // Map API data to table rows
            const rows = (caNonVieThisMonthData || []).map((item, idx) => ({
              key: item.bu?.toLowerCase() || `row-${idx}`,
              bu: item.bu || '',
              auto: format(item.ca_auto_annee_courante),
              tauxAuto: formatPercent(item.taux_auto),
              at: format(item.ca_at_annee_courante),
              tauxAt: formatPercent(item.taux_at),
              maladie: format(item.ca_maladie_annee_courante),
              tauxMaladie: formatPercent(item.taux_maladie),
              divers: format(item.ca_divers_annee_courante),
              tauxDivers: formatPercent(item.taux_divers),
              total: format(item.ca_total_annee_courante),
              tauxTotal: formatPercent(item.taux_total),
            }));
            
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
                  { 
                    title: "Taux d'évolution", 
                    dataIndex: 'tauxCapitalisation', 
                    key: 'tauxCapitalisation', 
                    align: 'right', 
                    render: (text) => {
                      const colorClass = getEvolutionColor(text);
                      return <span className={`px-2 py-1 rounded font-bold ${colorClass}`}>{text}</span>;
                    }
                  }
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
                  { 
                    title: "Taux d'évolution", 
                    dataIndex: 'tauxRetraite', 
                    key: 'tauxRetraite', 
                    align: 'right', 
                    render: (text) => {
                      const colorClass = getEvolutionColor(text);
                      return <span className={`px-2 py-1 rounded font-bold ${colorClass}`}>{text}</span>;
                    }
                  }
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
                  { 
                    title: "Taux d'évolution", 
                    dataIndex: 'tauxDeces', 
                    key: 'tauxDeces', 
                    align: 'right', 
                    render: (text) => {
                      const colorClass = getEvolutionColor(text);
                      return <span className={`px-2 py-1 rounded font-bold ${colorClass}`}>{text}</span>;
                    }
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
                    render: (text, record) => 
                      <span className={record.key === 'total' ? 'font-bold bg-blue-100 text-blue-900 px-1 py-0.5 rounded' : 'font-bold bg-blue-50 text-blue-900 px-1 py-0.5 rounded'}>{text}</span> 
                  },
                  { 
                    title: "Taux d'évolution", 
                    dataIndex: 'tauxTotal', 
                    key: 'tauxTotal', 
                    align: 'right', 
                    render: (text) => {
                      const colorClass = getEvolutionColor(text);
                      return <span className={`px-2 py-1 rounded font-bold ${colorClass}`}>{text}</span>;
                    }
                  }
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

              // Fonction pour formater les nombres (format français avec espaces)
              const formatNumber = (num) => {
                if (num === null || num === undefined) return '0';
                const value = parseFloat(num);
                return isNaN(value) ? '0' : Math.round(value).toLocaleString('fr-FR').replace(/,/g, ' ');
              };

              // Fonction pour formater les pourcentages
              const formatPercentage = (value) => {
                if (value === null || value === undefined) return '0,00 %';
                const num = parseFloat(value);
                return isNaN(num) ? '0,00 %' : num.toFixed(2).replace('.', ',') + ' %';
              };

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
                  tauxCapitalisation: formatPercentage(item.tauxCapitalisation),
                  retraite: formatNumber(item.caRetr),
                  tauxRetraite: formatPercentage(item.tauxRetr),
                  deces: formatNumber(item.caDeces),
                  tauxDeces: formatPercentage(item.tauxDeces),
                  total: formatNumber((parseFloat(item.caCapitalisation || 0) + parseFloat(item.caRetr || 0) + parseFloat(item.caDeces || 0))),
                  tauxTotal: formatPercentage(item.tauxTotal),
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

