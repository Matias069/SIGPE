import React, { useState, useRef, useEffect } from 'react';
import apiClient from '../apiClient';
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
// import '../styles/Pages.css';
import { handleApiError } from "../utils/errorHandler";

// Tipo Aluno
type Aluno = {
    matriculaAluno: string;
    nomeAluno: string;
    idTurma: number;
    idProjeto: number | null;
};

export default function CadastrarProjetoPage() {
    // Hooks
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Estados do formulário
    const [nomeProjeto, setNomeProjeto] = useState('');
    const [descricaoProjeto, setDescricaoProjeto] = useState('');
    const [descricaoErro, setDescricaoErro] = useState('');
    const [banner, setBanner] = useState<File | null>(null);
    
    // Estados da Busca de Alunos
    const [selectedAlunos, setSelectedAlunos] = useState<Aluno[]>([]);
    const [alunoSearch, setAlunoSearch] = useState('');
    const [searchResults, setSearchResults] = useState<Aluno[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoadingAlunos, setIsLoadingAlunos] = useState(false);
    
    // Estados de controle
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [alunoErro, setAlunoErro] = useState('');

    // Efeito para buscar alunos (com debounce)
    useEffect(() => {
        if (alunoSearch.trim() === '') {
            setSearchResults([]);
            setShowDropdown(false);
            setIsLoadingAlunos(false);
            return;
        }

        setIsLoadingAlunos(true);
        const timer = setTimeout(() => {
            apiClient.get(`/alunos/disponiveis?search=${encodeURIComponent(alunoSearch)}`)
                .then(response => {
                    const availableAlunos = response.data.filter(
                        (aluno: Aluno) => !selectedAlunos.find(sa => sa.matriculaAluno === aluno.matriculaAluno)
                    );
                    setSearchResults(availableAlunos);
                    setShowDropdown(availableAlunos.length > 0);
                })
                .catch(error => {
                    console.error("Erro ao buscar alunos", error);
                    setErro(handleApiError(error, "Não foi possível carregar os alunos."));
                })
                .finally(() => setIsLoadingAlunos(false));
        }, 300);

        return () => clearTimeout(timer);
    }, [alunoSearch, selectedAlunos]);

    // Handlers
    const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setBanner(event.target.files[0]);
        } else {
            setBanner(null);
        }
    };

    const handleSelectAluno = (aluno: Aluno) => {
        setAlunoErro('');
        if (selectedAlunos.length >= 8) {
            setAlunoErro('Um projeto pode ter no máximo 8 alunos.');
            return;
        }
        if (!selectedAlunos.find(sa => sa.matriculaAluno === aluno.matriculaAluno)) {
            setSelectedAlunos([...selectedAlunos, aluno]);
        }
        setAlunoSearch('');
        setSearchResults([]);
        setShowDropdown(false);
    };

    const handleRemoveAluno = (alunoParaRemover: Aluno) => {
        setSelectedAlunos(selectedAlunos.filter(aluno => aluno.matriculaAluno !== alunoParaRemover.matriculaAluno));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErro('');
        setSucesso('');
        setDescricaoErro('');

        if (selectedAlunos.length < 3) {
            setErro('O projeto deve ter no mínimo 3 alunos.');
            return;
        }

        const formData = new FormData();
        formData.append('nomeProjeto', nomeProjeto);
        formData.append('descricaoProjeto', descricaoProjeto);
        
        if (banner) {
            formData.append('bannerProjeto', banner);
        }

        selectedAlunos.forEach((aluno, index) => {
            formData.append(`alunos[${index}]`, aluno.matriculaAluno);
        });

        try {
            await apiClient.post('/projetos', formData);
            setSucesso('Projeto cadastrado com sucesso!');
            
            setNomeProjeto('');
            setDescricaoProjeto('');
            setBanner(null);
            setSelectedAlunos([]);
            setAlunoSearch('');
            
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error("Erro ao cadastrar projeto", error);
            setErro(handleApiError(error, "Ocorreu um erro ao cadastrar o projeto."));

            if (error instanceof Error || !(error as any).response) return;
            const data = (error as any).response.data;
            if (data?.errors?.descricaoProjeto) {
                setDescricaoErro(data.errors.descricaoProjeto[0]);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastrar Projeto</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="nomeProjeto" className="text-sm font-semibold text-gray-700 mb-2">Nome do Projeto</label>
                        <input
                            type="text"
                            id="nomeProjeto"
                            value={nomeProjeto}
                            onChange={(e) => setNomeProjeto(e.target.value)}
                            required
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="descricaoProjeto" className="text-sm font-semibold text-gray-700 mb-2">
                            Descrição (entre 250 e 500 palavras)
                        </label>
                        <textarea
                            id="descricaoProjeto"
                            value={descricaoProjeto}
                            onChange={(e) => {
                                setDescricaoProjeto(e.target.value);
                                setDescricaoErro('');
                            }}
                            required
                            rows={6}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none resize-vertical"
                        />
                        {descricaoErro && (
                            <p className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
                                {descricaoErro}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="bannerProjeto" className="text-sm font-semibold text-gray-700 mb-2">Banner do Projeto (Opcional)</label>
                        <input
                            type="file"
                            id="bannerProjeto"
                            accept=".jpeg, .jpg, .png, .pdf, .pptx"
                            onChange={handleBannerChange}
                            ref={fileInputRef}
                            className="text-sm"
                        />
                        {banner && (
                            <div className="mt-2 bg-gray-50 border border-gray-200 rounded p-3 flex items-center justify-between">
                                <p className="text-sm text-gray-700 truncate">{banner.name}</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setBanner(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="ml-4 text-sm text-red-600 hover:text-red-800"
                                >
                                    Remover banner
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sistema de Busca de Alunos */}
                    <div className="flex flex-col relative">
                        <label htmlFor="alunoInput" className="text-sm font-semibold text-gray-700 mb-2">Alunos (3 a 8)</label>

                        <div className="relative">
                            <input
                                type="text"
                                id="alunoInput"
                                placeholder="Buscar aluno por nome ou matrícula..."
                                value={alunoSearch}
                                onChange={(e) => setAlunoSearch(e.target.value)}
                                onFocus={() => setShowDropdown(true)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                            {isLoadingAlunos && <p className="absolute right-2 top-2 text-xs text-gray-500">Buscando...</p>}

                            {showDropdown && searchResults.length > 0 && (
                                <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow max-h-56 overflow-auto">
                                    {searchResults.map(aluno => (
                                        <li
                                            key={aluno.matriculaAluno}
                                            onClick={() => handleSelectAluno(aluno)}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                                        >
                                            {aluno.nomeAluno} ({aluno.matriculaAluno})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {alunoErro && <p className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">{alunoErro}</p>}

                        <ul className="mt-3 space-y-2">
                            {selectedAlunos.map((aluno) => (
                                <li key={aluno.matriculaAluno} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                                    <span className="text-sm text-gray-800">
                                        {aluno.nomeAluno} ({aluno.matriculaAluno})
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAluno(aluno)}
                                        className="text-sm text-red-600 hover:text-red-800"
                                    >
                                        Remover
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {erro && (
                        <div className="text-red-800 bg-red-100 border border-red-300 px-4 py-2 rounded mt-2 text-sm text-center">
                            {erro}
                        </div>
                    )}

                    {sucesso && (
                        <p className="text-green-800 bg-green-100 border border-green-300 px-4 py-2 rounded mt-2 text-sm text-center">
                            {sucesso}
                        </p>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition"
                        >
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
