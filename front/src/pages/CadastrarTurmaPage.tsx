import React, { useState } from "react";
import apiClient from "../apiClient";
import { handleApiError } from "../utils/errorHandler";

export default function CadastrarTurmaPage() {
   const [formData, setFormData] = useState({
      numeroTurma: "",
      curso: "",
   });
   const [erro, setErro] = useState("");
   const [sucesso, setSucesso] = useState("");

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      setErro("");
      setSucesso("");

      const dataToSend = {
         ...formData,
         numeroTurma: parseInt(formData.numeroTurma, 10),
      };

      try {
         await apiClient.post("/turmas", dataToSend);
         setSucesso("Turma cadastrada com sucesso!");
         setFormData({ numeroTurma: "", curso: "" });
      } catch (error) {
         console.error("Erro ao cadastrar turma", error);
         setErro(
            handleApiError(error, "Ocorreu um erro ao cadastrar a turma.")
         );
      }
   };

   return (
      <div className="min-h-screen w-full flex items-start justify-center bg-gray-100 px-4 pt-16">
         <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
                  Cadastrar Turma
               </h2>

               <div className="flex flex-col">
                  <label
                     htmlFor="numeroTurma"
                     className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                     Número da Turma
                  </label>
                  <input
                     type="number"
                     id="numeroTurma"
                     name="numeroTurma"
                     value={formData.numeroTurma}
                     onChange={handleChange}
                     required
                     className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
               </div>

               <div className="flex flex-col">
                  <label
                     htmlFor="curso"
                     className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                     Curso
                  </label>
                  <select
                     id="curso"
                     name="curso"
                     value={formData.curso}
                     onChange={handleChange}
                     required
                     className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                     <option value="" disabled>
                        Selecione o curso
                     </option>
                     <option value="Informática">Informática</option>
                     <option value="Agropecuária">Agropecuária</option>
                     <option value="Meio Ambiente">Meio Ambiente</option>
                     <option value="Agroindústria">Agroindústria</option>
                  </select>
               </div>

               {erro && (
                  <div className="text-red-700 bg-red-100 border border-red-300 px-3 py-2 rounded-lg text-sm text-center">
                     {erro}
                  </div>
               )}

               {sucesso && (
                  <p className="text-green-700 bg-green-100 border border-green-300 px-3 py-2 rounded-lg text-sm text-center">
                     {sucesso}
                  </p>
               )}

               <button
                  type="submit"
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
               >
                  Cadastrar
               </button>
            </form>
         </div>
      </div>
   );
}
