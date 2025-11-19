import { useState, type ReactNode } from 'react';
import apiClient, { initializeSanctum } from '../../apiClient';
import { authContext } from "./authContext";
import type { Orientador } from "./types";

// Criação do Provedor
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [orientador, setOrientador] = useState<Orientador | null>(null);
    const isAdmin = orientador ? orientador.isAdmin : false;
    
    // Função de Login Centralizada
    const login = async (emailOrientador: string, senhaOrientador: string) => {
        // Garante o cookie CSRF antes de logar
        await initializeSanctum();
        
        const response = await apiClient.post('/login', { 
            emailOrientador, 
            senhaOrientador 
        });
        // Atualiza o estado
        setOrientador(response.data);

        return response.data;
    };

    // Funçõ de logout
    const logout = async () => {
        try {
            await apiClient.post('/logout');
        } catch (error) {
            console.error("Erro no logout:", error);
        } finally {
            // Limpa o estado local
            setOrientador(null);
            
            // Usar window.location para limpar estado geral
            window.location.href = '/';
        }
    };

    return (
        <authContext.Provider value={{ orientador, login, logout, isAdmin }}>
            {children}
        </authContext.Provider>
    );
};