import { Navigate, Outlet, useParams } from 'react-router-dom';

export function EvaluatorRoute() {
    const { id } = useParams();
    
    // Verifica se existe o token de acesso para este projeto específico no Session Storage
    const hasAccess = sessionStorage.getItem(`access_token_proj_${id}`) === 'true';

    if (!hasAccess) {
        // Se não tiver acesso, redireciona para a página de inserção de senha
        return <Navigate to={`/projetos/${id}/acessoavaliador`} replace />;
    }

    return <Outlet />;
}