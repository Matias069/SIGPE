import React, { createContext, useContext, useState, type ReactNode } from 'react';
import apiClient from '../apiClient';

// Defina o tipo de dados para o Orientador
type Orientador = {
    idOrientador: number;
    nomeOrientador: string;
    emailOrientador: string;
    isAdmin: boolean;
    created_at: string; 
    updated_at: string;
};

// Defina o que o contexto irá fornecer
interface AuthContextType {
    user: Orientador | null;
    login: (userData: Orientador) => void;
    logout: () => Promise<void>;
    isAdmin: boolean;
}

// Crie o Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Crie o Provedor
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Orientador | null>(null);

    // Deriva o estado de admin a partir do utilizador
    const isAdmin = user ? user.isAdmin : false;

    // Função para definir o utilizador após o login
    const login = (userData: Orientador) => {
        setUser(userData);
    };

    // Função para fazer logout
    const logout = async () => {
        try {
            await apiClient.post('/api/logout');
        } catch (error) {
            console.error("Erro no logout:", error);
        } finally {
            setUser(null);
            // Redireciona para a página de login
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

// Crie um Hook customizado para facilitar o uso
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}