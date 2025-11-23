import { AxiosError } from 'axios';

interface LaravelValidationError {
    message: string;
    errors?: Record<string, string[]>;
}

export const handleApiError = (error: unknown, defaultMessage: string = 'Ocorreu um erro inesperado.'): string => {
    if (error instanceof AxiosError && error.response) {
        const data = error.response.data as LaravelValidationError;

        // 1. Erro de Validação (422)
        if (error.response.status === 422 && data.errors) {
            // O Laravel geralmente retorna um objeto com arrays de erros por campo.
            // Ex: { "email": ["O campo email já está em uso."] }
            
            // Pegamos a primeira mensagem de erro do primeiro campo que falhou.
            // Isso evita poluir a tela com "Erro: [object Object]" ou listas gigantes.
            const firstField = Object.keys(data.errors)[0];
            const firstErrorMessage = data.errors[firstField][0];

            // Se a mensagem vier em inglês (caso o pacote de tradução falhe em algum ponto),
            // fazemos uma tradução de fallback para os casos mais comuns.
            if (firstErrorMessage.includes('has already been taken')) {
                return `Este valor já está cadastrado no sistema.`;
            }
            if (firstErrorMessage.includes('field is required')) {
                return `Por favor, preencha todos os campos obrigatórios.`;
            }

            // Retorna a mensagem do backend (que esperamos que esteja em PT-BR agora)
            // Removemos caracteres técnicos se vazarem, ex: "email_orientador" -> "email"
            return firstErrorMessage.replace(/_/g, ' ');
        }

        // 2. Erro de Autenticação (401)
        if (error.response.status === 401) {
            return defaultMessage || 'Não autorizado.';
        }

        // 3. Erro de Permissão (403)
        if (error.response.status === 403) {
            return 'Você não tem permissão para realizar esta ação.';
        }

        // 4. Não Encontrado (404)
        if (error.response.status === 404) {
            return 'Registro não encontrado.';
        }
        
        // 5. Sessão Expirada / Token Inválido (419 ou 401 específico)
        if (error.response.status === 419) {
            return 'Sua sessão expirou. Por favor, atualize a página.';
        }

        // Retorna a mensagem genérica do erro HTTP se houver (ex: "Server Error")
        return data.message || defaultMessage;
    }

    if (error instanceof Error) {
        // Erros de rede (sem conexão) ou erros de código no front
        if (error.message === 'Network Error') {
            return 'Erro de conexão. Verifique sua internet ou se o servidor está online.';
        }
        return error.message;
    }

    return defaultMessage;
};