import { useContext } from "react";
import { authContext } from "./authContext";

// Hook Customizado para facilitar o uso
export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};