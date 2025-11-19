import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/useAuth';

export function ProtectedRoute() {
    const { orientador } = useAuth(); // Obtém o utilizador do contexto

    // Se o utilizador não estiver logado, redireciona-o para o login
    if (!orientador) {
        // Redireciona para o login, guardando a página que ele tentou acessar
        return <Navigate to="/login" replace />;
    }

    // Se estiver logado (seja Orientador ou Admin), permite o acesso
    // <Outlet /> é um placeholder para o componente da rota aninhada
    return <Outlet />;
}