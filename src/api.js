import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/api/products',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    config.metadata = {startTime: new Date()};
    return config;
});

api.interceptors.response.use(
    (response) => {
        const endTime = new Date();
        const duration = endTime - response.config.metadata.startTime;
        console.log(`[API] ${response.config.method.toUpperCase()} ${response.config.url} -> ${duration}ms`);
        return response;
    },
    (error) => {
        const endTime = new Date();
        if(error.config && error.config.metadata) {
            const duration = endTime - error.config.metadata.startTime;
            console.warn(`[API] ${error.config.method.toUpperCase()} ${error.config.url} -> ${duration}ms (erro)`);
        } else {
            console.warn(`[API] Erro sem configuração prévia:`, error.message);
        }
        return Promise.reject(error);
    }
);

export default api;