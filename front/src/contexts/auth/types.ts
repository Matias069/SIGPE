// Define o tipo de dados para o Orientador
export type Orientador = {
    idOrientador: number;
    nomeOrientador: string;
    emailOrientador: string;
    isAdmin: boolean;
    created_at: string;
    updated_at: string;
};

// Defina o que o contexto irá fornecer
export interface AuthContextType {
    orientador: Orientador | null;
    login: (emailOrientador: string, senhaOrientador: string) => Promise<Orientador>;
    logout: () => Promise<void>;
    isAdmin: boolean;
    loading: boolean;
}