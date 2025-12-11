import { REQUEST_UC } from "../constants/apiConfig";
import { API_PRODUCTION_URL } from "../constants/apiConfig";

/**
 * Récupère tous les chiffres d'affaires avec le total
 * @returns {Promise<Array>} Liste des chiffres d'affaires
 */
export function getAllChiffreAffaires() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/chiffre-affaires",
        method: "GET"
    });
}

/**
 * Récupère les chiffres d'affaires par type
 * @param {string} type - Type d'assurance (NON_VIE, VIE)
 * @returns {Promise<Array>} Liste des chiffres d'affaires pour le type spécifié
 */
export function getChiffreAffairesByType(type) {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + `/chiffre-affaires/type/${type}`,
        method: "GET"
    });
}

/**
 * Récupère la synthèse Vie avec les données J-1 et les totaux
 * @returns {Promise<Array>} Liste des données de synthèse Vie par BU avec totaux
 */
export function getSyntheseVie() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/synthese-vie",
        method: "GET"
    });
}

/**
 * Récupère la synthèse globale (Vie + Non Vie) avec les données J-1 et les totaux
 * @returns {Promise<Array>} Liste des données de synthèse globale par type et BU avec totaux
 */
export function getSyntheseGlobale() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/synthese-vie/globale",
        method: "GET"
    });
}

/**
 * Récupère les données CA Vie avec les totaux calculés
 * @returns {Promise<Array>} Liste des données CA Vie avec totaux
 */
export function getCaVie() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/synthese-vie",
        method: "GET"
    });
}

/**
 * Récupère les données CA Non Vie avec les totaux calculés
 * @returns {Promise<Array>} Liste des données CA Non Vie avec totaux
 */
export function getCaNonVie() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/synthese-non-vie",
        method: "GET"
    });
}

/**
 * Récupère les données CA Vie mensuel
 * @returns {Promise<Array>} Liste des données CA Vie mensuel
 */
export function getCaVieMensuel() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/ca-vie-mensuel",
        method: "GET"
    });
}

/**
 * Récupère les données CA Non Vie mensuel
 * @returns {Promise<Array>} Liste des données CA Non Vie mensuel
 */
export function getCaNonVieMensuel() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/ca-non-vie-mensuel",
        method: "GET"
    });
}

/**
 * Récupère les émissions supérieures à 500 KDHS
 * @returns {Promise<Array>} Liste des émissions supérieures à 500 KDHS
 */
export function getEmissions500KDHS() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/emission500kdhs",
        method: "GET"
    });
}