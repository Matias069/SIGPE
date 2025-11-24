import React, { useState } from 'react';
import apiClient from '../apiClient';
import { handleApiError } from "../utils/errorHandler";

export default function CadastrarAvaliadorPage() {
  const [formData, setFormData] = useState({
    nomeAvaliador: '',
    emailAvaliador: '',
    matriculaSiape: '',
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro('');
    setSucesso('');

    try {
      await apiClient.post('/avaliadores', formData);
      setSucesso('Avaliador cadastrado com sucesso!');
      setFormData({ nomeAvaliador: '', emailAvaliador: '', matriculaSiape: '' });
    } catch (error) {
      console.error("Erro ao cadastrar avaliador", error);
      setErro(handleApiError(error, "Ocorreu um erro ao cadastrar o avaliador."));
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 p-6">
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Cadastrar Avaliador</h2>

          <div className="mb-4">
            <label htmlFor="nomeAvaliador" className="block text-sm font-semibold text-gray-700 mb-2">
              Nome do Avaliador
            </label>
            <input
              type="text"
              id="nomeAvaliador"
              name="nomeAvaliador"
              value={formData.nomeAvaliador}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="emailAvaliador" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="emailAvaliador"
              name="emailAvaliador"
              value={formData.emailAvaliador}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="matriculaSiape" className="block text-sm font-semibold text-gray-700 mb-2">
              Matrícula Siape (7 ou 8 dígitos)
            </label>
            <input
              type="text"
              id="matriculaSiape"
              name="matriculaSiape"
              value={formData.matriculaSiape}
              onChange={handleChange}
              maxLength={8}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {erro && (
            <div className="text-red-800 bg-red-100 border border-red-300 px-4 py-2 rounded mb-4 text-sm text-center">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="text-green-800 bg-green-100 border border-green-200 px-4 py-2 rounded mb-4 text-sm text-center">
              {sucesso}
            </div>
          )}

          <button className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700" type="submit">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
