import React from "react";
import { Table, Card } from "antd";
import { useState, useEffect } from "react";
import { getAllChiffreAffaires } from "./Api/FlashInfoApi";

// Fonction utilitaire pour déterminer le style selon la valeur d'évolution
function getEvolutionStyle(value) {
	if (!value) return { fontWeight: 700, borderRadius: 6, padding: '2px 8px', whiteSpace: 'nowrap' };
	
	// Nettoyer la valeur : enlever le % et remplacer la virgule par un point
	const cleanValue = value.toString().replace('%', '').replace(',', '.').trim();
	const num = parseFloat(cleanValue);
	
	if (isNaN(num)) return { fontWeight: 700, borderRadius: 6, padding: '2px 8px', whiteSpace: 'nowrap' };
	
	// Rouge : Chiffre d'affaires en baisse (valeurs négatives)
	if (num < 0) {
		return { 
			background: '#ef4444', 
			color: '#fff', 
			fontWeight: 700, 
			borderRadius: 6, 
			padding: '2px 8px', 
			whiteSpace: 'nowrap' 
		};
	}
	
	// Orange : Croissance inférieure à 5%
	if (num < 5) {
		return { 
			background: '#fb923c', 
			color: '#fff', 
			fontWeight: 700, 
			borderRadius: 6, 
			padding: '2px 8px', 
			whiteSpace: 'nowrap' 
		};
	}
	
	// Vert : Croissance supérieure à 100%
	if (num >= 100) {
		return { 
			background: '#15803d', 
			color: '#fff', 
			fontWeight: 700, 
			borderRadius: 6, 
			padding: '2px 8px', 
			whiteSpace: 'nowrap' 
		};
	}
	
	// Vert foncé : Croissance supérieure à 5% (mais inférieure à 100%)
	return { 
		background: '#22c55e', 
		color: '#fff', 
		fontWeight: 700, 
		borderRadius: 6, 
		padding: '2px 8px', 
		whiteSpace: 'nowrap' 
	};
}


