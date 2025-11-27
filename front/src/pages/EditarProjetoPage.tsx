import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { handleApiError } from "../utils/errorHandler";
// @ts-ignore
import "../styles/Pages.css";

// Interface para Aluno vindo da API
interface Aluno {
   matriculaAluno: string;
   nomeAluno: string;
   idProjeto?: number | null;
}

export default function EditarProjetoPage() {
   const { id } = useParams();
   const navigate = useNavigate();

   const [nomeProjeto, setNomeProjeto] = useState("");
   const [descricaoProjeto, setDescricaoProjeto] = useState("");
   const [bannerProjeto, setBannerProjeto] = useState<File | null>(null);
   const [alunosSelecionados, setAlunosSelecionados] = useState<string[]>([]);

   // Lista completa de alunos disponíveis + alunos atuais deste projeto
   const [listaAlunos, setListaAlunos] = useState<Aluno[]>([]);

   const [mensagem, setMensagem] = useState("");
   const [erro, setErro] = useState("");
   const [carregando, setCarregando] = useState(true);

   // Carregar dados iniciais
   useEffect(() => {
      const fetchDados = async () => {
         try {
            setCarregando(true);
            // 1. Carregar Projeto Atual
            const resProjeto = await apiClient.get(`/projetos/${id}`);
            const proj = resProjeto.data;

            setNomeProjeto(proj.nomeProjeto);
            setDescricaoProjeto(proj.descricaoProjeto);
            // Pré-selecionar os alunos que já estão no projeto
            const alunosAtuaisIds = proj.alunos.map(
               (a: Aluno) => a.matriculaAluno
            );
            setAlunosSelecionados(alunosAtuaisIds);

            // 2. Carregar Alunos Disponíveis (sem projeto)
            const resAlunos = await apiClient.get("/alunos/disponiveis");
            const disponiveis = resAlunos.data;

            // 3. Combinar alunos atuais + disponíveis para o dropdown
            // (Senão os alunos atuais não aparecem na lista de opções)
            const atuais = proj.alunos;

            // Remove duplicatas caso a API de disponíveis traga algo estranho, mas em tese são conjuntos disjuntos
            // Vamos juntar tudo
            const todos = [...atuais, ...disponiveis];

            // Ordenar por nome
            todos.sort((a, b) => a.nomeAluno.localeCompare(b.nomeAluno));

            setListaAlunos(todos);
         } catch (error) {
            setErro("Erro ao carregar dados do projeto.");
            console.error(error);
         } finally {
            setCarregando(false);
         }
      };
      fetchDados();
   }, [id]);

   // Limpar o erro quando o número de alunos volta a ser válido (< 8)
   useEffect(() => {
      if (
         alunosSelecionados.length < 8 &&
         erro === "Máximo de 8 alunos permitido."
      ) {
         setErro("");
      }
   }, [alunosSelecionados, erro]);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         setBannerProjeto(e.target.files[0]);
      }
   };

   const toggleAluno = (matricula: string) => {
      if (alunosSelecionados.includes(matricula)) {
         setAlunosSelecionados(
            alunosSelecionados.filter((m) => m !== matricula)
         );
      } else {
         if (alunosSelecionados.length >= 8) {
            setErro("Máximo de 8 alunos permitido.");
            return;
         }
         setAlunosSelecionados([...alunosSelecionados, matricula]);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setMensagem("");
      setErro("");

      if (alunosSelecionados.length < 3) {
         setErro("Selecione pelo menos 3 alunos.");
         return;
      }

      const formData = new FormData();
      // Método spoofing para o Laravel entender PUT com arquivos
      formData.append("_method", "PUT");

      formData.append("nomeProjeto", nomeProjeto);
      formData.append("descricaoProjeto", descricaoProjeto);
      if (bannerProjeto) {
         formData.append("bannerProjeto", bannerProjeto);
      }

      alunosSelecionados.forEach((matricula) => {
         formData.append("alunos[]", matricula);
      });

      try {
         // Enviamos POST para a URL do recurso, mas com _method=PUT
         await apiClient.post(`/projetos/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
         });
         setMensagem("Projeto atualizado com sucesso!");
         // Redireciona após 1.5s
         setTimeout(() => navigate("/projetos"), 1500);
      } catch (error) {
         setErro(handleApiError(error, "Erro ao atualizar projeto."));
      }
   };

   if (carregando)
      return (
         <div className="page-container">
            <h2>Carregando...</h2>
         </div>
      );

   return (
      <div className="page-container">
         <h2>Editar Projeto</h2>
         {mensagem && <p className="success-message">{mensagem}</p>}
         {erro && (
            <div className="text-red-800 bg-red-100 border border-red-300 px-4 py-2 rounded mt-2 text-sm text-center">
               {erro}
            </div>
         )}

         <form onSubmit={handleSubmit} className="form-container">
            <div className="input-group">
               <label>Nome do Projeto:</label>
               <input
                  type="text"
                  value={nomeProjeto}
                  onChange={(e) => setNomeProjeto(e.target.value)}
                  required
                  className="input"
               />
            </div>

            <div className="input-group">
               <label>Descrição (250-500 palavras):</label>
               <textarea
                  value={descricaoProjeto}
                  onChange={(e) => setDescricaoProjeto(e.target.value)}
                  required
                  className="input"
                  rows={8}
               />
               <small>
                  {
                     descricaoProjeto.split(/\s+/).filter((w) => w.length > 0)
                        .length
                  }{" "}
                  palavras
               </small>
            </div>

            <div className="input-group">
               <label>
                  Banner (Opcional - Deixe vazio para manter o atual):
               </label>
               <input
                  type="file"
                  accept="image/*,.pdf,.pptx"
                  onChange={handleFileChange}
                  className="input"
               />
            </div>

            <div className="input-group">
               <label>Alunos Integrantes (3 a 8):</label>
               <div
                  className="checkbox-list"
                  style={{
                     maxHeight: "200px",
                     overflowY: "auto",
                     border: "1px solid #ccc",
                     padding: "10px",
                  }}
               >
                  {listaAlunos.length > 0 ? (
                     listaAlunos.map((aluno) => (
                        <div
                           key={aluno.matriculaAluno}
                           className="checkbox-item"
                        >
                           <input
                              type="checkbox"
                              id={`aluno-${aluno.matriculaAluno}`}
                              checked={alunosSelecionados.includes(
                                 aluno.matriculaAluno
                              )}
                              onChange={() => toggleAluno(aluno.matriculaAluno)}
                           />
                           <label htmlFor={`aluno-${aluno.matriculaAluno}`}>
                              {aluno.nomeAluno} ({aluno.matriculaAluno})
                           </label>
                        </div>
                     ))
                  ) : (
                     <p>Nenhum aluno disponível.</p>
                  )}
               </div>
               <small>Selecionados: {alunosSelecionados.length}</small>
            </div>

            <button type="submit" className="btn-submit">
               Salvar Alterações
            </button>
         </form>
      </div>
   );
}
