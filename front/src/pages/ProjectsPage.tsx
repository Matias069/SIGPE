import { useEffect, useState, useCallback } from "react";
import { ProjectCard } from "../components/ProjectCard";
import apiClient from "../apiClient";
import { handleApiError } from "../utils/errorHandler";
import { useAuth } from "../contexts/auth/useAuth";
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import "../styles/Pages.css";

// Componente Interno para o Dropdown de Critérios
const CriteriaDropdown = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [criterios, setCriterios] = useState<string[]>([]);
   const [loading, setLoading] = useState(false);
   const [saving, setSaving] = useState(false);
   const [erroCriterios, setErroCriterios] = useState("");
   const [msgSucesso, setMsgSucesso] = useState("");
   const loadCriterios = async () => {
      try {
         setLoading(true);
         const res = await apiClient.get("/criterios");
         setCriterios(res.data);
      } catch (e) {
         console.error(e);
         setErroCriterios("Erro ao carregar critérios.");
      } finally {
         setLoading(false);
      }
   };

   // Carrega ao abrir
   useEffect(() => {
      if (isOpen) {
         loadCriterios();
         setMsgSucesso("");
         setErroCriterios("");
      }
   }, [isOpen]);

   const handleAdd = () => {
      setCriterios([...criterios, "Novo Critério"]);
      setErroCriterios("");
   };

   const handleRemove = (index: number) => {
      if (criterios.length <= 1) {
         setErroCriterios("É necessário ter pelo menos um critério.");
         return;
      }
      const novos = [...criterios];
      novos.splice(index, 1);
      setCriterios(novos);
      setErroCriterios("");
   };

   const handleChange = (index: number, val: string) => {
      const novos = [...criterios];
      novos[index] = val;
      setCriterios(novos);
      setErroCriterios("");
   };

   const handleSave = async () => {
      setErroCriterios("");
      setMsgSucesso("");

      // Validação de Campos Vazios
      const temVazio = criterios.some((c) => c.trim() === "");
      if (temVazio) {
         setErroCriterios("Os nomes dos critérios não podem estar vazios.");
         return;
      }

      // Validação de Unicidade (Case insensitive)
      const nomesNormalizados = criterios.map((c) => c.trim().toLowerCase());
      const setUnico = new Set(nomesNormalizados);
      if (setUnico.size !== nomesNormalizados.length) {
         setErroCriterios("Os nomes dos critérios devem ser únicos.");
         return;
      }

      try {
         setSaving(true);
         await apiClient.post("/criterios", { criterios });
         setIsOpen(false);
         // Mensagem de sucesso definida para aparecer fora do dropdown
         setMsgSucesso("Critérios atualizados com sucesso!");
      } catch (error) {
         setErroCriterios("Erro ao salvar critérios. Tente novamente.");
      } finally {
         setSaving(false);
      }
   };

   return (
      <div
         style={{
            position: "relative",
            display: "inline-block",
            marginBottom: "20px",
         }}
      >
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn-submit"
            style={{
               backgroundColor: "#2d6a4f",
               padding: "10px 15px",
               fontSize: "0.9rem",
            }}
         >
            {isOpen ? "Fechar Edição" : "Gerenciar Critérios de Avaliação"}
         </button>

         {/* Mensagem de sucesso abaixo do botão de gerenciar */}
         {msgSucesso && (
            <div
               style={{
                  marginTop: "10px",
                  color: "#155724",
                  backgroundColor: "#d4edda",
                  padding: "8px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  border: "1px solid #c3e6cb",
               }}
            >
               {msgSucesso}
            </div>
         )}

         {isOpen && (
            <div
               style={{
                  position: "absolute",
                  top: "110%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "350px",
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  zIndex: 2000,
                  padding: "15px",
                  textAlign: "left",
               }}
            >
               <h3
                  style={{
                     margin: "0 0 10px 0",
                     fontSize: "1rem",
                     color: "#333",
                  }}
               >
                  Editar Critérios
               </h3>
               {loading ? (
                  <p>Carregando...</p>
               ) : (
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                     {criterios.map((crit, idx) => (
                        <div
                           key={idx}
                           style={{
                              display: "flex",
                              gap: "5px",
                              marginBottom: "8px",
                           }}
                        >
                           <input
                              type="text"
                              value={crit}
                              onChange={(e) =>
                                 handleChange(idx, e.target.value)
                              }
                              style={{
                                 flex: 1,
                                 padding: "5px",
                                 borderRadius: "4px",
                                 border: "1px solid #ccc",
                              }}
                           />
                           <button
                              onClick={() => handleRemove(idx)}
                              style={{
                                 background: "#e74c3c",
                                 color: "white",
                                 border: "none",
                                 borderRadius: "4px",
                                 cursor: "pointer",
                                 padding: "0 8px",
                              }}
                           >
                              X
                           </button>
                        </div>
                     ))}
                     <button
                        onClick={handleAdd}
                        style={{
                           width: "100%",
                           padding: "8px",
                           background: "#f0f0f0",
                           border: "1px dashed #999",
                           cursor: "pointer",
                           marginTop: "5px",
                        }}
                     >
                        + Adicionar Critério
                     </button>

                     <div style={{ marginTop: "15px", textAlign: "right" }}>
                        {/* Variável erroCriterios em cima do botão salvar alterações */}
                        {erroCriterios && (
                           <div
                              style={{
                                 color: "#721c24",
                                 fontSize: "0.85rem",
                                 marginBottom: "8px",
                                 textAlign: "center",
                                 padding: "5px",
                                 backgroundColor: "#f8d7da",
                                 borderRadius: "4px",
                              }}
                           >
                              {erroCriterios}
                           </div>
                        )}
                        <button
                           onClick={handleSave}
                           disabled={saving}
                           className="btn-submit"
                           style={{ width: "100%", padding: "8px" }}
                        >
                           {saving ? "Salvando..." : "Salvar Alterações"}
                        </button>
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

type Projeto = {
   idProjeto: number;
   nomeProjeto: string;
   descricaoProjeto: string;
   bannerProjeto: string | null;
   senhaAvaliador: string;
   anoProjeto?: number;
   orientador: {
      nomeOrientador: string;
   };
};

export default function ProjetosPage() {
   const { orientador } = useAuth(); // Pega usuário logado
   const [projetos, setProjetos] = useState<Projeto[]>([]);
   const [erro, setErro] = useState("");

   // Estados da busca
   const [busca, setBusca] = useState("");
   const [buscaDebounced, setBuscaDebounced] = useState("");

   const [loading, setLoading] = useState(true); // Controla apenas o "Carregando..." inicial da página (tela cheia)
   const [isSearching, setIsSearching] = useState(false); // Controla o feedback "Buscando..." (inline)

   // Estado para filtro de ano (Apenas Admin)
   const currentYear = new Date().getFullYear().toString();
   const [anoBusca, setAnoBusca] = useState(
      orientador?.isAdmin ? "" : currentYear
   );
   const [anoBuscaDebounced, setAnoBuscaDebounced] = useState(
      orientador?.isAdmin ? "" : currentYear
   );

   // Estado para paginação
   const [paginaAtual, setPaginaAtual] = useState(1);
   const projetosPorPagina = 12;

   // Debounce do Nome (Filtro local)
   useEffect(() => {
      if (busca.trim() !== "") setIsSearching(true);

      const timer = setTimeout(() => {
         setBuscaDebounced(busca);
         setPaginaAtual(1);
         // Só desativa se não estivermos aguardando uma requisição de ano também
         setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
   }, [busca]);

   // Debounce do Ano (Filtro server-side)
   useEffect(() => {
      // Se o valor mudou, ativa o "Buscando..."
      if (anoBusca !== anoBuscaDebounced) setIsSearching(true);

      const timer = setTimeout(() => {
         setAnoBuscaDebounced(anoBusca);
         setPaginaAtual(1);
         // Não setamos setIsSearching(false) aqui porque o fetchProjetos vai rodar logo em seguida
         // e ele gerencia o estado final do isSearching
      }, 300);

      return () => clearTimeout(timer);
   }, [anoBusca]);

   // Buscar os dados da API
   // Função de busca no backend (envolvida em useCallback para usar no useEffect)
   const fetchProjetos = useCallback(
      async (ano: string) => {
         try {
            setErro("");
            // Se não for o load inicial (onde loading já é true), ativamos o modo busca
            setIsSearching(true);

            const params: any = {};
            if (orientador?.isAdmin && ano !== "") {
               params.ano = ano;
            }

            const response = await apiClient.get("/projetos", { params });
            setProjetos(response.data);
         } catch (error) {
            console.error("Erro", error);
            setErro(handleApiError(error, "Falha ao carregar os projetos."));
         } finally {
            setLoading(false); // Remove o load inicial
            setIsSearching(false); // Remove o texto "Buscando..."
         }
      },
      [orientador]
   );

   // Effect para carregar projetos quando o Ano Debounced muda
   useEffect(() => {
      fetchProjetos(anoBuscaDebounced);
   }, [anoBuscaDebounced, fetchProjetos]);

   // Filtros Combinados: Backend já filtrou por ano, agora filtramos por nome no front
   const projetosFiltrados = projetos.filter((p) =>
      p.nomeProjeto?.toLowerCase().includes(buscaDebounced.toLowerCase())
   );

   // Lógica de Paginação
   const indexUltimoProjeto = paginaAtual * projetosPorPagina;
   const indexPrimeiroProjeto = indexUltimoProjeto - projetosPorPagina;
   const projetosAtuais = projetosFiltrados.slice(
      indexPrimeiroProjeto,
      indexUltimoProjeto
   );
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
            pageNumbers.push("...");
            pageNumbers.push(totalPaginas);
         } else if (paginaAtual > totalPaginas - slots) {
            // Cenário: Perto do fim
            // Mostra 1 ... (Última - slots) até Última
            pageNumbers.push(1);
            pageNumbers.push("...");
            for (let i = totalPaginas - slots; i <= totalPaginas; i++) {
               pageNumbers.push(i);
            }
         } else {
            // Cenário: No meio
            // Mostra 1 ... janela central ... Última
            pageNumbers.push(1);
            pageNumbers.push("...");

            // Define a janela centralizada na página atual
            const sideLength = Math.floor(slots / 2);
            const start = paginaAtual - sideLength + 1;
            const end = paginaAtual + sideLength;

            for (let i = start; i <= end; i++) {
               pageNumbers.push(i);
            }

            pageNumbers.push("...");
            pageNumbers.push(totalPaginas);
         }
      }
      return pageNumbers;
   };

   if (loading) {
      return (
         <div className="page-container">
            <h2>Carregando projetos...</h2>
         </div>
      );
   }

   return (
      <div className="page-container text-center">
         <h1 className="block text-3xl font-semibold text-gray-700 mb-2 text-center">
            Projetos
         </h1>

         <br />

         {/* Botão de Admin para gerenciar critérios */}
         {orientador?.isAdmin && (
            <div style={{ marginBottom: "10px" }}>
               <CriteriaDropdown />
            </div>
         )}

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

         <div
            style={{
               display: "flex",
               justifyContent: "center",
               gap: "10px",
               marginBottom: "20px",
               flexWrap: "wrap",
            }}
         >
            {/* Input de Busca de Texto */}
            <input
               type="text"
               placeholder="Pesquisar projetos..."
               value={busca}
               onChange={(e) => setBusca(e.target.value)}
               className="input"
               style={{
                  padding: "10px",
                  width: "100%",
                  maxWidth: "400px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
               }}
            />

            {/* Input de Ano (Apenas Admin) */}
            {orientador?.isAdmin && (
               <input
                  type="number"
                  placeholder="Ano"
                  value={anoBusca}
                  onChange={(e) => setAnoBusca(e.target.value)}
                  className="input"
                  style={{
                     padding: "10px",
                     width: "100px",
                     borderRadius: "6px",
                     border: "1px solid #ccc",
                  }}
                  title="Filtrar por ano (deixe vazio para ver todos)"
               />
            )}
         </div>

         {/* Texto unificado para busca de nome ou ano */}
         {isSearching && (
            <p style={{ textAlign: "center", marginTop: "10px" }}>
               Buscando...
            </p>
         )}

         {!isSearching &&
            buscaDebounced !== "" &&
            projetosFiltrados.length === 0 && (
               <p style={{ textAlign: "center", marginTop: "20px" }}>
                  Nenhum projeto encontrado para "
                  <strong>{buscaDebounced}</strong>".
               </p>
            )}

         {/* Feedback do histórico para Admin */}
         {orientador?.isAdmin &&
            anoBuscaDebounced === "" &&
            !isSearching &&
            !loading &&
            projetosFiltrados.length > 0 && (
               <p
                  style={{
                     fontSize: "0.8rem",
                     color: "#666",
                     marginBottom: "10px",
                  }}
               >
                  Exibindo histórico completo de projetos.
               </p>
            )}

         <div className="projects-grid">
            {projetosAtuais.length > 0 &&
               projetosAtuais.map((projeto) => (
                  <ProjectCard key={projeto.idProjeto} projeto={projeto} />
               ))}
         </div>

         {/* Controles de Paginação */}
         {totalPaginas > 1 && (
            <div
               className="pagination"
               style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "5px",
                  marginTop: "20px",
                  flexWrap: "wrap",
               }}
            >
               <button
                  onClick={() => mudarPagina(paginaAtual - 1)}
                  disabled={paginaAtual === 1}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
               >
                  {"<"}
               </button>

               {getPageNumbers().map((page, index) =>
                  typeof page === "number" ? (
                     <button
                        key={index}
                        onClick={() => mudarPagina(page)}
                        style={{
                           padding: "8px 12px",
                           cursor: "pointer",
                           backgroundColor:
                              paginaAtual === page ? "#28a745" : "#f0f0f0",
                           color: paginaAtual === page ? "white" : "black",
                           border: "1px solid #ccc",
                           borderRadius: "4px",
                        }}
                     >
                        {page}
                     </button>
                  ) : (
                     <button
                        key={index}
                        disabled
                        style={{
                           padding: "8px 12px",
                           cursor: "default",
                           backgroundColor: "transparent",
                           color: "black",
                           border: "none",
                        }}
                     >
                        {page}
                     </button>
                  )
               )}

               <button
                  onClick={() => mudarPagina(paginaAtual + 1)}
                  disabled={paginaAtual === totalPaginas}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
               >
                  {">"}
               </button>
            </div>
         )}
      </div>
   );
}
