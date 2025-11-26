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
   const [loading, setLoading] = useState(true);
   const [erro, setErro] = useState("");
   const [sucesso, setSucesso] = useState("");

   // Estados do formulário
   const [notas, setNotas] = useState<number[]>(new Array(5).fill(0));
   const [observacoes, setObservacoes] = useState("");
   const [enviando, setEnviando] = useState(false);

   // Estados de Nota Individual por Aluno
   // Armazena quem está com o modo de edição ativado: { 'matricula': true/false }
   const [editandoNotaAluno, setEditandoNotaAluno] = useState<{
      [key: string]: boolean;
   }>({});
   // Armazena a nota individual (0 a 10) definida no slider do aluno: { 'matricula': 8 }
   const [notasIndividuais, setNotasIndividuais] = useState<{
      [key: string]: number;
   }>({});

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

   // Calcula a média do projeto (0-10) baseada nos 5 critérios
   const calcularMediaProjeto = () => {
      const soma = notas.reduce((acc, curr) => acc + curr, 0);
      return soma / notas.length;
   };

   // Retorna a nota final (0-10) para um aluno específico
   const getNotaFinalAluno = (matricula: string) => {
      if (editandoNotaAluno[matricula]) {
         return notasIndividuais[matricula] || 0;
      }
      return calcularMediaProjeto();
   };

   const toggleEdicaoAluno = (matricula: string) => {
      setEditandoNotaAluno((prev) => {
         const novoEstado = !prev[matricula];

         // Se ativou a edição, inicializa o slider com a nota atual do projeto
         if (novoEstado) {
            setNotasIndividuais((notasPrev) => ({
               ...notasPrev,
               [matricula]: calcularMediaProjeto(),
            }));
         }

         return { ...prev, [matricula]: novoEstado };
      });
   };

   const handleNotaIndividualChange = (matricula: string, valor: string) => {
      setNotasIndividuais((prev) => ({
         ...prev,
         [matricula]: parseInt(valor, 10),
      }));
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
         // Prepara o objeto notasAlunos
         // Enviaremos explicitamente a nota calculada para todos os alunos,
         // seja ela a do projeto ou a personalizada.
         const notasAlunosPayload: { [key: string]: number } = {};
         projeto?.alunos.forEach((aluno) => {
            // Obtém a nota na escala 0-10
            const nota0to10 = getNotaFinalAluno(aluno.matriculaAluno);

            // Converte para escala 0-100 para enviar ao backend
            notasAlunosPayload[aluno.matriculaAluno] = nota0to10 * 10;
         });

         const payload = {
            matriculaSiape: selectedAvaliadorObj.matriculaSiape,
            notas: notas,
            notasAlunos: notasAlunosPayload,
            observacoes: observacoes,
         };

         await apiClient.post(`/projetos/${id}/avaliar`, payload);
         setSucesso("Avaliação registrada com sucesso!");

         // Reset
         setSelectedAvaliadorObj(null);
         setAvaliadorSearch("");
         setNotas(new Array(5).fill(0));
         setEditandoNotaAluno({});
         setNotasIndividuais({});
         setObservacoes("");

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

   // Para exibição apenas (com 1 casa decimal)
   const mediaProjetoAtual = calcularMediaProjeto().toFixed(1);

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

               {/* Modificação de Nota Individual */}
               <div className="attendance-section">
                  <div
                     className="attendance-title"
                     style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                     }}
                  >
                     <span>Modificação de Nota Individual</span>
                     <span
                        style={{
                           fontSize: "0.8rem",
                           fontWeight: "normal",
                           color: "#666",
                        }}
                     >
                        Nota Base do Projeto:{" "}
                        <strong>{mediaProjetoAtual}</strong>
                     </span>
                  </div>

                  {projeto.alunos && projeto.alunos.length > 0 ? (
                     <div
                        className="students-list"
                        style={{
                           display: "flex",
                           flexDirection: "column",
                           gap: "15px",
                        }}
                     >
                        {projeto.alunos.map((aluno) => {
                           const isEditing =
                              editandoNotaAluno[aluno.matriculaAluno];
                           const notaFinal = getNotaFinalAluno(
                              aluno.matriculaAluno
                           );

                           return (
                              <div
                                 key={aluno.matriculaAluno}
                                 className="student-grade-item"
                                 style={{
                                    border: "1px solid #eee",
                                    padding: "10px",
                                    borderRadius: "6px",
                                    backgroundColor: isEditing
                                       ? "#fffaf0"
                                       : "#fff",
                                 }}
                              >
                                 <div
                                    style={{
                                       display: "flex",
                                       justifyContent: "space-between",
                                       alignItems: "center",
                                       marginBottom: isEditing ? "10px" : "0",
                                    }}
                                 >
                                    <span
                                       className="student-name"
                                       style={{ fontWeight: "500" }}
                                    >
                                       {aluno.nomeAluno}
                                    </span>

                                    <div
                                       style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "10px",
                                       }}
                                    >
                                       <span
                                          style={{
                                             fontWeight: "bold",
                                             color: isEditing
                                                ? "#d35400"
                                                : "#2d6a4f",
                                          }}
                                       >
                                          Nota: {notaFinal}
                                       </span>
                                       <button
                                          type="button"
                                          onClick={() =>
                                             toggleEdicaoAluno(
                                                aluno.matriculaAluno
                                             )
                                          }
                                          style={{
                                             padding: "4px 8px",
                                             fontSize: "0.8rem",
                                             cursor: "pointer",
                                             backgroundColor: isEditing
                                                ? "#e74c3c"
                                                : "#28a745",
                                             color: "white",
                                             border: "none",
                                             borderRadius: "4px",
                                          }}
                                       >
                                          {isEditing
                                             ? "Cancelar / Usar Média"
                                             : "Alterar Nota"}
                                       </button>
                                    </div>
                                 </div>

                                 {isEditing && (
                                    <div
                                       className="student-slider"
                                       style={{ paddingTop: "5px" }}
                                    >
                                       <input
                                          type="range"
                                          min="0"
                                          max="10"
                                          step="1"
                                          value={
                                             notasIndividuais[
                                                aluno.matriculaAluno
                                             ] || 0
                                          }
                                          onChange={(e) =>
                                             handleNotaIndividualChange(
                                                aluno.matriculaAluno,
                                                e.target.value
                                             )
                                          }
                                          style={{ width: "100%" }}
                                       />
                                       <div
                                          style={{
                                             display: "flex",
                                             justifyContent: "space-between",
                                             fontSize: "0.75rem",
                                             color: "#888",
                                          }}
                                       >
                                          <span>0 (Falta/Mínimo)</span>
                                          <span>10 (Máximo)</span>
                                       </div>
                                    </div>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  ) : (
                     <p style={{ color: "#666", fontStyle: "italic" }}>
                        Nenhum aluno vinculado.
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
                        style={{ resize: "none" }}
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
