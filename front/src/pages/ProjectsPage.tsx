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

    // Usar useEffect para buscar os dados da API quando a página carregar
    useEffect(() => {
        const fetchProjetos = async () => {
            try {
                setError('');
                setLoading(true);
                
                // A rota pública /api/projetos é chamada (ProjetoController@index)
                const response = await apiClient.get('/api/projetos');
                
                setProjetos(response.data); // Guarda os projetos no estado
            } catch (err) {
                console.error("Erro ao buscar projetos:", err);
                setError('Falha ao carregar os projetos.');
            } finally {
                setLoading(false); // Termina o loading
            }
        };

        fetchProjetos();
    }, []); // O array vazio [] faz com que isto rode apenas uma vez

    // Lidar com os estados de loading e erro
    if (loading) {
        return <div className="page-container"><h2>Carregando projetos...</h2></div>;
    }

    if (error) {
        return <div className="page-container"><h2>{error}</h2></div>;
    }

    // Renderizar os dados dinamicamente
    return (
        <div className="page-container">
            <h1>Projetos</h1>
            <div className="projects-grid">
                {/* Mapear o array de projetos e renderizar um Card para cada um */}
                {projetos.length === 0 ? (
                    <p>Nenhum projeto cadastrado ainda.</p>
                ) : (
                    projetos.map(projeto => (
                        <ProjectCard
                            key={projeto.idProjeto}
                            title={projeto.nomeProjeto}
                            description={projeto.descricaoProjeto}
                            imageUrl={projeto.bannerProjeto}
                        />
                    ))
                )}
            </div>
        </div>
    );
}