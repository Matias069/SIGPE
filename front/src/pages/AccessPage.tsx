import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../apiClient";
import { handleApiError } from "../utils/errorHandler";
import QRCode from "react-qr-code";
// @ts-ignore: Importação de CSS
import "../styles/Pages.css";

export default function AccessPage() {
   const { id } = useParams(); // Pega o ID do projeto da URL
   const [senha, setSenha] = useState("");
   const [erro, setErro] = useState("");
   const [loading, setLoading] = useState(false);
   const [nomeProjeto, setNomeProjeto] = useState(""); // Estado para o nome do arquivo
   const navigate = useNavigate();

   // A URL que o QR Code representará (a página atual de acesso)
   const accessUrl = window.location.href;

   // Busca o nome do projeto para usar no arquivo salvo
   useEffect(() => {
      if (id) {
         apiClient
            .get(`/projetos/${id}`)
            .then((response) => {
               setNomeProjeto(response.data.nomeProjeto);
            })
            .catch((error) =>
               console.error("Erro ao carregar dados do projeto:", error)
            );
      }
   }, [id]);

   const handleAccess = async (e: React.FormEvent) => {
      e.preventDefault();
      setErro("");
      setLoading(true);

      try {
         // Envia a senha para validação no backend
         await apiClient.post(`/projetos/${id}/acesso`, { senha });

         // Se não der erro (200 OK), salva a permissão na sessão
         sessionStorage.setItem(`access_token_proj_${id}`, "true");

         navigate(`/projetos/${id}/avaliacao`);
      } catch (error) {
         console.error("Erro ao inserir palavra-chave", error);
         setErro(
            handleApiError(error, "Palavra-chave incorreta. Tente novamente.")
         );
      } finally {
         setLoading(false);
      }
   };

   const handleDownloadQRCode = () => {
      const svg = document.getElementById("QRCode");
      if (svg) {
         const svgData = new XMLSerializer().serializeToString(svg);
         const canvas = document.createElement("canvas");
         const ctx = canvas.getContext("2d");
         const img = new Image();
         img.onload = () => {
            // Adiciona uma margem/borda branca ao salvar
            canvas.width = img.width + 20;
            canvas.height = img.height + 20;
            if (ctx) {
               // Fundo branco
               ctx.fillStyle = "#FFFFFF";
               ctx.fillRect(0, 0, canvas.width, canvas.height);
               // Desenha o QR Code centralizado
               ctx.drawImage(img, 10, 10);
               const pngFile = canvas.toDataURL("image/png");
               const downloadLink = document.createElement("a");
               // Nome do arquivo solicitado
               downloadLink.download = `Acesso do Projeto ${
                  nomeProjeto || id
               }.png`;
               downloadLink.href = pngFile;
               downloadLink.click();
            }
         };
         // Converte SVG para base64 para desenhar no canvas
         img.src =
            "data:image/svg+xml;base64," +
            btoa(unescape(encodeURIComponent(svgData)));
      }
   };

   return (
      <div className="page-container">
         <div
            className="centered-box"
            style={{
               maxWidth: "400px",
               padding: "30px",
               backgroundColor: "#fff",
               border: "1px solid #ddd",
            }}
         >
            <h2 style={{ marginBottom: "20px", color: "#2d6a4f" }}>
               Acesso do Avaliador
            </h2>
            <p
               style={{
                  marginBottom: "15px",
                  fontSize: "0.9rem",
                  color: "#666",
               }}
            >
               Projeto ID: #{id}
            </p>

            {/* Seção do QR Code */}
            <div
               style={{
                  marginTop: "30px",
                  borderTop: "1px solid #eee",
                  paddingTop: "20px",
                  textAlign: "center",
               }}
            >
               <p
                  style={{
                     marginBottom: "10px",
                     fontSize: "0.9rem",
                     fontWeight: "bold",
                     color: "#2d6a4f",
                  }}
               >
                  Compartilhar Acesso
               </p>

               <div
                  style={{
                     background: "white",
                     padding: "10px",
                     display: "inline-block",
                     border: "1px solid #eee",
                  }}
               >
                  <QRCode
                     id="QRCode"
                     value={accessUrl}
                     size={128}
                     level={"H"} // Nível de correção de erro alto para melhor leitura
                  />
               </div>

               <br />

               <button
                  type="button"
                  onClick={handleDownloadQRCode}
                  style={{
                     marginTop: "15px",
                     padding: "8px 15px",
                     backgroundColor: "#28a745",
                     color: "white",
                     border: "none",
                     borderRadius: "5px",
                     cursor: "pointer",
                     fontSize: "0.85rem",
                  }}
               >
                  Salvar QR Code
               </button>
            </div>

            <br />

            <form onSubmit={handleAccess}>
               <div style={{ marginBottom: "15px" }}>
                  <label
                     style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                     }}
                  >
                     Insira a palavra-chave:
                  </label>
                  <input
                     type="password"
                     className="input"
                     value={senha}
                     onChange={(e) => setSenha(e.target.value)}
                     placeholder="Senha de acesso..."
                     style={{ width: "100%" }}
                     disabled={loading}
                  />
               </div>

               {erro && (
                  <div
                     className="error-message"
                     style={{
                        color: "#721c24",
                        backgroundColor: "#f8d7da",
                        borderColor: "#f5c6cb",
                        padding: "10px",
                        marginTop: "10px",
                        borderRadius: "5px",
                        fontSize: "0.9rem",
                        textAlign: "center",
                     }}
                  >
                     {erro}
                  </div>
               )}

               <button
                  type="submit"
                  className="acesso-button"
                  style={{ marginTop: "10px" }}
                  disabled={loading}
               >
                  {loading ? "Verificando..." : "Acessar Avaliação"}
               </button>
            </form>
         </div>
      </div>
   );
}
