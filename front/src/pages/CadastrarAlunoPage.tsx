import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import '../styles/Pages.css';

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
        // Debounce: espera 300ms após o utilizador parar de digitar
        const timer = setTimeout(() => {
            // Chama a rota correta do backend
            apiClient.get(`/turmas/search?search=${turmaSearch}`)
                .then(response => {
                    setSearchResults(response.data);
                    setShowDropdown(response.data.length > 0);
                })
                .catch(err => {
                    console.error("Erro ao buscar turmas", err);
                    setErro("Não foi possível carregar as turmas.");
                })
                .finally(() => setIsLoadingTurmas(false));
        }, 300);

        return () => clearTimeout(timer); // Limpa o timer
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
        } catch (error: any) {
            console.error("Erro ao cadastrar aluno", error);
            if (error.response && error.response.status === 422) {
                setErro('Erro de validação: ' + JSON.stringify(error.response.data.errors));
            } else {
                setErro('Ocorreu um erro ao cadastrar o aluno.');
            }
        }
    };

    return (
        <div className="page-container">
            <div className="register-project-container">
                <form className="register-project-form" onSubmit={handleSubmit}>
                    <h2>Cadastrar Aluno</h2>

                    <div className="input-group">
                        <label htmlFor="nomeAluno">Nome do Aluno</label>
                        <input type="text" id="nomeAluno" name="nomeAluno" value={formData.nomeAluno} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="matriculaAluno">Matrícula (11 dígitos)</label>
                        <input type="text" id="matriculaAluno" name="matriculaAluno" value={formData.matriculaAluno} onChange={handleChange} maxLength={11} minLength={11} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="turmaSearch">Turma</label>
                        <div className="search-dropdown-container">
                            <input
                                type="text"
                                id="turmaSearch"
                                placeholder="Buscar turma por número ou curso..."
                                value={selectedTurma ? `${selectedTurma.curso} - ${selectedTurma.numeroTurma}` : turmaSearch}
                                onChange={(e) => {
                                    setTurmaSearch(e.target.value);
                                    setSelectedTurma(null); // Limpa a seleção se começar a digitar
                                    setFormData(prev => ({ ...prev, idTurma: '' }));
                                }}
                                onFocus={() => setShowDropdown(true)}
                            />
                            {isLoadingTurmas && <p>Buscando...</p>}
                            
                            {showDropdown && searchResults.length > 0 && (
                                <ul className="search-dropdown-list">
                                    {searchResults.map(turma => (
                                        <li 
                                            key={turma.idTurma} 
                                            onClick={() => handleSelectTurma(turma)}
                                        >
                                            {turma.curso} - {turma.numeroTurma}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {erro && <p className="error-message">{erro}</p>}
                    {sucesso && <p className="success-message">{sucesso}</p>}

                    <button type="submit" className="register-button">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}