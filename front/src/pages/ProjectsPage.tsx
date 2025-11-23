import { useEffect, useState } from "react";
import { ProjectCard } from '../components/ProjectCard';
import apiClient from '../apiClient';
import { handleApiError } from "../utils/errorHandler";
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
    const [erro, setErro] = useState('');
    
    // Estados da busca
    const [busca, setBusca] = useState("");
    const [buscaDebounced, setBuscaDebounced] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Debounce – espera 300ms antes de aplicar o filtro
    useEffect(() => {
        if (busca.trim() !== "") {
            setIsSearching(true);
        } else {
            setIsSearching(false);
        }

        const timer = setTimeout(() => {
            setBuscaDebounced(busca);
            setPaginaAtual(1); // Volta para página 1 após buscar
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [busca]);

    // Estado para paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const projetosPorPagina = 12;

    // Buscar os dados da API
    useEffect(() => {
        const fetchProjetos = async () => {
            try {
                setErro('');
                setLoading(true);
                const response = await apiClient.get('/projetos');
                setProjetos(response.data);
            } catch (error) {
                console.error("Erro ao buscar projetos", error);
                setErro(handleApiError(error, "Falha ao carregar os projetos."));
            } finally {
                setLoading(false);
            }
        };

        fetchProjetos();
    }, []);

    // Filtrar projetos com o valor debounced
    const projetosFiltrados = projetos.filter((p) =>
        p.nomeProjeto?.toLowerCase().includes(buscaDebounced.toLowerCase())
    );

    // Lógica de Paginação
    const indexUltimoProjeto = paginaAtual * projetosPorPagina;
    const indexPrimeiroProjeto = indexUltimoProjeto - projetosPorPagina;
    const projetosAtuais = projetosFiltrados.slice(indexPrimeiroProjeto, indexUltimoProjeto);
    const totalPaginas = Math.ceil(projetosFiltrados.length / projetosPorPagina);

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

    return (
        <div className="page-container">
            <h1>Projetos</h1>
            
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

            <input
                type="text"
                placeholder="Pesquisar projetos..."
                value={busca}
                onChange={(e) => { 
                    setBusca(e.target.value); 
                    setPaginaAtual(1); // Resetar para página 1 ao pesquisar
                }}
                className="input"
                style={{
                    padding: "10px",
                    width: "60%",
                    maxWidth: "400px",
                    borderRadius: "6px",
                    border: "1px solid #ccc"
                }}
            />

            {/* Texto de busca */}  
            {isSearching && busca !== "" && (
                <p style={{ textAlign: "center", marginTop: "10px" }}>
                    Buscando...
                </p>
            )}

            {!isSearching && buscaDebounced !== "" && projetosFiltrados.length === 0 && (
                <p style={{ textAlign: "center", marginTop: "20px" }}>
                    Nenhum projeto encontrado para "<strong>{buscaDebounced}</strong>".
                </p>
            )}

            <div className="projects-grid">
                {projetosAtuais.length > 0 && (
                    projetosAtuais.map(projeto => (
                        <ProjectCard
                            key={projeto.idProjeto}
                            projeto={projeto}
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