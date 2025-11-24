import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
// import '../styles/Pages.css';
import { handleApiError } from "../utils/errorHandler";

// Tipo para a Turma
type Turma = {
  idTurma: number;
  numeroTurma: number;
  curso: string;
};

export default function CadastrarAlunoPage() {
  // Estados do Formulário
  const [formData, setFormData] = useState({
    nomeAluno: '',
    matriculaAluno: '',
    idTurma: '',
  });

  // Estados da Busca de Turma
  const [turmaSearch, setTurmaSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Turma[]>([]);
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingTurmas, setIsLoadingTurmas] = useState(false);

  // Estados de Controle
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Efeito para buscar turmas (com debounce)
  useEffect(() => {
    if (turmaSearch.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      setIsLoadingTurmas(false);
      return;
    }

    setIsLoadingTurmas(true);
    const timer = setTimeout(() => {
      apiClient.get(`/turmas?search=${encodeURIComponent(turmaSearch)}`)
        .then(response => {
          setSearchResults(response.data);
          setShowDropdown(response.data.length > 0);
        })
        .catch(error => {
          console.error("Erro ao buscar turmas", error);
          setErro(handleApiError(error, "Não foi possível carregar as turmas."));
        })
        .finally(() => setIsLoadingTurmas(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [turmaSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler para selecionar uma turma do dropdown
  const handleSelectTurma = (turma: Turma) => {
    setSelectedTurma(turma);
    setFormData(prev => ({ ...prev, idTurma: turma.idTurma.toString() }));
    setTurmaSearch('');
    setShowDropdown(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro('');
    setSucesso('');

    if (formData.idTurma === '') {
      setErro('Você deve selecionar uma turma.');
      return;
    }

    try {
      await apiClient.post('/alunos', formData);
      setSucesso('Aluno cadastrado com sucesso!');
      setFormData({ nomeAluno: '', matriculaAluno: '', idTurma: '' });
      setSelectedTurma(null);
    } catch (error) {
      console.error("Erro ao cadastrar aluno", error);
      setErro(handleApiError(error, "Ocorreu um erro ao cadastrar o aluno."));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white p-7 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Cadastrar Aluno</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="nomeAluno" className="block text-sm font-semibold text-gray-700 mb-2">
              Nome do Aluno
            </label>
            <input
              type="text"
              id="nomeAluno"
              name="nomeAluno"
              value={formData.nomeAluno}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="matriculaAluno" className="block text-sm font-semibold text-gray-700 mb-2">
              Matrícula (11 dígitos)
            </label>
            <input
              type="text"
              id="matriculaAluno"
              name="matriculaAluno"
              value={formData.matriculaAluno}
              onChange={handleChange}
              maxLength={11}
              minLength={11}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="turmaSearch" className="block text-sm font-semibold text-gray-700 mb-2">
              Turma
            </label>

            <div className="relative">
              <input
                type="text"
                id="turmaSearch"
                placeholder="Buscar turma por número ou curso..."
                value={selectedTurma ? `${selectedTurma.curso} - ${selectedTurma.numeroTurma}` : turmaSearch}
                onChange={(e) => {
                  setTurmaSearch(e.target.value);
                  setSelectedTurma(null);
                  setFormData(prev => ({ ...prev, idTurma: '' }));
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="off"
              />

              {isLoadingTurmas && (
                <p className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">Buscando...</p>
              )}

              {showDropdown && searchResults.length > 0 && (
                <ul
                  className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto"
                  role="listbox"
                >
                  {searchResults.map(turma => (
                    <li
                      key={turma.idTurma}
                      onClick={() => handleSelectTurma(turma)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      role="option"
                    >
                      {turma.curso} - {turma.numeroTurma}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {erro && (
            <div className="text-red-800 bg-red-100 border border-red-300 px-4 py-2 rounded mt-2 text-sm text-center">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="text-green-800 bg-green-100 border border-green-200 px-4 py-2 rounded mt-2 text-sm text-center">
              {sucesso}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold mt-3 transition"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
