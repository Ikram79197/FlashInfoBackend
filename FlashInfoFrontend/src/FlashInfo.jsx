import React from "react";
import { Table, Card } from "antd";
import { useState, useEffect } from "react";
import { getAllChiffreAffaires, getCaNonVieThisMonth } from "./Api/FlashInfoApi";
import { formatNumber, formatPercent } from './utils/formatters';
import logoMamdaMcma from './assets/MamdaMcma_Logo instit.png';
import testImage from './assets/testImage.png';
import caGlobalIcon from './assets/ca-global-icon.png';
import iconNonVie from './assets/iconNONvie.png';
import iconVie from './assets/iconVie.png';
import iconCAm1 from './assets/icon-cam-1.png';

// Fonction utilitaire pour déterminer le style selon la valeur d'évolution
function getEvolutionStyle(value) {
    if (!value) return { fontWeight: 700, borderRadius: 4, padding: '1px 6px', whiteSpace: 'nowrap' };

    // Nettoyer la valeur : enlever le % et remplacer la virgule par un point
    const cleanValue = value.toString().replace('%', '').replace(',', '.').trim();
    const num = parseFloat(cleanValue);

    if (isNaN(num)) return { fontWeight: 700, borderRadius: 4, padding: '1px 6px', whiteSpace: 'nowrap' };
    if (num < 0) {
        return {
            background: '#ef4444',
            color: '#fff',
            fontWeight: 700,
            borderRadius: 4,
            padding: '1px 6px',
            whiteSpace: 'nowrap'
        };
    }
    if (num < 5) {
        return {
            background: '#fb923c',
            color: '#fff',
            fontWeight: 700,
            borderRadius: 4,
            padding: '1px 6px',
            whiteSpace: 'nowrap'
        };
    }
    if (num >= 100) {
        return {
            background: '#15803d',
            color: '#fff',
            fontWeight: 700,
            borderRadius: 4,
            padding: '1px 6px',
            whiteSpace: 'nowrap'
        };
    }
    return {
        background: '#22c55e',
        color: '#fff',
        fontWeight: 700,
        borderRadius: 4,
        padding: '1px 6px',
        whiteSpace: 'nowrap'
    };
}

// Fonction pour la couleur du texte uniquement (sans background) pour les cartes
function getEvolutionColor(value) {
    if (!value) return { color: '#64748b', fontWeight: 700 };

    const cleanValue = value.toString().replace('%', '').replace(',', '.').trim();
    const num = parseFloat(cleanValue);

    if (isNaN(num)) return { color: '#64748b', fontWeight: 700 };
    if (num < 0) return { color: '#ef4444', fontWeight: 700 };
    if (num < 5) return { color: '#fb923c', fontWeight: 700 };
    if (num >= 100) return { color: '#15803d', fontWeight: 700 };
    return { color: '#22c55e', fontWeight: 700 };
}