export default function FlashInfo() {
		const [selectedCard, setSelectedCard] = useState(null);
		const [data, setData] = useState([]);
		const [loading, setLoading] = useState(true);
		const [error, setError] = useState(null);

		// Chargement des données depuis le backend
		useEffect(() => {
			const fetchData = async () => {
				try {
					setLoading(true);
					const result = await getAllChiffreAffaires();
					setData(result);
					setError(null);
				} catch (err) {
					console.error('Erreur lors du chargement des données:', err);
					setError(err.message);
					setData([]); // Pas de données de fallback, utiliser seulement la base de données
				} finally {
					setLoading(false);
				}
			};

			fetchData();
		}, []);



		// Colonnes pour le tableau combiné
		const combinedColumns = [
			{ title: '', dataIndex: 'type', key: 'type', width: 100, render: (text, record) => <span style={{fontWeight:700, color:'#1e3a8a'}}>{record.type}</span> },
			{ title: "CA du 07/12/2025", dataIndex: "ca_25_11_2025", width: 140, align: 'right', render: (text, record) => <span style={{fontWeight:700, color:'#1e3a8a', whiteSpace: 'nowrap'}}>{record.ca_25_11_2025 ? record.ca_25_11_2025 : ''}</span> },
			{ title: "CA du mois de Décembre arrêté au 07/12/2025", dataIndex: "ca_nov_2025", width: 200, align: 'right', render: (text) => <span style={{fontWeight:700, color:'#1e3a8a', whiteSpace: 'nowrap'}}>{text}</span> },
			{ title: "CA du mois de Décembre 2024", dataIndex: "ca_nov_2024", width: 160, align: 'right', render: (text) => <span style={{fontWeight:700, color:'#1e3a8a', whiteSpace: 'nowrap'}}>{text}</span> },
			{ title: "Taux de remplissage 2025 %", dataIndex: "taux_remplissage", width: 140, align: 'right', render: (text) => <span style={getEvolutionStyle(text)}>{text}</span> },
			{ title: "Year to Date (C.A)", dataIndex: "ytd_ca", width: 180, align: 'right', render: (text) => <span style={{fontWeight:700, color:'#1e3a8a', whiteSpace: 'nowrap', display: 'block'}}>{text}</span> },
			{ title: "Year to Date (Évolution %)", dataIndex: "ytd_evolution", width: 160, align: 'right', render: (text) => <span style={getEvolutionStyle(text)}>{text}</span> },
			{ title: "CA du mois de nov. 2025", dataIndex: "ca_oct_2025", width: 160, align: 'right', render: (text) => <span style={{fontWeight:700, color:'#1e3a8a', whiteSpace: 'nowrap'}}>{text}</span> },
			{ title: "Évolution % du mois de nov. 2025", dataIndex: "evolution_oct_2025", width: 180, align: 'right', render: (text) => <span style={getEvolutionStyle(text)}>{text}</span> },
		];

		// Les données sont maintenant chargées depuis le backend via useEffect
		// Fonction pour trouver une donnée par type
		const findDataByKey = (key) => data.find(item => item.key === key);
		
		const nonVieData = findDataByKey('non-vie');
		const vieData = findDataByKey('vie');
		const totalData = findDataByKey('total');

		// Fonction utilitaire pour filtrer les données selon la card sélectionnée
		function getFilteredData() {
			if (selectedCard === 'non-vie') return nonVieData ? [nonVieData] : [];
			if (selectedCard === 'vie') return vieData ? [vieData] : [];
			if (selectedCard === 'total') return data; // Affiche toutes les données
			return [];
		}

		return (
			<div style={{ background: '#f8fafc', minHeight: '100vh', padding: 32 }}>
				{/* Header */}
				<div style={{ textAlign: 'center', marginBottom: 16 }}>
					<div style={{ fontSize: 28, fontWeight: 700, color: '#1677ff', marginBottom: 8 }}>Flash Info</div>
					<div style={{ fontSize: 18, color: '#64748b', marginBottom: 8 }}>Résumé du chiffre d'affaires global au 25/11/2025</div>
					<div style={{ height: 2, background: 'linear-gradient(90deg, #1677ff 0%, #f472b6 100%)', margin: '0 auto 24px', width: 320 }} />
				</div>

				{/* Légende des couleurs */}
				<div style={{ 
					background: '#ffffff', 
					border: '1px solid #e5e7eb', 
					borderRadius: '12px', 
					padding: '16px', 
					margin: '0 auto 24px', 
					maxWidth: '800px',
					boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
				}}>
					
					<div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<span style={{ 
								background: '#ef4444', 
								width: '16px',
								height: '16px',
								borderRadius: '50%',
								display: 'inline-block'
							}}></span>
							<span style={{ fontSize: 14, color: '#121212ff' }}>Chiffre d'affaires en baisse</span>
						</div>
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<span style={{ 
								background: '#fb923c', 
								width: '16px',
								height: '16px',
								borderRadius: '50%',
								display: 'inline-block'
							}}></span>
							<span style={{ fontSize: 14, color: '#121212ff' }}>Croissance inférieure à 5%</span>
						</div>
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<span style={{ 
								background: '#22c55e', 
								width: '16px',
								height: '16px',
								borderRadius: '50%',
								display: 'inline-block'
							}}></span>
							<span style={{ fontSize: 14, color: '#121212ff' }}>Croissance supérieure à 5%</span>
						</div>
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<span style={{ 
								background: '#15803d', 
								width: '16px',
								height: '16px',
								borderRadius: '50%',
								display: 'inline-block'
							}}></span>
							<span style={{ fontSize: 14, color: '#121212ff' }}>Croissance supérieure à 100%</span>
						</div>
					</div>
				</div>

				{/* Cards */}
				<div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
					{/* Non Vie Card */}
					<Card
						styles={{ body: { padding: 24, background: '#fff', cursor: 'pointer' }, header: { background: '#f1f5f9', borderRadius: '12px 12px 0 0', padding: 0 } }}
						style={{ borderRadius: 12, boxShadow: '0 2px 8px #e5e7eb', border: '1px solid #e5e7eb', minWidth: 260, maxWidth: 320, flex: 1 }}
						title={
							<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
								<span style={{ fontSize: 22, color: '#1677ff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
									<span role="img" aria-label="shield">🛡️</span> Non Vie
								</span>
								<span style={{ fontSize: 14, color: '#64748b', fontWeight: 500, textAlign: 'center', width: '100%' }}>Assurance Générale</span>
							</div>
						}
						onClick={() => setSelectedCard(selectedCard === 'non-vie' ? null : 'non-vie')}
					>
					<div style={{ marginBottom: 16 }}>
						<div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>CA au 25/11/2025</div>
						<div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
							{loading ? 'Chargement...' : (nonVieData?.ca_25_11_2025 || '0,00')}
						</div>
					</div>
					<div style={{ marginBottom: 16 }}>
						<div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>CA Cumulé à ce jour</div>
						<div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
							{loading ? 'Chargement...' : (nonVieData?.ytd_ca || '0,00')}
						</div>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Croissance Cumulée</div>
						<div style={{ fontSize: 18, fontWeight: 700, color: '#059669' }}>
							{loading ? 'Chargement...' : (nonVieData?.ytd_evolution || '0 %')}
						</div>
						<span style={{ color: '#059669', fontSize: 20 }}>📈</span>
					</div>
					</Card>

					{/* Vie Card */}
					<Card
						styles={{ body: { padding: 24, background: '#fff', cursor: 'pointer' }, header: { background: '#f1f5f9', borderRadius: '12px 12px 0 0', padding: 0 } }}
						style={{ borderRadius: 12, boxShadow: '0 2px 8px #e5e7eb', border: '1px solid #e5e7eb', minWidth: 260, maxWidth: 320, flex: 1 }}
						title={
							<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
								<span style={{ fontSize: 22, color: '#1677ff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
									<span role="img" aria-label="heart">💙</span> Vie
								</span>
								<span style={{ fontSize: 14, color: '#64748b', fontWeight: 500, textAlign: 'center', width: '100%' }}>Assurance Vie</span>
							</div>
						}
						onClick={() => setSelectedCard(selectedCard === 'vie' ? null : 'vie')}
					>
				<div style={{ marginBottom: 16 }}>
					<div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>CA au 25/11/2025</div>
					<div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
						{loading ? 'Chargement...' : (vieData?.ca_25_11_2025 || '0,00')}
					</div>
				</div>
				<div style={{ marginBottom: 16 }}>
					<div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>CA Cumulé à ce jour</div>
					<div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
						{loading ? 'Chargement...' : (vieData?.ytd_ca || '0,00')}
					</div>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Croissance Cumulée</div>
					<div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
						{loading ? 'Chargement...' : (vieData?.ytd_evolution || '0 %')}
					</div>
					<span style={{ color: '#059669', fontSize: 20 }}>📈</span>
				</div>
					</Card>

					{/* Total Card */}
					<Card
						styles={{ body: { padding: 24, background: '#2563eb', cursor: 'pointer' }, header: { background: '#2563eb', borderRadius: '12px 12px 0 0', padding: 0 } }}
						style={{ borderRadius: 12, boxShadow: '0 2px 8px #e5e7eb', border: '1px solid #e5e7eb', minWidth: 260, maxWidth: 320, flex: 1 }}
						title={
							<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
								<span style={{ fontSize: 22, color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
									<span role="img" aria-label="doc">📄</span> Total
								</span>
								<span style={{ fontSize: 14, color: '#dbeafe', fontWeight: 500, textAlign: 'center', width: '100%' }}>Chiffre d'Affaires Combiné</span>
							</div>
						}
						onClick={() => setSelectedCard(selectedCard === 'total' ? null : 'total')}
					>
						<div style={{ marginBottom: 16 }}>
					<div style={{ fontSize: 13, color: '#dbeafe', fontWeight: 500 }}>CA Total au 25/11/2025</div>
					<div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>
						{loading ? 'Chargement...' : (totalData?.ca_25_11_2025 || '0,00')}
					</div>
						</div>
						<div style={{ marginBottom: 16 }}>
					<div style={{ fontSize: 13, color: '#dbeafe', fontWeight: 500 }}>CA Total Cumulé à ce jour</div>
					<div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
						{loading ? 'Chargement...' : (totalData?.ytd_ca || '0,00')}
					</div>
						</div>
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<div style={{ fontSize: 13, color: '#dbeafe', fontWeight: 500 }}>Croissance Totale Cumulée</div>
					<div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
						{loading ? 'Chargement...' : (totalData?.ytd_evolution || '0 %')}
					</div>
							<span style={{ color: '#fff', fontSize: 20 }}>⬆️</span>
						</div>
					</Card>
				</div>

				{/* Message d'erreur */}
				{error && (
					<div style={{ 
						background: '#fef2f2', 
						border: '1px solid #fecaca', 
						borderRadius: '8px', 
						padding: '16px', 
						margin: '16px auto', 
						maxWidth: '600px',
						textAlign: 'center'
					}}>
						<div style={{ color: '#dc2626', fontWeight: 600, marginBottom: '8px' }}>
							⚠️ Erreur de connexion à la base de données
						</div>
						<div style={{ color: '#7f1d1d', fontSize: '14px' }}>
							{error}. Impossible de récupérer les données depuis la base de données.
						</div>
					</div>
				)}

				{/* Tableau de détails uniquement sous les cards */}
				{selectedCard && (
					<div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-2 mx-auto" style={{ margin: '32px auto', maxWidth: 1500, overflowX: 'auto' }}>
						<Table
							className="rounded-xl overflow-hidden text-lg w-full"
							columns={combinedColumns}
							dataSource={getFilteredData()}
							pagination={false}
							bordered
							scroll={{ x: 1300 }}
							size="middle"
							title={() => selectedCard === 'non-vie' ? 'Détails Non Vie' : selectedCard === 'vie' ? 'Détails Vie' : 'Détails Total'}
							rowClassName={(record) => record.key === 'total' ? 'bg-blue-100 font-bold' : 'bg-blue-50'}
						/>
					</div>
				)}
			</div>
		);
}