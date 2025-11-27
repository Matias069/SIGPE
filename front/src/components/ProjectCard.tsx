import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth/useAuth";
import apiClient from "../apiClient"; // Importado para o delete
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
   anoProjeto?: number;
   orientador: {
      idOrientador: number;
      nomeOrientador: string;
   };
   status_avaliacao?: "pendente" | "em_andamento" | "concluido";
   nota_final?: string | null;
}

// Definir a interface para as props que o Card vai receber
interface ProjectCardProps {
   projeto: Projeto;
   onDeleteSuccess?: () => void;
   onDeleteError?: (msg: string) => void;
}

export function ProjectCard({ projeto, onDeleteSuccess }: ProjectCardProps) {
   const navigate = useNavigate();
   const { orientador } = useAuth(); // Obtém o usuário logado

   // Estados para o popup de deleção
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   // Estado de erro
   const [erro, setErro] = useState<string | null>(null);

   // Permissões
   const isAdmin = orientador?.isAdmin;
   const isOwner = orientador?.idOrientador === projeto.orientador.idOrientador;

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
   }, [projeto.bannerProjeto, BACKEND_URL]);

   // Função para truncar a descrição
   const truncate = (str: string, num: number) => {
      return str.length > num ? str.substring(0, num) + "..." : str;
   };

   const handleCardClick = () => {
      // O backend bloqueará a 3ª avaliação
      navigate(`/projetos/${projeto.idProjeto}/acessoavaliador`);
   };

   const handleEdit = () => {
      navigate(`/projetos/${projeto.idProjeto}/editar`);
   };

   const handleDeleteClick = async () => {
      setShowDeleteConfirm(!showDeleteConfirm);
      setErro(null);
   };

   const confirmDelete = async () => {
      try {
         setIsDeleting(true);
         await apiClient.delete(`/projetos/${projeto.idProjeto}`);
         setShowDeleteConfirm(false);

         // Chama o callback do pai apenas no sucesso (para atualizar lista e msg global)
         if (onDeleteSuccess) {
            onDeleteSuccess();
         } else {
            window.location.reload();
         }
      } catch (error) {
         console.error(error);
         setShowDeleteConfirm(false);
         // Define o erro apenas localmente no card
         setErro("Erro ao deletar projeto.");
      } finally {
         setIsDeleting(false);
      }
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

            {isAdmin && (
               <div
                  className="card-admin-text"
                  style={{
                     marginTop: "10px",
                     fontSize: "0.85rem",
                     color: "#555",
                     borderTop: "1px solid #eee",
                     paddingTop: "5px",
                  }}
               >
                  {projeto.senhaAvaliador && (
                     <p style={{ marginBottom: "2px" }}>
                        <strong>Senha:</strong>{" "}
                        <i>"{projeto.senhaAvaliador}"</i>
                     </p>
                  )}
                  {projeto.anoProjeto && (
                     <p style={{ margin: 0 }}>
                        <strong>Ano do Projeto:</strong> {projeto.anoProjeto}
                     </p>
                  )}
               </div>
            )}

            {erro && (
               <div className="text-red-800 bg-red-100 border border-red-300 px-4 py-2 rounded mt-2 text-sm text-center">
                  {erro}
               </div>
            )}

            <div
               style={{
                  marginTop: "auto",
                  display: "flex",
                  gap: "5px",
                  flexDirection: "row",
                  width: "100%",
                  flexWrap: "wrap",
               }}
            >
               <button
                  type="button"
                  className="detail-button"
                  onClick={handleCardClick}
                  style={{ textDecoration: "none", marginTop: "auto", flex: 1 }}
               >
                  Avaliar
               </button>
               <div
                  style={{
                     display: "flex",
                     gap: "5px",
                     width: "100%",
                     position: "relative",
                  }}
               >
                  {(isAdmin || isOwner) && (
                     <button
                        type="button"
                        onClick={handleEdit}
                        className="detail-button"
                        style={{
                           flex: 1,
                           backgroundColor: "#007bff",
                           marginTop: 0,
                        }}
                     >
                        Modificar
                     </button>
                  )}
                  {isAdmin && (
                     <>
                        <button
                           type="button"
                           onClick={handleDeleteClick}
                           className="detail-button"
                           style={{
                              flex: 1,
                              backgroundColor: "#dc3545",
                              marginTop: 0,
                           }}
                        >
                           {showDeleteConfirm ? "Cancelar" : "Deletar"}
                        </button>

                        {showDeleteConfirm && (
                           <div
                              style={{
                                 position: "absolute",
                                 bottom: "110%", // Acima dos botões
                                 right: "0",
                                 width: "200px",
                                 backgroundColor: "white",
                                 border: "1px solid #ddd",
                                 borderRadius: "8px",
                                 boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                                 zIndex: 10,
                                 padding: "15px",
                                 textAlign: "center",
                              }}
                           >
                              <p
                                 style={{
                                    margin: "0 0 10px 0",
                                    fontSize: "0.9rem",
                                    color: "#333",
                                    fontWeight: "bold",
                                 }}
                              >
                                 Tem certeza?
                              </p>
                              <p
                                 style={{
                                    margin: "0 0 10px 0",
                                    fontSize: "0.8rem",
                                    color: "#666",
                                 }}
                              >
                                 Essa ação não pode ser desfeita.
                              </p>
                              <button
                                 onClick={confirmDelete}
                                 disabled={isDeleting}
                                 style={{
                                    width: "100%",
                                    padding: "6px",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "0.85rem",
                                 }}
                              >
                                 {isDeleting
                                    ? "Deletando..."
                                    : "Confirmar Exclusão"}
                              </button>
                           </div>
                        )}
                     </>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
