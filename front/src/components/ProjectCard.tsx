import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth/useAuth";
import ImgExpocanpi from "../assets/Img_Expocanpi.jpg"; // Usaremos esta como imagem padrão
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import "../styles/Pages.css";

// Defina a interface conforme o retorno da API
interface Projeto {
   idProjeto: number;
   nomeProjeto: string;
   descricaoProjeto: string;
   bannerProjeto: string | null;
   senhaAvaliador: string;
   orientador: {
      nomeOrientador: string;
   };
   status_avaliacao?: "pendente" | "em_andamento" | "concluido";
   nota_final?: string | null;
}

// Definir a interface para as props que o Card vai receber
interface ProjectCardProps {
   projeto: Projeto;
}

export function ProjectCard({ projeto }: ProjectCardProps) {
   const navigate = useNavigate();
   const { orientador } = useAuth(); // Obtém o usuário logado
   const isAdmin = orientador?.isAdmin;

   // Definir a URL base do seu backend para construir o link da imagem
   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
   const [finalImageUrl, setFinalImageUrl] = useState<string>(ImgExpocanpi);

   // Lógica para decidir qual imagem mostrar
   // Se 'imageUrl' existir, constrói o caminho completo.
   // Senão, usa a imagem estática ImgExpocanpi.
   useEffect(() => {
      if (!projeto.bannerProjeto) return;

      axios
         .get(`${BACKEND_URL}/storage/${projeto.bannerProjeto}`, {
            responseType: "blob",
         })
         .then((res) => {
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

   const handleCardClick = () => {
      // O backend bloqueará a 3ª avaliação
      navigate(`/projetos/${projeto.idProjeto}/acessoavaliador`);
   };

   // Lógica de exibição do status e nota
   let statusBadge;
   if (projeto.status_avaliacao === "concluido") {
      statusBadge = (
         <div
            style={{
               marginTop: "10px",
               padding: "5px 10px",
               borderRadius: "15px",
               backgroundColor: "#2d6a4f",
               color: "#fff",
               fontWeight: "bold",
               textAlign: "center",
               fontSize: "0.9rem",
            }}
         >
            Nota (máx 1.00): {(Number(projeto.nota_final) / 10).toFixed(2)}
         </div>
      );
   } else if (projeto.status_avaliacao === "em_andamento") {
      statusBadge = (
         <div
            style={{
               marginTop: "10px",
               padding: "5px 10px",
               borderRadius: "15px",
               backgroundColor: "#f4a261",
               color: "#fff",
               fontWeight: "bold",
               textAlign: "center",
               fontSize: "0.9rem",
            }}
         >
            Avaliação em andamento...
         </div>
      );
   } else {
      statusBadge = (
         <div
            style={{
               marginTop: "10px",
               padding: "5px 10px",
               borderRadius: "15px",
               backgroundColor: "#e0e0e0",
               color: "#666",
               fontWeight: "bold",
               textAlign: "center",
               fontSize: "0.9rem",
            }}
         >
            Nota pendente
         </div>
      );
   }

   return (
      <div className="project-card">
         <img
            src={finalImageUrl}
            alt={`Banner de ${projeto.nomeProjeto}`}
            style={{ borderRadius: "4px" }}
         />
         <div className="card-content">
            <h3 className="card-titulo">{projeto.nomeProjeto}</h3>
            <p style={{ margin: "0", color: "#555", fontSize: "1rem" }}>
               <strong>Orientador:</strong> {projeto.orientador?.nomeOrientador}
            </p>
            <p className="card-resumo">
               {truncate(projeto.descricaoProjeto, 100)}
            </p>

            {/* Exibe o status ou nota */}
            {statusBadge}

            {isAdmin && projeto.senhaAvaliador && (
               <p className="card-senha">
                  <strong>Senha do Projeto:</strong>{" "}
                  <i>"{projeto.senhaAvaliador}"</i>
               </p>
            )}

            {/* Link para a página de acesso do avaliador específica deste projeto */}
            <button
               type="button"
               className="detail-button"
               onClick={handleCardClick}
               style={{ textDecoration: "none", marginTop: "auto" }}
            >
               Avaliar Projeto
            </button>
         </div>
      </div>
   );
}
