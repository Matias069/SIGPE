import { useState, useEffect } from 'react';
import apiClient from '../../apiClient';
import { authContext } from "./authContext";
import type { Orientador } from "./types";

// Criação do Provedor
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orientador, setOrientador] = useState<Orientador | null>(null);
    const [loading, setLoading] = useState(true);

    // Login: Recebe credenciais, posta na API, salva token e user
    const login = async (emailOrientador: string, senhaOrientador: string) => {
        try {
            // Faz a requisição
            const response = await apiClient.post('/login', { 
                emailOrientador, 
                senhaOrientador 
            });

            // Verifica se a resposta tem os dados esperados
            if (!response.data || !response.data.access_token) {
                throw new Error("Resposta inválida do servidor");
            }

            const { access_token, orientador } = response.data;

            // Salva e atualiza estado
            localStorage.setItem('authToken', access_token);
            setOrientador(orientador);

            return orientador; 

        } catch (error) {
            // Se der erro, repassa para a LoginPage tratar
            throw error;
        }
    };

    const logout = async () => {
        try {
            await apiClient.post('/logout');
        } catch (error) {
            console.error("Erro no logout (token pode já estar inválido)", error);
        } finally {
            localStorage.removeItem('authToken');
            setOrientador(null);
            window.location.href = '/';
        }
    };

    // Persistência: Ao carregar a página, verifica se tem token e busca o usuário
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        if (token) {
            apiClient.get('/user')
                .then(response => {
                    setOrientador(response.data);
                })
                .catch(() => {
                    // Se o token for inválido/expirado, limpa tudo
                    localStorage.removeItem('authToken');
                    setOrientador(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const isAdmin = orientador ? orientador.isAdmin : false;

    return (
        <authContext.Provider value={{ orientador, login, logout, isAdmin, loading }}>
            {!loading && children}
        </authContext.Provider>
    );
};