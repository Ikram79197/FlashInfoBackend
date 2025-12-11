// Configuration des URLs de l'API
export const API_PRODUCTION_URL = 'http://localhost:8080/api';

// Fonction REQUEST_UC réutilisable pour toutes les requêtes API
export function REQUEST_UC({ url, data, method = 'GET', headers = {}, timeout = 10000 }) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers
    };

    const requestOptions = {
        method,
        headers: defaultHeaders,
        signal: AbortSignal.timeout(timeout)
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        requestOptions.body = JSON.stringify(data);
    }

    return fetch(url, requestOptions)
        .then(async response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
            }
            return await response.json();
        })
        .catch(error => {
            if (error.name === 'AbortError') {
                throw new Error('Timeout: La requête a pris trop de temps');
            }
            throw new Error(`Erreur lors de la requête: ${error.message}`);
        });
}