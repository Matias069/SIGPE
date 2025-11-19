import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    withCredentials: true, // Obrigatório para enviar cookies
    xsrfCookieName: 'XSRF-TOKEN', // O nome do cookie que o Laravel envia
    xsrfHeaderName: 'X-XSRF-TOKEN', // O nome do header que o Laravel espera
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

/**
 * Função para buscar o cookie CSRF/sessão do Laravel.
 * Essencial para iniciar a sessão e deve ser chamada antes de qualquer requisição autenticada.
 */
export async function initializeSanctum(): Promise<boolean> {
    try {
        await apiClient.get('/sanctum/csrf-cookie');
        return true;
    } catch (error) {
        console.error('Erro ao inicializar Sanctum (CSRF):', error);
        return false;
    }
}

export default apiClient;