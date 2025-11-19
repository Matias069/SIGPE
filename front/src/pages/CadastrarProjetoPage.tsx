import React, { useState, useRef, useEffect } from 'react';
import apiClient from '../apiClient';
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import '../styles/Pages.css';

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
        // Debounce: espera 300ms após o utilizador parar de digitar
        const timer = setTimeout(() => {
            // Chama a rota correta do backend
            apiClient.get(`/alunos/disponiveis?search=${alunoSearch}`)
                .then(response => {
                    // Filtra alunos que já foram selecionados
                    const availableAlunos = response.data.filter(
                        (aluno: Aluno) => !selectedAlunos.find(sa => sa.matriculaAluno === aluno.matriculaAluno)
                    );
                    setSearchResults(availableAlunos);
                    setShowDropdown(availableAlunos.length > 0);
                })
                .catch(error => console.error("Erro ao buscar alunos", error))
                .finally(() => setIsLoadingAlunos(false));
        }, 300);

        return () => clearTimeout(timer); // Limpa o timer
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

        // Validação de mínimo 3 alunos
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

        // Enviar as matrículas (PK) dos alunos
        selectedAlunos.forEach((aluno, index) => {
            formData.append(`alunos[${index}]`, aluno.matriculaAluno);
        });

        try {
            await apiClient.post('/projetos', formData);
            setSucesso('Projeto cadastrado com sucesso!');
            
            // Limpa o formulário
            setNomeProjeto('');
            setDescricaoProjeto('');
            setBanner(null);
            setSelectedAlunos([]);
            setAlunoSearch('');
            
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error: any) {
            console.error("Erro ao cadastrar projeto", error);
            if (error.response && error.response.status === 401) {
                setErro('Acesso não autorizado. Verifique sua sessão.');
            } else if (error.response && error.response.status === 422) {
                const erros = error.response.data.errors;
                if (erros.alunos || (erros && Object.keys(erros).some(k => k.startsWith('alunos.')))) {
                    setErro('Erro na seleção de alunos. Verifique se as matrículas são válidas e estão disponíveis.');
                } else {
                    setErro('Erro de validação, verifique os campos.');
                }
            } else {
                setErro('Ocorreu um erro ao cadastrar o projeto.');
            }
        }
    };

    return (
        <div className="page-container">
            <div className="register-project-container">
                <form className="register-project-form" onSubmit={handleSubmit}>
                    <h2>Cadastrar Projeto</h2>

                    <div className="input-group">
                        <label htmlFor="nomeProjeto">Nome do Projeto</label>
                        <input type="text" id="nomeProjeto" value={nomeProjeto} onChange={(e) => setNomeProjeto(e.target.value)} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="descricaoProjeto">Descrição</label>
                        <textarea id="descricaoProjeto" value={descricaoProjeto} onChange={(e) => setDescricaoProjeto(e.target.value)} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="bannerProjeto">Banner do Projeto</label>
                        <input type="file" id="bannerProjeto" accept=".jpeg, .jpg, .png, .pdf, .pptx" onChange={handleBannerChange} ref={fileInputRef} />
                        {banner && <p>Arquivo selecionado: {banner.name}</p>}
                    </div>

                    {/* Sistema de Busca de Alunos */}
                    <div className="input-group">
                        <label htmlFor="alunoInput">Alunos (3 a 8)</label>
                        <div className="search-dropdown-container">
                            <input
                                type="text"
                                id="alunoInput"
                                placeholder="Buscar aluno por nome ou matrícula..."
                                value={alunoSearch}
                                onChange={(e) => setAlunoSearch(e.target.value)}
                                onFocus={() => setShowDropdown(true)}
                            />
                            {isLoadingAlunos && <p>Buscando...</p>}
                            
                            {showDropdown && searchResults.length > 0 && (
                                <ul className="search-dropdown-list">
                                    {searchResults.map(aluno => (
                                        <li 
                                            key={aluno.matriculaAluno} 
                                            onClick={() => handleSelectAluno(aluno)}
                                        >
                                            {aluno.nomeAluno} ({aluno.matriculaAluno})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        
                        {alunoErro && <p className="error-message">{alunoErro}</p>}
                        
                        <ul className="selected-items-list">
                            {selectedAlunos.map((aluno) => (
                                <li key={aluno.matriculaAluno}>
                                    {aluno.nomeAluno} ({aluno.matriculaAluno})
                                    <button type="button" onClick={() => handleRemoveAluno(aluno)} style={{ marginLeft: '10px' }}>
                                        Remover
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {erro && <p className="error-message">{erro}</p>}
                    {sucesso && <p className="success-message">{sucesso}</p>}

                    <button type="submit" className="register-button">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}