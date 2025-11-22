import ImgExpocanpi from '../assets/Img_Expocanpi.jpg'; // Usaremos esta como imagem padrão
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import '../styles/Pages.css';

// Definir a interface para as props que o Card vai receber
interface ProjectCardProps {
    title: string;
    description: string;
    imageUrl: string | null; // O banner pode ser nulo
}

// Definir a URL base do seu backend para construir o link da imagem
const BACKEND_URL = 'http://localhost:8000';

export function ProjectCard({ title, description, imageUrl }: ProjectCardProps) {
    
    // Lógica para decidir qual imagem mostrar
    // Se 'imageUrl' existir, constrói o caminho completo. 
    // Senão, usa a imagem estática ImgExpocanpi.
    const finalImageUrl = imageUrl 
        ? `${BACKEND_URL}/storage/${imageUrl}`
        : ImgExpocanpi;

    // Função para truncar a descrição
    const truncate = (str: string, num: number) => {
        return str.length > num ? str.substring(0, num) + "..." : str;
    };

    return (
        <div className="project-card">
            <img src={finalImageUrl} alt={`Banner do ${title}`} />
            <div className="card-content">
                <h3>{title}</h3>
                <p>{truncate(description, 100)}</p>
                <a href="#" className="detail-button">Ver mais</a>
            </div>
        </div>
    );
}