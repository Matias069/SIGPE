import axios from 'axios';

const apiClient = axios.create({
    // URL base do backend Laravel
    baseURL: 'http://localhost:8000', 
    
    // Permite que o Axios envie cookies
    withCredentials: true, 
});

export default apiClient;