import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// @ts-ignore: Importação de CSS
import '../styles/Pages.css';

export default function AccessPage() {
    const { id } = useParams(); // Pega o ID do projeto da URL
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleAccess = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (senha === 'senhaacesso') {
            // Redireciona para a página de avaliação do mesmo projeto
            navigate(`/projetos/${id}/avaliacao`);
        } else {
            setErro('Palavra-chave incorreta.');
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
                        />
                    </div>
                    
                    {erro && <p className="error-message">{erro}</p>}
                    
                    <button type="submit" className="acesso-button" style={{ marginTop: '10px' }}>
                        Acessar Avaliação
                    </button>
                </form>
            </div>
        </div>
    );
}