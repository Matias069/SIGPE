import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth/useAuth';
import ImgExpocanpi from '../assets/Img_Expocanpi.jpg'; // Usaremos esta como imagem padrão
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import '../styles/Pages.css';

// Defina a interface conforme o retorno da API
interface Projeto {
    idProjeto: number;
    nomeProjeto: string;
    descricaoProjeto: string;
    bannerProjeto: string | null;
    senhaAvaliador?: string;
    orientador?: {
        nomeOrientador: string;
    };
}

// Definir a interface para as props que o Card vai receber
interface ProjectCardProps {
    projeto: Projeto;
}

export function ProjectCard({ projeto }: ProjectCardProps) {
    const navigate = useNavigate();
    const { orientador } = useAuth(); // Obtém o usuário logado
    const isAdmin = orientador ? orientador.isAdmin : false;

    // Definir a URL base do seu backend para construir o link da imagem
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [finalImageUrl, setFinalImageUrl] = useState<string>(ImgExpocanpi);
    
    // Lógica para decidir qual imagem mostrar
    // Se 'imageUrl' existir, constrói o caminho completo. 
    // Senão, usa a imagem estática ImgExpocanpi.
    useEffect(() => {
        if (!projeto.bannerProjeto) return;

        axios.get(`${BACKEND_URL}/storage/${projeto.bannerProjeto}`, { responseType: 'blob' })
            .then(res => {
                const imgUrl = URL.createObjectURL(res.data);
                setFinalImageUrl(imgUrl);
            })
            .catch(() => {
                setFinalImageUrl(ImgExpocanpi);
            });
    }, [projeto.bannerProjeto]);

    // Função para truncar a descrição
    const truncate = (str: string, num: number) => {
        return str.length > num ? str.substring(0, num) + "..." : str;
    };

    return (
        <div className="project-card">
            <img src={finalImageUrl} alt={`Banner de ${projeto.nomeProjeto}`} />
            <div className="card-content">
                <h3 className="card-titulo">{projeto.nomeProjeto}</h3>
                <p className="card-resumo">{truncate(projeto.descricaoProjeto, 100)}</p>

                {isAdmin && projeto.senhaAvaliador && (
                    <p className="card-senha">
                        <strong>Senha do Projeto:</strong> <i>"{projeto.senhaAvaliador}"</i>
                    </p>
                )}

                {/* Link para a página de acesso do avaliador específica deste projeto */}
                <button 
                    type="button" 
                    className="detail-button" 
                    onClick={() => navigate(`/projetos/${projeto.idProjeto}/acessoavaliador`)}
                    style={{textDecoration: 'none', marginTop: 'auto'}}
                >
                    Avaliar Projeto
                </button>
            </div>
        </div>
    );
}