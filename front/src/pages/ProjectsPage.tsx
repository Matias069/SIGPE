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
    const projetosPorPagina = 12;

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

    // Função para gerar a lista de botões de paginação
    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const maxPagesToShow = 12; // Quantidade de botões numéricos desejada

        if (totalPaginas <= maxPagesToShow) {
            // Se houver menos páginas que o limite, mostra todas
            for (let i = 1; i <= totalPaginas; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Calcula quantos slots temos para o meio (excluindo primeira e última)
            const slots = maxPagesToShow - 2; 
            
            if (paginaAtual <= slots) {
                // Cenário: Perto do início
                // Mostra 1 até (slots + 1) ... Última
                for (let i = 1; i <= slots + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPaginas);
            } else if (paginaAtual > totalPaginas - slots) {
                // Cenário: Perto do fim
                // Mostra 1 ... (Última - slots) até Última
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPaginas - slots; i <= totalPaginas; i++) {
                    pageNumbers.push(i);
                }
            } else {
                // Cenário: No meio
                // Mostra 1 ... janela central ... Última
                pageNumbers.push(1);
                pageNumbers.push('...');
                
                // Define a janela centralizada na página atual
                const sideLength = Math.floor(slots / 2); 
                const start = paginaAtual - sideLength + 1;
                const end = paginaAtual + sideLength;
                
                for (let i = start; i <= end; i++) {
                    pageNumbers.push(i);
                }
                
                pageNumbers.push('...');
                pageNumbers.push(totalPaginas);
            }
        }
        return pageNumbers;
    };

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
                            id={projeto.idProjeto}
                            title={projeto.nomeProjeto}
                            description={projeto.descricaoProjeto}
                            imageUrl={projeto.bannerProjeto}
                        />
                    ))
                )}
            </div>

            {/* Controles de Paginação */}
            {totalPaginas > 1 && (
                <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '20px', flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => mudarPagina(paginaAtual - 1)} 
                        disabled={paginaAtual === 1}
                        style={{ padding: '8px 12px', cursor: 'pointer' }}
                    >
                        {"<"}
                    </button>
                    
                    {getPageNumbers().map((page, index) => (
                        typeof page === 'number' ? (
                            <button
                                key={index}
                                onClick={() => mudarPagina(page)}
                                style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    backgroundColor: paginaAtual === page ? '#28a745' : '#f0f0f0',
                                    color: paginaAtual === page ? 'white' : 'black',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px'
                                }}
                            >
                                {page}
                            </button>
                        ) : (
                            <button
                                key={index}
                                disabled
                                style={{
                                    padding: '8px 12px',
                                    cursor: 'default',
                                    backgroundColor: 'transparent',
                                    color: 'black',
                                    border: 'none'
                                }}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    <button 
                        onClick={() => mudarPagina(paginaAtual + 1)} 
                        disabled={paginaAtual === totalPaginas}
                        style={{ padding: '8px 12px', cursor: 'pointer' }}
                    >
                        {">"}
                    </button>
                </div>
            )}
        </div>
    );
}