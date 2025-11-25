import React, { useState } from "react";
import apiClient from "../apiClient";
import { handleApiError } from "../utils/errorHandler";

export default function CadastrarOrientadorPage() {
   const [formData, setFormData] = useState({
      nomeOrientador: "",
      emailOrientador: "",
      senhaOrientador: "",
      isAdmin: false,
   });
   const [erro, setErro] = useState("");
   const [sucesso, setSucesso] = useState("");

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
      const { name, value, type } = e.target;

      if (type === "checkbox") {
         const { checked } = e.target as HTMLInputElement;
         setFormData((prev) => ({ ...prev, [name]: checked }));
      } else {
         setFormData((prev) => ({ ...prev, [name]: value }));
      }
   };

   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      setErro("");
      setSucesso("");

      try {
         await apiClient.post("/orientadores", formData);
         setSucesso("Orientador cadastrado com sucesso!");
         setFormData({
            nomeOrientador: "",
            emailOrientador: "",
            senhaOrientador: "",
            isAdmin: false,
         });
      } catch (error) {
         console.error("Erro ao cadastrar orientador", error);
         setErro(
            handleApiError(error, "Ocorreu um erro ao cadastrar o orientador.")
         );
      }
   };

   return (
      <div className="min-h-screen bg-gray-100 flex items-start justify-center p-6">
         <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg mt-10">
            <form className="space-y-5" onSubmit={handleSubmit}>
               <h2 className="text-2xl font-semibold text-center mb-2">
                  Cadastrar Orientador
               </h2>

               <div className="flex flex-col space-y-1">
                  <label
                     htmlFor="nomeOrientador"
                     className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                     Nome do Orientador
                  </label>
                  <input
                     type="text"
                     id="nomeOrientador"
                     name="nomeOrientador"
                     value={formData.nomeOrientador}
                     onChange={handleChange}
                     required
                     className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
               </div>

               <div className="flex flex-col space-y-1">
                  <label
                     htmlFor="emailOrientador"
                     className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                     Email
                  </label>
                  <input
                     type="email"
                     id="emailOrientador"
                     name="emailOrientador"
                     value={formData.emailOrientador}
                     onChange={handleChange}
                     required
                     className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
               </div>

               <div className="flex flex-col space-y-1">
                  <label
                     htmlFor="senhaOrientador"
                     className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                     Senha (mín. 8 caracteres)
                  </label>
                  <input
                     type="password"
                     id="senhaOrientador"
                     name="senhaOrientador"
                     value={formData.senhaOrientador}
                     onChange={handleChange}
                     minLength={8}
                     required
                     className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
               </div>

               <div className="flex items-center space-x-2">
                  <input
                     type="checkbox"
                     id="isAdmin"
                     name="isAdmin"
                     checked={formData.isAdmin}
                     onChange={handleChange}
                     className="w-4 h-4 accent-green-500"
                  />
                  <label
                     htmlFor="isAdmin"
                     className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                     Este orientador é um Administrador?
                  </label>
               </div>

               {erro && (
                  <div className="text-red-700 bg-red-100 border border-red-300 p-3 rounded-md text-center text-sm">
                     {erro}
                  </div>
               )}

               {sucesso && (
                  <p className="text-green-700 bg-green-100 border border-green-300 p-3 rounded-md text-center text-sm">
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