export default function FlashInfo() {
    const [selectedCard, setSelectedCard] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [caNonVieThisMonthData, setCaNonVieThisMonthData] = useState([]);
    const [loadingBU, setLoadingBU] = useState(true);

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
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        const fetchBUData = async () => {
            try {
                setLoadingBU(true);
                const buResult = await getCaNonVieThisMonth();
                setCaNonVieThisMonthData(Array.isArray(buResult) ? buResult : []);
            } catch (err) {
                setCaNonVieThisMonthData([]);
            } finally {
                setLoadingBU(false);
            }
        };
        fetchData();
        fetchBUData();
        return undefined;
    }, [getCaNonVieThisMonth]);

    // Fonctions pour obtenir les dates dynamiques
    const getCurrentDate = () => {
        const today = new Date();
        today.setDate(today.getDate() - 1);
        return today.toLocaleDateString('fr-FR');
    };
    const getCurrentMonthName = () => {
        const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        const today = new Date();
        today.setDate(today.getDate() - 1);
        return months[today.getMonth()];
    };

    const getPreviousMonthName = () => {
        const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        const today = new Date();
        today.setDate(today.getDate() - 1);
        let prevMonth = today.getMonth() - 1;
        if (prevMonth < 0) prevMonth = 11;
        return months[prevMonth];
    };

    // Obtenir l'année du mois précédent (ex: janvier 2026 -> décembre 2025)
    const getPreviousMonthYear = () => {
        const today = new Date();
        today.setDate(today.getDate() - 1);
        let prevMonth = today.getMonth() - 1;
        let year = today.getFullYear();
        if (prevMonth < 0) year = year - 1;
        return year;
    };

    const getPreviousYear = () => new Date().getFullYear() - 1;
    const getCurrentYear = () => new Date().getFullYear();

    // Colonnes pour le tableau combiné
    const combinedColumns = [
        { title: '', dataIndex: 'type', key: 'type', width: 100, render: (text, record) => <span style={{ fontWeight: 700, color: '#fff' }}>{record.type}</span> },
        { title: `CA du ${getCurrentDate()}`, dataIndex: "ca_du_jour", width: 140, align: 'right', render: (text, record) => <span style={{ fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>{record.ca_du_jour != null ? formatNumber(record.ca_du_jour) : ''}</span> },
        { title: `CA du mois de ${getCurrentMonthName().charAt(0).toUpperCase() + getCurrentMonthName().slice(1)} arrêté au ${getCurrentDate()}`, dataIndex: "ca_mois_actuel", width: 200, align: 'right', render: (text, record) => <span style={{ fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>{record.ca_mois_actuel != null ? formatNumber(record.ca_mois_actuel) : ''}</span> },
        { title: `CA du mois de ${getCurrentMonthName().charAt(0).toUpperCase() + getCurrentMonthName().slice(1)} ${getPreviousYear()}`, dataIndex: "ca_mois_annee_precedente", width: 160, align: 'right', render: (text, record) => <span style={{ fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>{record.ca_mois_annee_precedente != null ? formatNumber(record.ca_mois_annee_precedente) : ''}</span> },
        { title: `Taux de remplissage ${getCurrentYear()} %`, dataIndex: "taux_remplissage", width: 140, align: 'right', render: (text, record) => <span style={getEvolutionStyle(record.taux_remplissage != null ? formatPercent(record.taux_remplissage) : '')}>{record.taux_remplissage != null ? formatPercent(record.taux_remplissage) : ''}</span> },
        { title: "Year to Date (C.A)", dataIndex: "ytd_ca", width: 180, align: 'right', render: (text, record) => <span style={{ fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', display: 'block' }}>{record.ytd_ca != null ? formatNumber(record.ytd_ca) : ''}</span> },
        { title: "Year to Date (Évolution %)", dataIndex: "ytd_evolution", width: 160, align: 'right', render: (text, record) => <span style={getEvolutionStyle(record.ytd_evolution != null ? formatPercent(record.ytd_evolution) : '')}>{record.ytd_evolution != null ? formatPercent(record.ytd_evolution) : ''}</span> },
        { title: `CA du mois de ${getPreviousMonthName()} ${getPreviousMonthYear()}`, dataIndex: "ca_mois_precedent", width: 160, align: 'right', render: (text, record) => <span style={{ fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>{record.ca_mois_precedent != null ? formatNumber(record.ca_mois_precedent) : ''}</span> },
        { title: `Évolution % du mois de ${getPreviousMonthName()} ${getPreviousMonthYear()}`, dataIndex: "evolution_mois_precedent", width: 180, align: 'right', render: (text, record) => <span style={getEvolutionStyle(record.evolution_mois_precedent != null ? formatPercent(record.evolution_mois_precedent) : '')}>{record.evolution_mois_precedent != null ? formatPercent(record.evolution_mois_precedent) : ''}</span> },
    ];
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
        <div style={{
            background: '#f8fafc',
            minHeight: '100vh',
            padding: '16px',
            maxWidth: '100vw',
            boxSizing: 'border-box'
        }}>            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <img
                    src={logoMamdaMcma}
                    alt="MamdaMcma Logo"
                    style={{
                        height: '80px',
                        width: 'auto',
                        maxWidth: '220px',
                        objectFit: 'contain',
                        display: 'block',
                        margin: '0 auto 8px'
                    }}
                />
                <div style={{ fontSize: 28, fontWeight: 700, color: '#3A3163', marginBottom: 8 }}>Flash Info</div>
                <div style={{ fontSize: 18, color: '#64748b', marginBottom: 8 }}>du {getCurrentDate()}</div>
                <div style={{ height: 2, background: 'linear-gradient(90deg, #1677ff 0%, #f472b6 100%)', margin: '0 auto 24px', width: 320 }} />
            </div>
            {/* Cards */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 24,
                    marginTop: 16,
                    width: '100%'
                }}
            >
                {/* Total Card */}
                <Card
                    className="ca-global-card"
                    styles={{ body: { padding: 24, background: '#D9D9D9', cursor: 'pointer' }, header: { background: '#253338', borderRadius: '12px 12px 0 0', padding: 0 } }}
                    style={{
                        borderRadius: 12,
                        boxShadow: '0 2px 8px #e5e7eb',
                        border: '1px solid #e5e7eb',
                        minWidth: 260,
                        maxWidth: 320,
                        flex: 1,
                        width: '100%',
                        background: '#D9D9D9',
                    }}
                    title={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
                            <span style={{ fontSize: 22, color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                <img src={caGlobalIcon} alt="CA Global Icon" style={{ width: 28, height: 28, objectFit: 'contain', verticalAlign: 'middle' }} /> CA Global
                            </span>
                        </div>
                    }
                    onClick={() => setSelectedCard(selectedCard === 'total' ? null : 'total')}
                >
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, color: '#3A3163', fontWeight: 500 }}>CA du jour {getCurrentDate()}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#000000' }}>
                            {loading ? 'Chargement...' : (totalData?.ca_du_jour != null ? formatNumber(totalData.ca_du_jour) : formatNumber(0))}
                        </div>
                    </div>
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: 13, color: '#3A3163', fontWeight: 500 }}> MTD  </div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#000000' }}>
                                {loading ? 'Chargement...' : (totalData?.ca_mois_actuel != null ? formatNumber(totalData.ca_mois_actuel) : formatNumber(0))}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, color: '#3A3163', fontWeight: 500 }}>Taux de remplissage</div>
                            <span style={{
                                ...getEvolutionStyle(totalData?.taux_remplissage != null ? formatPercent(totalData.taux_remplissage) : ''),
                                fontSize: 18
                            }}>
                                {loading ? '...' : (totalData?.taux_remplissage != null ? formatPercent(totalData.taux_remplissage) : '')}
                            </span>
                        </div>
                    </div>
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: 13, color: '#3A3163', fontWeight: 500 }}>YTD</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#000000' }}>
                                {loading ? 'Chargement...' : (totalData?.ytd_ca != null ? formatNumber(totalData.ytd_ca) : formatNumber(0))}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, color: '#3A3163', fontWeight: 500 }}>Taux de croissance</div>
                            <span style={{
                                ...getEvolutionStyle(totalData?.ytd_evolution != null ? formatPercent(totalData.ytd_evolution) : formatPercent(0)),
                                fontSize: 18
                            }}>
                                {loading
                                    ? '...'
                                    : totalData?.ytd_evolution != null
                                        ? formatPercent(totalData.ytd_evolution)
                                        : formatPercent(0)
                                }
                            </span>
                        </div>
                    </div>
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: 13, color: '#3A3163', fontWeight: 500 }}>
                                YTM-1 {getPreviousMonthName()}
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#000000' }}>
                                {loading ? 'Chargement...' : (totalData?.ca_mois_precedent != null ? formatNumber(totalData.ca_mois_precedent) : formatNumber(0))}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, color: '#3A3163', fontWeight: 500 }}>
                                Taux de croissance
                            </div>
                            <span style={{
                                ...getEvolutionStyle(totalData?.evolution_mois_precedent != null ? formatPercent(totalData.evolution_mois_precedent) : ''),
                                fontSize: 18
                            }}>
                                {loading ? '...' : (totalData?.evolution_mois_precedent != null ? formatPercent(totalData.evolution_mois_precedent) : '')}
                            </span>
                        </div>
                    </div>
                </Card>
                {/* Non Vie Card */}
                <Card
                    styles={{ body: { padding: 24, background: '#fff', cursor: 'pointer' }, header: { background: '#253338', borderRadius: '12px 12px 0 0', padding: 0 } }}
                    style={{ borderRadius: 12, boxShadow: '0 2px 8px #e5e7eb', border: '1px solid #e5e7eb', minWidth: 260, maxWidth: 320, flex: 1 }}
                    title={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
                            <span style={{ fontSize: 22, color: '#ffffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                <img src={iconNonVie} alt="Non Vie Icon" style={{ width: 28, height: 28, objectFit: 'contain', verticalAlign: 'middle' }} /> Non Vie
                            </span>
                        </div>
                    }
                    onClick={() => setSelectedCard(selectedCard === 'non-vie' ? null : 'non-vie')}
                >
                    {/* CA du jour */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>CA du {getCurrentDate()}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                            {loading ? 'Chargement...' : (nonVieData?.ca_du_jour != null ? formatNumber(nonVieData.ca_du_jour) : formatNumber(0))}
                        </div>
                    </div>
                    {/* MTD + Taux de remplissage */}
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>MTD</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                                {loading ? 'Chargement...' : (nonVieData?.ca_mois_actuel != null ? formatNumber(nonVieData.ca_mois_actuel) : formatNumber(0))}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Taux de remplissage</div>
                            <span style={{
                                ...getEvolutionColor(nonVieData?.taux_remplissage != null ? formatPercent(nonVieData.taux_remplissage) : ''),
                                fontSize: 18
                            }}>
                                {loading ? 'Chargement...' : (nonVieData?.taux_remplissage != null ? formatPercent(nonVieData.taux_remplissage) : '')}
                            </span>
                        </div>
                    </div>
                    {/* YTD + Taux de croissance */}
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>YTD</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                                {loading ? 'Chargement...' : (nonVieData?.ytd_ca != null ? formatNumber(nonVieData.ytd_ca) : formatNumber(0))}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Taux de croissance</div>
                            <span style={{
                                ...getEvolutionColor(
                                    nonVieData?.ytd_evolution != null
                                        ? formatPercent(nonVieData.ytd_evolution)
                                        : formatPercent(0)
                                ),
                                fontSize: 18
                            }}>
                                {loading
                                    ? 'Chargement...'
                                    : nonVieData?.ytd_evolution != null
                                        ? formatPercent(nonVieData.ytd_evolution)
                                        : formatPercent(0)
                                }
                            </span>
                        </div>
                    </div>
                    {/* YTM-1 novembre + Taux de croissance */}
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                                YTM-1 {getPreviousMonthName()}
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                                {loading ? 'Chargement...' : (nonVieData?.ca_mois_precedent != null ? formatNumber(nonVieData.ca_mois_precedent) : formatNumber(0))}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                                Taux de croissance
                            </div>
                            <span style={{
                                ...getEvolutionColor(nonVieData?.evolution_mois_precedent != null ? formatPercent(nonVieData.evolution_mois_precedent) : ''),
                                fontSize: 18
                            }}>
                                {loading ? '...' : (nonVieData?.evolution_mois_precedent != null ? formatPercent(nonVieData.evolution_mois_precedent) : '')}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Vie Card */}
                <Card
                    styles={{ body: { padding: 24, background: '#fff', cursor: 'pointer' }, header: { background: '#253338', borderRadius: '12px 12px 0 0', padding: 0 } }}
                    style={{ borderRadius: 12, boxShadow: '0 2px 8px #e5e7eb', border: '1px solid #e5e7eb', minWidth: 260, maxWidth: 320, flex: 1 }}
                    title={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
                            <span style={{ fontSize: 22, color: '#ffffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                <img src={iconVie} alt="Vie Icon" style={{ width: 28, height: 28, objectFit: 'contain', verticalAlign: 'middle' }} /> Vie
                            </span>
                        </div>
                    }
                    onClick={() => setSelectedCard(selectedCard === 'vie' ? null : 'vie')}
                >
                    {/* CA du jour */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>CA du {getCurrentDate()}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                            {loading ? 'Chargement...' : (vieData?.ca_du_jour != null ? formatNumber(vieData.ca_du_jour) : formatNumber(0))}
                        </div>
                    </div>
                    {/* MTD + Taux de remplissage */}
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>MTD</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                                {loading ? 'Chargement...' : (vieData?.ca_mois_actuel != null ? formatNumber(vieData.ca_mois_actuel) : formatNumber(0))}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Taux de remplissage</div>
                            <span style={{
                                ...getEvolutionColor(vieData?.taux_remplissage != null ? formatPercent(vieData.taux_remplissage) : ''),
                                fontSize: 18
                            }}>
                                {loading ? 'Chargement...' : (vieData?.taux_remplissage != null ? formatPercent(vieData.taux_remplissage) : '')}
                            </span>
                        </div>
                    </div>
                    {/* YTD + Taux de croissance */}
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>YTD</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                                {loading ? 'Chargement...' : (vieData?.ytd_ca != null ? formatNumber(vieData.ytd_ca) : formatNumber(0))}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Taux de croissance</div>
                            <span style={{
                                ...getEvolutionColor(
                                    vieData?.ytd_evolution != null
                                        ? formatPercent(vieData.ytd_evolution)
                                        : formatPercent(0)
                                ),
                                fontSize: 18
                            }}>
                                {loading
                                    ? 'Chargement...'
                                    : vieData?.ytd_evolution != null
                                        ? formatPercent(vieData.ytd_evolution)
                                        : formatPercent(0)
                                }
                            </span>
                        </div>
                    </div>
                    {/* YTM-1 novembre + Taux de croissance */}
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                                YTM-1 {getPreviousMonthName()}
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                                {loading ? 'Chargement...' : (vieData?.ca_mois_precedent != null ? formatNumber(vieData.ca_mois_precedent) : formatNumber(0))}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                                Taux de croissance
                            </div>
                            <span style={{
                                ...getEvolutionColor(vieData?.evolution_mois_precedent != null ? formatPercent(vieData.evolution_mois_precedent) : ''),
                                fontSize: 18
                            }}>
                                {loading ? '...' : (vieData?.evolution_mois_precedent != null ? formatPercent(vieData.evolution_mois_precedent) : '')}
                            </span>
                        </div>
                    </div>

                </Card>
                {/* CA par BU à M-1 Card */}
                <Card
                    styles={{ body: { padding: 24, background: '#fff', cursor: 'pointer' }, header: { background: '#253338', borderRadius: '12px 12px 0 0', padding: 0 } }}
                    style={{ borderRadius: 12, boxShadow: '0 2px 8px #e5e7eb', border: '1px solid #e5e7eb', minWidth: 260, maxWidth: 320, flex: 1 }}
                    title={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
                            <span style={{ fontSize: 20, color: '#ffffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                <img src={iconCAm1} alt="CA par BU à M-1 Icon" style={{ width: 28, height: 28, objectFit: 'contain', verticalAlign: 'middle' }} /> CA par BU Non Vie M-1
                            </span>
                        </div>
                    }
                >
                    {loadingBU ? (
                        <div style={{ fontSize: 16, color: '#64748b', textAlign: 'center' }}>Chargement...</div>
                    ) : (
                        <div>
                            {caNonVieThisMonthData.length === 0 ? (
                                <div style={{ fontSize: 14, color: '#64748b', textAlign: 'center' }}>Aucune donnée disponible</div>
                            ) : (
                                // Custom order: MAMDA, MCMA, MAEM, COURTAGE
                                [
                                    'MAMDA_HORS_MRC',
                                    'MCMA_DIRECT',
                                    'MAEM',
                                    'COURTAGE'
                                ].map((buKey) => {
                                    const item = caNonVieThisMonthData.find(i => i.bu === buKey);
                                    if (!item) return null;
                                    const ca = formatNumber(item.ca_total_annee_courante);
                                    const taux = formatPercent(item.taux_total);
                                    let buLabel = item.bu;
                                    if (buLabel === 'MAMDA_HORS_MRC') buLabel = 'MAMDA';
                                    if (buLabel === 'MCMA_DIRECT') buLabel = 'MCMA';
                                    return (
                                        <div key={buKey} style={{ marginBottom: 16 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div>
                                                    <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{buLabel}</div>
                                                    <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{ca}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Taux de croissance</div>
                                                    <span style={{ ...getEvolutionColor(taux), fontSize: 18 }}>{taux}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
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

            {/* Tableau de détails */}
            {/* <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-2 mx-auto" style={{ margin: '32px auto', maxWidth: 1500, overflowX: 'auto' }}>
                <Table
                    className="rounded-xl overflow-hidden text-lg w-full"
                    columns={combinedColumns}
                    dataSource={selectedCard ? getFilteredData() : data}
                    pagination={false}
                    bordered
                    scroll={{ x: 1300 }}
                    size="middle"
                    title={() => selectedCard === 'non-vie' ? 'Détails Non Vie' : selectedCard === 'vie' ? 'Détails Vie' : 'Détails Total'}
                    rowClassName={(record) => record.key === 'total' ? 'bg-blue-100 font-bold' : 'bg-blue-50'}
                />
            </div> */}
            {/* Légende des couleurs */}
            {/* <div style={{ 
                    background: '#ffffff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px', 
                    padding: '12px 16px', 
                    margin: '0 auto 24px', 
                    maxWidth: '100%',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    overflowX: 'auto'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                        {[
                            { color: '#ef4444', text: "Chiffre d'affaires en baisse" },
                            { color: '#fb923c', text: 'Croissance inférieure à 5%' },
                            { color: '#22c55e', text: 'Croissance supérieure à 5%' },
                            { color: '#15803d', text: 'Croissance supérieure à 100%' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 140, margin: '6px 8px' }}>
                                <span style={{ 
                                    background: item.color, 
                                    width: 'clamp(10px, 2.2vw, 16px)',
                                    height: 'clamp(10px, 2.2vw, 16px)',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    flex: '0 0 auto'
                                }}></span>
                                <span style={{ fontSize: 'clamp(12px, 2.2vw, 14px)', color: '#121212ff' }}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div> */}
            {/* <img
				src={testImage}
				alt="Footer"/> */}
        </div>
    );
}

