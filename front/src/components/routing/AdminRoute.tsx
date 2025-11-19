import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/useAuth';

export function AdminRoute() {
    const { orientador } = useAuth(); // Obtém o utilizador do contexto

    // Se o utilizador não estiver logado ou não for um admin, redireciona-o para a página inicial
    if (!orientador || !orientador.isAdmin) {
        return <Navigate to="/" replace />;
    }

    // Se for um admin, renderiza o conteúdo da rota
    // <Outlet /> é um placeholder para o componente da rota aninhada
    return <Outlet />;
}