// Configuration des URLs de l'API
export const API_PRODUCTION_URL = 'http://localhost:8080/api';
// export const API_PRODUCTION_URL = 'https://flashinfo.mamda-mcma.ma/flashInfo/api';


// Fonction REQUEST_UC réutilisable pour toutes les requêtes API
export function REQUEST_UC({ url, data, method = 'GET', headers = {}, timeout = 10000 }) {
    // attach JSON headers by default
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers
    };

    // Automatically attach Authorization header if token is present in localStorage
    try {
        const token = localStorage.getItem('flashinfo_token');
        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }
    } catch (e) {
        // localStorage may be unavailable in some environments; ignore silently
    }

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
                // try to include server error message when available
                let text = await response.text().catch(() => '');
                const msg = text || response.statusText;
                const err = new Error(`Erreur HTTP: ${response.status} - ${msg}`);
                // attach status and body for callers to make UI decisions
                err.status = response.status;
                err.body = msg;
                throw err;
            }

            // handle No Content responses
            if (response.status === 204) return null;

            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                return await response.json();
            }
            // fallback to text for unexpected content-types
            return await response.text();
        })
        .catch(error => {
            if (error.name === 'AbortError') {
                const err = new Error('Timeout: La requête a pris trop de temps');
                err.name = 'AbortError';
                throw err;
            }
            // propagate the error object (may include .status)
            throw error;
        });
}