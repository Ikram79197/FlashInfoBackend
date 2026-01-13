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


export function getSyntheseVie() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/synthese-vie",
        method: "GET"
    });
}


export function getSyntheseGlobale() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/synthese-vie/globale",
        method: "GET"
    });
}


export function getCaVie() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/synthese-vie",
        method: "GET"
    });
}


export function getCaNonVie() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/synthese-non-vie",
        method: "GET"
    });
}


export function getCaVieMensuel() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/ca-vie-mensuel",
        method: "GET"
    });
}


export function getCaNonVieMensuel() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/ca-non-vie-mensuel",
        method: "GET"
    });
}


export function getEmissions500KDHS() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/emission500kdhs",
        method: "GET"
    });
}
export function getCaNonVieThisMonth() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/ca-non-vie-this-month",
        method: "GET"
    });
}

export function getCaVieThisMonth() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/vie-this-month",
        method: "GET"
    });
}

export function getCaNonVieExercice() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/ca-non-vie-exercice",
        method: "GET"
    });
}

export function getCaVieExercice() {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/ca-vie-exercice",
        method: "GET"
    });
}


export function authLogin(username, password) {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/login",
        method: "POST",
        data: { username, password }
    });
}

export function verifyOtp(username, otpCode) {
    return REQUEST_UC({
        url: API_PRODUCTION_URL + "/public/otp",
        method: "POST",
        data: {
            userLogin: username,
            systemName: "FlashInfo",
            codeValue: otpCode
        }
    });
}

export function updatePassword(userLogin, newPassword) {
  return REQUEST_UC({
    url: API_PRODUCTION_URL + "/users/updatePassword",
    method: "POST",
    data: {
      userLogin: userLogin,
      newPassword: newPassword,
    },
  });
}