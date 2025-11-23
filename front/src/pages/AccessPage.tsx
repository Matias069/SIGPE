import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../apiClient';
import { handleApiError } from "../utils/errorHandler";
// @ts-ignore: Importação de CSS
import '../styles/Pages.css';

export default function AccessPage() {
    const { id } = useParams(); // Pega o ID do projeto da URL
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        setLoading(true);

        try {
            // Envia a senha para validação no backend
            await apiClient.post(`/projetos/${id}/acesso`, { senha });

            // Se não der erro (200 OK), salva a permissão na sessão
            sessionStorage.setItem(`access_token_proj_${id}`, 'true');

            navigate(`/projetos/${id}/avaliacao`);
        } catch (error) {
            console.error("Erro ao inserir palavra-chave", error);
            setErro(handleApiError(error, 'Palavra-chave incorreta. Tente novamente.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="centered-box" style={{ maxWidth: '400px', padding: '30px', backgroundColor: '#fff', border: '1px solid #ddd' }}>
                <h2 style={{ marginBottom: '20px', color: '#2d6a4f' }}>Acesso do Avaliador</h2>
                <p style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#666' }}>
                    Projeto ID: #{id}
                </p>
                
                <form onSubmit={handleAccess}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Insira a palavra-chave:
                        </label>
                        <input 
                            type="password" 
                            className="input" 
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Senha de acesso..."
                            style={{ width: '100%' }}
                            disabled={loading}
                        />
                    </div>
                    
                    {erro && (
                        <div className="error-message" style={{
                            color: '#721c24', 
                            backgroundColor: '#f8d7da', 
                            borderColor: '#f5c6cb', 
                            padding: '10px', 
                            marginTop: '10px', 
                            borderRadius: '5px',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            {erro}
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        className="acesso-button" 
                        style={{ marginTop: '10px' }}
                        disabled={loading}
                    >
                        {loading ? 'Verificando...' : 'Acessar Avaliação'}
                    </button>
                </form>
            </div>
        </div>
    );
}