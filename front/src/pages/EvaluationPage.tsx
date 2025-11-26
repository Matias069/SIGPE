import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { handleApiError } from "../utils/errorHandler";
// @ts-ignore: Importação de CSS
import "../styles/Pages.css";

const criteriosFixos = [
   "Qualidade na escrita e organização",
   "Desenvolvimento do tema",
   "Qualidade da apresentação",
   "Domínio do conteúdo",
   "Consistência na arguição",
];

// Tipagem para os dados que virão da API
type Aluno = {
   matriculaAluno: string;
   nomeAluno: string;
};

type Orientador = {
   nomeOrientador: string;
};

type ProjetoDetalhado = {
   idProjeto: number;
   nomeProjeto: string;
   orientador: Orientador;
   alunos: Aluno[];
};

type Avaliador = {
   matriculaSiape: string;
   nomeAvaliador: string;
};

export default function EvaluationPage() {
   const { id } = useParams();
   const navigate = useNavigate();
   const [projeto, setProjeto] = useState<ProjetoDetalhado | null>(null);
   const [avaliadores, setAvaliadores] = useState<Avaliador[]>([]);
   const [loading, setLoading] = useState(true);
   const [erro, setErro] = useState("");
   const [sucesso, setSucesso] = useState("");

   // Estados do formulário
   const [selectedAvaliador, setSelectedAvaliador] = useState("");
   const [notas, setNotas] = useState<number[]>(new Array(5).fill(0));
   const [faltas, setFaltas] = useState<Set<string>>(new Set()); // Armazena as matrículas dos alunos que faltaram
   const [observacoes, setObservacoes] = useState("");
   const [enviando, setEnviando] = useState(false);

   // Estados da Busca de Avaliador
   const [avaliadorSearch, setAvaliadorSearch] = useState("");
   const [avaliadoresEncontrados, setAvaliadoresEncontrados] = useState<
      Avaliador[]
   >([]);
   const [selectedAvaliadorObj, setSelectedAvaliadorObj] =
      useState<Avaliador | null>(null);
   const [showDropdown, setShowDropdown] = useState(false);
   const [isSearchingAvaliador, setIsSearchingAvaliador] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         try {
            setLoading(true);

            // Carrega projeto
            const projResponse = await apiClient.get(`/projetos/${id}`);
            setProjeto(projResponse.data);
         } catch (error) {
            console.error("Erro ao carregar projeto", error);
            setErro(
               handleApiError(error, "Erro ao carregar dados do projeto.")
            );
         } finally {
            setLoading(false);
         }
      };

      if (id) fetchData();
   }, [id]);

   // Efeito para busca dinâmica de avaliadores (Debounce)
   useEffect(() => {
      if (avaliadorSearch.trim() === "") {
         setAvaliadoresEncontrados([]);
         setShowDropdown(false);
         setIsSearchingAvaliador(false);
         return;
      }

      // Se já selecionamos um, não busca novamente enquanto o texto for igual ao nome dele
      if (
         selectedAvaliadorObj &&
         avaliadorSearch === selectedAvaliadorObj.nomeAvaliador
      ) {
         return;
      }

      setIsSearchingAvaliador(true);
      const timer = setTimeout(() => {
         apiClient
            .get(`/avaliadores?search=${encodeURIComponent(avaliadorSearch)}`)
            .then((response) => {
               setAvaliadoresEncontrados(response.data);
               setShowDropdown(response.data.length > 0);
            })
            .catch((error) =>
               console.error("Erro ao buscar avaliadores", error)
            )
            .finally(() => setIsSearchingAvaliador(false));
      }, 300);

      return () => clearTimeout(timer);
   }, [avaliadorSearch, selectedAvaliadorObj]);

   const handleSelectAvaliador = (av: Avaliador) => {
      setSelectedAvaliadorObj(av);
      setAvaliadorSearch(av.nomeAvaliador); // Preenche o input com o nome
      setShowDropdown(false);
   };

   const handleNotaChange = (index: number, novaNota: string) => {
      const novasNotas = [...notas];
      novasNotas[index] = parseInt(novaNota, 10);
      setNotas(novasNotas);
   };

   const toggleFalta = (matricula: string) => {
      const novasFaltas = new Set(faltas);
      if (novasFaltas.has(matricula)) {
         novasFaltas.delete(matricula);
      } else {
         novasFaltas.add(matricula);
      }
      setFaltas(novasFaltas);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErro("");
      setSucesso("");

      if (!selectedAvaliadorObj) {
         setErro("Por favor, pesquise e selecione um avaliador.");
         return;
      }

      try {
         setEnviando(true);
         const payload = {
            matriculaSiape: selectedAvaliadorObj.matriculaSiape,
            notas: notas,
            alunosFaltantes: Array.from(faltas),
            observacoes: observacoes,
         };

         await apiClient.post(`/projetos/${id}/avaliar`, payload);
         setSucesso("Avaliação registrada com sucesso!");

         // Reset dos campos
         setSelectedAvaliadorObj(null);
         setAvaliadorSearch("");
         setNotas(new Array(5).fill(0));
         setFaltas(new Set());
         setObservacoes("");

         // Navega para os projetos após avaliar
         navigate("/projetos");
      } catch (error) {
         console.error("Erro ao enviar avaliação", error);
         setErro(handleApiError(error, "Erro ao registrar a avaliação."));
      } finally {
         setEnviando(false);
      }
   };

   if (loading)
      return (
         <div className="page-container">
            <h2>Carregando ficha de avaliação...</h2>
         </div>
      );
   if (!projeto)
      return (
         <div className="page-container">
            <h2>Projeto não encontrado.</h2>
         </div>
      );

   return (
      <div className="evaluation-container">
         <div className="evaluation-paper">
            <h2 className="evaluation-title">Ficha de Avaliação</h2>

            <form onSubmit={handleSubmit}>
               {/* Seleção do Avaliador */}
               <div
                  className="evaluation-header"
                  style={{ marginBottom: "20px" }}
               >
                  <div className="header-row">
                     <label
                        className="header-label"
                        style={{ marginBottom: "5px", display: "block" }}
                     >
                        Pesquisar Avaliador (Nome ou SIAPE):
                     </label>

                     <div style={{ position: "relative", width: "100%" }}>
                        <input
                           type="text"
                           className="input-underline"
                           placeholder="Digite para buscar..."
                           value={avaliadorSearch}
                           onChange={(e) => {
                              setAvaliadorSearch(e.target.value);
                              // Se alterar o texto, reseta a seleção atual para forçar nova escolha
                              if (
                                 selectedAvaliadorObj &&
                                 e.target.value !==
                                    selectedAvaliadorObj.nomeAvaliador
                              ) {
                                 setSelectedAvaliadorObj(null);
                              }
                           }}
                           onFocus={() => {
                              if (avaliadoresEncontrados.length > 0)
                                 setShowDropdown(true);
                           }}
                           // Pequeno delay no onBlur para permitir o clique no item da lista
                           onBlur={() =>
                              setTimeout(() => setShowDropdown(false), 200)
                           }
                           style={{
                              width: "100%",
                              padding: "10px",
                              fontSize: "1rem",
                              fontWeight: "normal",
                           }}
                           required
                           autoComplete="off"
                        />

                        {isSearchingAvaliador && (
                           <span
                              style={{
                                 position: "absolute",
                                 right: "10px",
                                 top: "10px",
                                 color: "#999",
                                 fontSize: "0.8rem",
                              }}
                           >
                              Buscando...
                           </span>
                        )}

                        {showDropdown && (
                           <ul
                              style={{
                                 position: "absolute",
                                 top: "100%",
                                 left: 0,
                                 width: "100%",
                                 maxHeight: "200px",
                                 overflowY: "auto",
                                 backgroundColor: "white",
                                 border: "1px solid #ccc",
                                 borderRadius: "0 0 4px 4px",
                                 zIndex: 1000,
                                 listStyle: "none",
                                 padding: 0,
                                 margin: 0,
                                 boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                              }}
                           >
                              {avaliadoresEncontrados.map((av) => (
                                 <li
                                    key={av.matriculaSiape}
                                    onClick={() => handleSelectAvaliador(av)}
                                    style={{
                                       padding: "10px",
                                       cursor: "pointer",
                                       borderBottom: "1px solid #eee",
                                    }}
                                    onMouseEnter={(e) =>
                                       (e.currentTarget.style.backgroundColor =
                                          "#f0f0f0")
                                    }
                                    onMouseLeave={(e) =>
                                       (e.currentTarget.style.backgroundColor =
                                          "white")
                                    }
                                 >
                                    <strong>{av.nomeAvaliador}</strong>{" "}
                                    <span
                                       style={{
                                          fontSize: "0.85em",
                                          color: "#666",
                                       }}
                                    >
                                       ({av.matriculaSiape})
                                    </span>
                                 </li>
                              ))}
                           </ul>
                        )}
                     </div>
                  </div>
               </div>

               {/* Cabeçalho */}
               <div className="evaluation-header">
                  <div className="header-row">
                     <div className="input-group-underline">
                        <label className="header-label">Nome do Projeto</label>
                        <input
                           type="text"
                           className="input-underline read-only-field"
                           value={projeto.nomeProjeto}
                           readOnly
                           style={{ fontWeight: "bold", color: "#333" }}
                        />
                     </div>
                  </div>

                  <div className="header-row">
                     <div className="input-group-underline">
                        <label className="header-label">
                           Professor Orientador
                        </label>
                        <input
                           type="text"
                           className="input-underline read-only-field"
                           value={projeto.orientador.nomeOrientador}
                           readOnly
                           style={{ fontWeight: "bold", color: "#333" }}
                        />
                     </div>
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
               </div>

               {/* Critérios com Sliders */}
               <div className="criteria-list">
                  {criteriosFixos.map((criterio, index) => (
                     <div key={index} className="criteria-item">
                        <div className="criteria-header">
                           <span className="criteria-name">{criterio}</span>
                           <span className="criteria-score">
                              {notas[index]}
                           </span>
                        </div>
                        <div className="slider-container">
                           <input
                              type="range"
                              min="0"
                              max="10"
                              step="1"
                              value={notas[index]}
                              onChange={(e) =>
                                 handleNotaChange(index, e.target.value)
                              }
                              className="range-slider"
                           />
                        </div>
                        <div className="slider-scale">
                           {[...Array(11)].map((_, i) => (
                              <span key={i}>{i}</span>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>

               {/* Checkbox de Presença */}
               <div className="attendance-section">
                  <div className="attendance-title">Registro de Ausências</div>

                  {projeto.alunos && projeto.alunos.length > 0 ? (
                     <div className="students-grid">
                        {projeto.alunos.map((aluno) => (
                           <label
                              key={aluno.matriculaAluno}
                              className="checkbox-wrapper"
                           >
                              <input
                                 type="checkbox"
                                 checked={faltas.has(aluno.matriculaAluno)}
                                 onChange={() =>
                                    toggleFalta(aluno.matriculaAluno)
                                 }
                              />
                              <span className="student-name">
                                 {aluno.nomeAluno}
                              </span>
                           </label>
                        ))}
                     </div>
                  ) : (
                     <p style={{ color: "#666", fontStyle: "italic" }}>
                        Nenhum aluno vinculado a este projeto.
                     </p>
                  )}
               </div>

               {/* Observações e Botões */}
               <div className="evaluation-footer">
                  <div className="comments-section">
                     <label style={{ fontWeight: "bold", color: "#2d6a4f" }}>
                        Observações Adicionais:
                     </label>
                     <textarea
                        rows={4}
                        placeholder="Digite suas considerações..."
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                     ></textarea>
                  </div>

                  <div className="form-actions">
                     <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => navigate("/")}
                     >
                        Cancelar
                     </button>

                     {sucesso && <p className="success-message">{sucesso}</p>}

                     <button
                        type="submit"
                        className="btn-submit"
                        disabled={enviando}
                     >
                        {enviando ? "Enviando..." : "Enviar Avaliação"}
                     </button>
                  </div>
               </div>
            </form>
         </div>
      </div>
   );
}
