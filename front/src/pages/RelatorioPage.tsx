import { useState, useEffect } from "react";
import { Download, FileText, Users, GraduationCap } from "lucide-react";
import apiClient from "../apiClient";
import { handleApiError } from "../utils/errorHandler";

interface AlunoReport {
   nomeAluno: string;
   notaExaminacao: string | null;
   statusAvaliacao: "pendente" | "em_andamento" | "concluido";
   qtdAvaliacoes: number;
}

interface TurmaReport {
   idTurma: number;
   numeroTurma: number;
   curso: string;
   alunos: AlunoReport[];
}

export default function RelatoriosPage() {
   // Estados de Busca e Dados
   const [turmaSearch, setTurmaSearch] = useState("");
   const [turmaSearchDebounced, setTurmaSearchDebounced] = useState("");
   const [searchResults, setSearchResults] = useState<TurmaReport[]>([]);
   const [isSearching, setIsSearching] = useState(false);
   const [erro, setErro] = useState("");

   // Estados de Paginação
   const [paginaAtual, setPaginaAtual] = useState(1);
   const turmasPorPagina = 10;

   // Efeito para buscar turmas (com debounce)
   useEffect(() => {
      if (turmaSearch.trim() !== "") {
         setIsSearching(true);
      } else {
         setIsSearching(false);
      }

      const timer = setTimeout(() => {
         setTurmaSearchDebounced(turmaSearch);
         setPaginaAtual(1);
         setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
   }, [turmaSearch]);

   useEffect(() => {
      if (turmaSearchDebounced.trim() === "") {
         setSearchResults([]);
         return;
      }

      apiClient
         .get(`/relatorios?search=${encodeURIComponent(turmaSearchDebounced)}`)
         .then((response) => setSearchResults(response.data))
         .catch((error) =>
            setErro(handleApiError(error, "Falha ao carregar os relatórios."))
         );
   }, [turmaSearchDebounced]);

   // Lógica de Paginação (Idêntica ao ProjectsPage)
   const indexUltimaTurma = paginaAtual * turmasPorPagina;
   const indexPrimeiraTurma = indexUltimaTurma - turmasPorPagina;
   const turmasAtuais = searchResults.slice(
      indexPrimeiraTurma,
      indexUltimaTurma
   );
   const totalPaginas = Math.ceil(searchResults.length / turmasPorPagina);

   const mudarPagina = (numeroPagina: number) => setPaginaAtual(numeroPagina);

   const getPageNumbers = () => {
      const pageNumbers: (number | string)[] = [];
      const maxPagesToShow = 12;

      if (totalPaginas <= maxPagesToShow) {
         for (let i = 1; i <= totalPaginas; i++) {
            pageNumbers.push(i);
         }
      } else {
         const slots = maxPagesToShow - 2;
         if (paginaAtual <= slots) {
            for (let i = 1; i <= slots + 1; i++) {
               pageNumbers.push(i);
            }
            pageNumbers.push("...");
            pageNumbers.push(totalPaginas);
         } else if (paginaAtual > totalPaginas - slots) {
            pageNumbers.push(1);
            pageNumbers.push("...");
            for (let i = totalPaginas - slots; i <= totalPaginas; i++) {
               pageNumbers.push(i);
            }
         } else {
            pageNumbers.push(1);
            pageNumbers.push("...");
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

   // Função de download do .txt
   const handleDownloadReport = (turma: TurmaReport) => {
      const { numeroTurma, curso, alunos } = turma;

      let content = `Turma ${numeroTurma} - ${curso}\n\n`;

      if (alunos.length === 0) {
         content += "Nenhum aluno registrado nesta turma.\n";
      } else {
         alunos.forEach((aluno) => {
            let notaDisplay = "N/D";

            // Lógica para exibição no TXT
            if (aluno.statusAvaliacao === "pendente") {
               notaDisplay = "N/D";
            } else if (aluno.statusAvaliacao === "em_andamento") {
               // Se tem 1 nota, mostra a nota com aviso
               notaDisplay = `${
                  aluno.notaExaminacao || "N/D"
               } (avaliação em andamento)`;
            } else if (aluno.statusAvaliacao === "concluido") {
               // Se concluído (2 avaliações), mostra só a nota
               notaDisplay = aluno.notaExaminacao || "N/D";
            }

            content += `${aluno.nomeAluno} - Nota: ${notaDisplay}\n`;
         });
      }

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const filename = `Relatório de Notas da Turma ${numeroTurma}.txt`;

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
   };

   return (
      <div className="p-6 md:p-10 min-h-screen bg-gray-50">
         <h2 className="text-3xl font-bold mb-6 text-green-700 flex items-center gap-2">
            <FileText /> Relatório de Notas
         </h2>

         <div className="card bg-white shadow-xl p-6 mb-8 border-t-4 border-green-600">
            <br />
            <h3 className="text-xl font-semibold mb-4">Buscar Turma</h3>
            <form className="flex flex-col md:flex-row gap-4">
               <input
                  type="text"
                  placeholder="Digite o número da turma ou nome do curso..."
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={turmaSearch}
                  onChange={(e) => setTurmaSearch(e.target.value)}
               />
            </form>
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

         <div className="flex flex-col gap-4">
            {isSearching ? (
               <div className="flex justify-center items-center p-12">
                  <span className="loading loading-spinner loading-lg text-success"></span>
               </div>
            ) : !isSearching &&
              turmaSearchDebounced !== "" &&
              searchResults.length === 0 ? (
               <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow">
                  <p>Nenhuma turma encontrada com os critérios de busca.</p>
               </div>
            ) : (
               turmasAtuais.map((turma) => (
                  <div
                     key={turma.idTurma}
                     className="card bg-white shadow hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden"
                  >
                     <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-start gap-4 flex-1">
                           <div className="bg-green-100 p-3 rounded-lg text-green-700">
                              <Users size={24} />
                           </div>
                           <div>
                              <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                 Turma {turma.numeroTurma}
                              </h4>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-sm text-gray-600">
                                 <span className="flex items-center gap-1">
                                    <GraduationCap size={16} />
                                    {turma.curso}
                                 </span>
                                 <span className="hidden sm:inline text-gray-300">
                                    |
                                 </span>
                                 <span>
                                    {turma.alunos.length} Aluno(s)
                                    matriculado(s)
                                 </span>
                              </div>
                           </div>
                        </div>

                        <button
                           onClick={() => handleDownloadReport(turma)}
                           className="btn bg-green-600 hover:bg-green-700 text-white border-none gap-2 w-full md:w-auto shadow-sm rounded-md"
                           title={`Baixar Relatório da Turma ${turma.numeroTurma}`}
                        >
                           <Download size={18} />
                           Baixar Relatório
                        </button>
                     </div>
                  </div>
               ))
            )}
         </div>
         {/* Controles de Paginação */}
         {totalPaginas > 1 && (
            <div
               className="pagination"
               style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "5px",
                  marginTop: "30px",
                  flexWrap: "wrap",
               }}
            >
               <button
                  onClick={() => mudarPagina(paginaAtual - 1)}
                  disabled={paginaAtual === 1}
                  style={{
                     padding: "8px 12px",
                     cursor: paginaAtual === 1 ? "default" : "pointer",
                     opacity: paginaAtual === 1 ? 0.5 : 1,
                  }}
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
                  style={{
                     padding: "8px 12px",
                     cursor:
                        paginaAtual === totalPaginas ? "default" : "pointer",
                     opacity: paginaAtual === totalPaginas ? 0.5 : 1,
                  }}
               >
                  {">"}
               </button>
            </div>
         )}
      </div>
   );
}
