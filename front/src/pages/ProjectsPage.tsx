import { useEffect, useState } from "react";
import { ProjectCard } from '../components/ProjectCard';
import apiClient from '../apiClient';
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import "../styles/Pages.css";

type Projeto = {
    idProjeto: number;
    idOrientador: number;
    nomeProjeto: string;
    descricaoProjeto: string;
    bannerProjeto: string | null;
};

export default function ProjetosPage() {
    const [projetos, setProjetos] = useState<Projeto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Estado para paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const projetosPorPagina = 9;

    // Buscar os dados da API
    useEffect(() => {
        const fetchProjetos = async () => {
            try {
                setError('');
                setLoading(true);
                
                const response = await apiClient.get('/projetos');
                
                setProjetos(response.data);
            } catch (err) {
                console.error("Erro ao buscar projetos:", err);
                setError('Falha ao carregar os projetos.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjetos();
    }, []);

    // Lógica de Paginação
    const indexUltimoProjeto = paginaAtual * projetosPorPagina;
    const indexPrimeiroProjeto = indexUltimoProjeto - projetosPorPagina;
    const projetosAtuais = projetos.slice(indexPrimeiroProjeto, indexUltimoProjeto);
    const totalPaginas = Math.ceil(projetos.length / projetosPorPagina);

    // Função para mudar de página
    const mudarPagina = (numeroPagina: number) => setPaginaAtual(numeroPagina);

    if (loading) {
        return <div className="page-container"><h2>Carregando projetos...</h2></div>;
    }

    if (error) {
        return <div className="page-container"><h2>{error}</h2></div>;
    }

    return (
        <div className="page-container">
            <h1>Projetos</h1>
            
            <div className="projects-grid">
                {projetosAtuais.length === 0 ? (
                    <p>Nenhum projeto cadastrado ainda.</p>
                ) : (
                    projetosAtuais.map(projeto => (
                        <ProjectCard
                            key={projeto.idProjeto}
                            title={projeto.nomeProjeto}
                            description={projeto.descricaoProjeto}
                            imageUrl={projeto.bannerProjeto}
                        />
                    ))
                )}
            </div>

            {/* Controles de Paginação */}
            {totalPaginas > 1 && (
                <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                    <button 
                        onClick={() => mudarPagina(paginaAtual - 1)} 
                        disabled={paginaAtual === 1}
                        style={{ padding: '8px 12px', cursor: 'pointer' }}
                    >
                        Anterior
                    </button>
                    
                    {[...Array(totalPaginas)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => mudarPagina(index + 1)}
                            style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                backgroundColor: paginaAtual === index + 1 ? '#28a745' : '#f0f0f0',
                                color: paginaAtual === index + 1 ? 'white' : 'black',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button 
                        onClick={() => mudarPagina(paginaAtual + 1)} 
                        disabled={paginaAtual === totalPaginas}
                        style={{ padding: '8px 12px', cursor: 'pointer' }}
                    >
                        Próximo
                    </button>
                </div>
            )}
        </div>
    );
}