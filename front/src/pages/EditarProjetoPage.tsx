import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { handleApiError } from "../utils/errorHandler";
// @ts-ignore
import "../styles/Pages.css";

// Interface para Aluno
interface Aluno {
   matriculaAluno: string;
   nomeAluno: string;
   idProjeto?: number | null;
}

export default function EditarProjetoPage() {
   const { id } = useParams();
   const navigate = useNavigate();
   const fileInputRef = useRef<HTMLInputElement>(null);

   // Estados do formulário
   const [nomeProjeto, setNomeProjeto] = useState("");
   const [descricaoProjeto, setDescricaoProjeto] = useState("");
   const [descricaoErro, setDescricaoErro] = useState("");
   const [bannerProjeto, setBannerProjeto] = useState<File | null>(null);
   const [currentBanner, setCurrentBanner] = useState<string | null>(null);

   // --- Gestão de Alunos ---

   // 1. Alunos que JÁ estavam no projeto (Checkboxes)
   const [existingAlunos, setExistingAlunos] = useState<Aluno[]>([]);
   const [checkedExisting, setCheckedExisting] = useState<string[]>([]); // Matrículas marcadas

   // 2. Novos Alunos adicionados (Lista com Search)
   const [newAlunos, setNewAlunos] = useState<Aluno[]>([]);
   const [alunoSearch, setAlunoSearch] = useState("");
   const [searchResults, setSearchResults] = useState<Aluno[]>([]);
   const [showDropdown, setShowDropdown] = useState(false);
   const [isLoadingAlunos, setIsLoadingAlunos] = useState(false);

   // Estados de controle
   const [mensagem, setMensagem] = useState("");
   const [erro, setErro] = useState("");
   const [alunoErro, setAlunoErro] = useState("");
   const [carregando, setCarregando] = useState(true);

   // Carregar dados iniciais
   useEffect(() => {
      const fetchDados = async () => {
         try {
            setCarregando(true);
            const resProjeto = await apiClient.get(`/projetos/${id}`);
            const proj = resProjeto.data;

            setNomeProjeto(proj.nomeProjeto);
            setDescricaoProjeto(proj.descricaoProjeto);
            setCurrentBanner(proj.bannerProjeto);

            // Carrega alunos do projeto e marca todos por padrão
            const alunosAtuais = proj.alunos || [];
            alunosAtuais.sort((a: Aluno, b: Aluno) =>
               a.nomeAluno.localeCompare(b.nomeAluno)
            );
            setExistingAlunos(alunosAtuais);
            setCheckedExisting(
               alunosAtuais.map((a: Aluno) => a.matriculaAluno)
            );
         } catch (error) {
            setErro("Erro ao carregar dados do projeto.");
            console.error(error);
         } finally {
            setCarregando(false);
         }
      };
      fetchDados();
   }, [id]);

   // Contagem total para validação
   const totalAlunos = checkedExisting.length + newAlunos.length;

   // Limpar erro de quantidade de alunos
   useEffect(() => {
      if (
         totalAlunos <= 8 &&
         alunoErro === "Um projeto pode ter no máximo 8 alunos."
      ) {
         setAlunoErro("");
      }
   }, [totalAlunos, alunoErro]);

   // Busca de Alunos (Debounce)
   useEffect(() => {
      if (alunoSearch.trim() === "") {
         setSearchResults([]);
         setShowDropdown(false);
         setIsLoadingAlunos(false);
         return;
      }

      setIsLoadingAlunos(true);
      const timer = setTimeout(() => {
         apiClient
            .get(
               `/alunos/disponiveis?search=${encodeURIComponent(alunoSearch)}`
            )
            .then((response) => {
               // Filtra: não mostrar quem já está na lista de "Novos"
               const available = response.data.filter(
                  (a: Aluno) =>
                     !newAlunos.find(
                        (na) => na.matriculaAluno === a.matriculaAluno
                     )
               );
               setSearchResults(available);
               setShowDropdown(available.length > 0);
            })
            .catch((error) => {
               console.error("Erro ao buscar alunos", error);
            })
            .finally(() => setIsLoadingAlunos(false));
      }, 300);

      return () => clearTimeout(timer);
   }, [alunoSearch, newAlunos]);

   // --- Handlers ---

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         setBannerProjeto(e.target.files[0]);
      }
   };

   // Checkbox Handler (Alunos Existentes)
   const toggleExistingAluno = (matricula: string) => {
      setAlunoErro("");
      if (checkedExisting.includes(matricula)) {
         setCheckedExisting(checkedExisting.filter((id) => id !== matricula));
      } else {
         if (totalAlunos >= 8) {
            setAlunoErro("Um projeto pode ter no máximo 8 alunos.");
            return;
         }
         setCheckedExisting([...checkedExisting, matricula]);
      }
   };

   // Adicionar Novo Aluno (Lista)
   const handleAddNewAluno = (aluno: Aluno) => {
      setAlunoErro("");
      if (totalAlunos >= 8) {
         setAlunoErro("Um projeto pode ter no máximo 8 alunos.");
         return;
      }
      setNewAlunos([...newAlunos, aluno]);
      setAlunoSearch("");
      setSearchResults([]);
      setShowDropdown(false);
   };

   // Remover Novo Aluno (Lista)
   const handleRemoveNewAluno = (matricula: string) => {
      setNewAlunos(newAlunos.filter((a) => a.matriculaAluno !== matricula));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setMensagem("");
      setErro("");
      setDescricaoErro("");

      if (totalAlunos < 3) {
         setErro("O projeto deve ter no mínimo 3 alunos.");
         return;
      }

      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("nomeProjeto", nomeProjeto);
      formData.append("descricaoProjeto", descricaoProjeto);

      if (bannerProjeto) {
         formData.append("bannerProjeto", bannerProjeto);
      }

      // Combina as listas para envio:
      // 1. Matrículas dos checkboxes marcados
      checkedExisting.forEach((matricula) => {
         formData.append("alunos[]", matricula);
      });
      // 2. Matrículas dos novos alunos adicionados
      newAlunos.forEach((aluno) => {
         formData.append("alunos[]", aluno.matriculaAluno);
      });

      try {
         await apiClient.post(`/projetos/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
         });
         setMensagem("Projeto atualizado com sucesso!");
         setTimeout(() => navigate("/projetos"), 1500);
      } catch (error: any) {
         setErro(handleApiError(error, "Erro ao atualizar projeto."));
         if (error.response?.data?.errors?.descricaoProjeto) {
            setDescricaoErro(error.response.data.errors.descricaoProjeto[0]);
         }
      }
   };

   if (carregando)
      return (
         <div className="page-container">
            <h2>Carregando...</h2>
         </div>
      );

   return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
         <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
               Editar Projeto
            </h2>

            {mensagem && (
               <p className="mb-4 text-green-800 bg-green-100 border border-green-300 px-4 py-2 rounded text-sm text-center">
                  {mensagem}
               </p>
            )}
            {erro && (
               <div className="mb-4 text-red-800 bg-red-100 border border-red-300 px-4 py-2 rounded text-sm text-center">
                  {erro}
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
               {/* Nome */}
               <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                     Nome do Projeto
                  </label>
                  <input
                     type="text"
                     value={nomeProjeto}
                     onChange={(e) => setNomeProjeto(e.target.value)}
                     required
                     className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
               </div>

               {/* Descrição */}
               <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                     Descrição (entre 250 e 500 palavras)
                  </label>
                  <textarea
                     value={descricaoProjeto}
                     onChange={(e) => {
                        setDescricaoProjeto(e.target.value);
                        setDescricaoErro("");
                     }}
                     required
                     rows={6}
                     className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                  />
                  <small className="text-gray-500 mt-1">
                     {
                        descricaoProjeto
                           .split(/\s+/)
                           .filter((w) => w.length > 0).length
                     }{" "}
                     palavras
                  </small>
                  {descricaoErro && (
                     <p className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
                        {descricaoErro}
                     </p>
                  )}
               </div>

               {/* Banner */}
               <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                     Banner do Projeto
                  </label>
                  <input
                     type="file"
                     id="bannerInput"
                     accept=".jpeg, .jpg, .png, .pdf, .pptx"
                     onChange={handleFileChange}
                     ref={fileInputRef}
                     className="hidden"
                  />

                  <label
                     htmlFor="bannerInput"
                     className="cursor-pointer px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 text-base font-medium w-fit inline-block"
                  >
                     Selecionar arquivo
                  </label>

                  {/* Banner Atual */}
                  {currentBanner && !bannerProjeto && (
                     <div className="mt-2 bg-blue-50 border border-blue-200 rounded p-3 flex items-center justify-between">
                        <div>
                           <p className="text-xs text-blue-600 font-bold uppercase">
                              Arquivo Atual
                           </p>
                           <p className="text-sm text-gray-700 truncate">
                              {currentBanner.split("/").pop()}
                           </p>
                        </div>
                        <button
                           type="button"
                           onClick={() => setCurrentBanner(null)}
                           className="ml-4 text-sm text-red-600 hover:text-red-800"
                        >
                           Remover banner
                        </button>
                     </div>
                  )}

                  {/* Novo Banner Selecionado */}
                  {bannerProjeto && (
                     <div className="mt-2 bg-gray-50 border border-gray-200 rounded p-3 flex items-center justify-between">
                        <div>
                           <p className="text-xs text-green-600 font-bold uppercase">
                              Novo Arquivo
                           </p>
                           <p className="text-sm text-gray-700 truncate">
                              {bannerProjeto.name}
                           </p>
                        </div>
                        <button
                           type="button"
                           onClick={() => {
                              setBannerProjeto(null);
                              if (fileInputRef.current)
                                 fileInputRef.current.value = "";
                           }}
                           className="ml-4 text-sm text-red-600 hover:text-red-800"
                        >
                           Remover banner
                        </button>
                     </div>
                  )}
               </div>

               {/* --- Seção de Alunos --- */}
               <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                     Alunos Integrantes (3 a 8)
                  </label>
                  {alunoErro && (
                     <p className="mb-2 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
                        {alunoErro}
                     </p>
                  )}

                  {/* 1. Lista de Alunos Já no Projeto (Checkboxes) */}
                  {existingAlunos.length > 0 && (
                     <div className="mb-4">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                           Alunos do Projeto
                        </p>
                        <div className="border border-gray-200 rounded-md bg-white divide-y divide-gray-200 max-h-40 overflow-y-auto">
                           {existingAlunos.map((aluno) => (
                              <div
                                 key={aluno.matriculaAluno}
                                 className="flex items-center px-4 py-3 hover:bg-gray-50"
                              >
                                 <input
                                    type="checkbox"
                                    id={`existing-${aluno.matriculaAluno}`}
                                    checked={checkedExisting.includes(
                                       aluno.matriculaAluno
                                    )}
                                    onChange={() =>
                                       toggleExistingAluno(aluno.matriculaAluno)
                                    }
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                                 />
                                 <label
                                    htmlFor={`existing-${aluno.matriculaAluno}`}
                                    className="ml-3 flex-1 cursor-pointer"
                                 >
                                    <span className="text-sm font-medium text-gray-800">
                                       {aluno.nomeAluno}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">
                                       ({aluno.matriculaAluno})
                                    </span>
                                 </label>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* 2. Adicionar Novos Alunos (Search + List) */}
                  <div className="relative mb-2">
                     <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                        Adicionar Novos Alunos
                     </p>
                     <input
                        type="text"
                        placeholder="Buscar aluno por nome ou matrícula..."
                        value={alunoSearch}
                        onChange={(e) => setAlunoSearch(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                     />
                     {isLoadingAlunos && (
                        <p className="absolute right-2 top-8 text-xs text-gray-500">
                           Buscando...
                        </p>
                     )}

                     {showDropdown && searchResults.length > 0 && (
                        <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow max-h-56 overflow-auto">
                           {searchResults.map((aluno) => (
                              <li
                                 key={aluno.matriculaAluno}
                                 onClick={() => handleAddNewAluno(aluno)}
                                 className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm flex justify-between items-center"
                              >
                                 <span>{aluno.nomeAluno}</span>
                                 <span className="text-xs text-gray-500">
                                    ({aluno.matriculaAluno})
                                 </span>
                              </li>
                           ))}
                        </ul>
                     )}
                  </div>

                  {/* Lista de Novos Alunos Adicionados */}
                  {newAlunos.length > 0 && (
                     <div className="border border-gray-200 rounded-md bg-gray-50">
                        <ul className="divide-y divide-gray-200">
                           {newAlunos.map((aluno) => (
                              <li
                                 key={aluno.matriculaAluno}
                                 className="flex items-center justify-between px-4 py-3"
                              >
                                 <div>
                                    <p className="text-sm font-medium text-gray-800">
                                       {aluno.nomeAluno}{" "}
                                       <span className="text-xs text-green-600 font-bold">
                                          (Novo)
                                       </span>
                                    </p>
                                    <p className="text-xs text-gray-500">
                                       {aluno.matriculaAluno}
                                    </p>
                                 </div>
                                 <button
                                    type="button"
                                    onClick={() =>
                                       handleRemoveNewAluno(
                                          aluno.matriculaAluno
                                       )
                                    }
                                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                                 >
                                    Remover
                                 </button>
                              </li>
                           ))}
                        </ul>
                     </div>
                  )}

                  <div className="mt-2 text-right">
                     <small className="text-gray-500">
                        Total selecionado: <strong>{totalAlunos}</strong> (Mín:
                        3, Máx: 8)
                     </small>
                  </div>
               </div>

               {/* Ações */}
               <div className="pt-4">
                  <button
                     type="submit"
                     className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition shadow-sm"
                  >
                     Salvar Alterações
                  </button>
                  <button
                     type="button"
                     onClick={() => navigate("/projetos")}
                     className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-md font-medium transition"
                  >
                     Cancelar
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
