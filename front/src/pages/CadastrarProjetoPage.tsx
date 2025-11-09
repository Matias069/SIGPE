import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';
import { useAuth } from '../contexts/AuthContext';
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import '../styles/Pages.css';

type Aluno = {
    matriculaAluno: string;
    nomeAluno: string;
    idProjeto: number;
    idTurma: number;
};

export default function CadastrarProjetoPage() {
    // Hooks
    const navigate = useNavigate();
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Estados do formulário
    const [nomeProjeto, setNomeProjeto] = useState('');
    const [descricaoProjeto, setDescricaoProjeto] = useState('');
    
    // Estados de Aluno e banner
    const [banner, setBanner] = useState<File | null>(null);
    const [alunos, setAlunos] = useState<string[]>([]); // Array de matrículas
    const [alunoInput, setAlunoInput] = useState(''); // Input da matrícula

    // Alunos selecionados
    const [selectedAlunos, setSelectedAlunos] = useState<Aluno[]>([]);
    // Termo de busca digitado pelo utilizador
    const [alunoSearch, setAlunoSearch] = useState('');
    // Resultados da busca vindos da API
    const [searchResults, setSearchResults] = useState<Aluno[]>([]);
    // Controle para mostrar/esconder o dropdown
    const [showDropdown, setShowDropdown] = useState(false);
    
    // Estados de controle
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [alunoErro, setAlunoErro] = useState(''); // Erro específico para o input de matrícula

    // Buscar alunos na API com debounce
    useEffect(() => {
        // Não busca se o campo estiver vazio
        if (alunoSearch.trim() === '') {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        // Debounce: espera 300ms após o utilizador parar de digitar
        const timer = setTimeout(() => {
            apiClient.get(`/api/alunos/disponiveis?search=${alunoSearch}`)
                .then(response => {
                    // Filtra alunos que já foram selecionados
                    const availableAlunos = response.data.filter(
                        (aluno: Aluno) => !selectedAlunos.find(sa => sa.matriculaAluno === aluno.matriculaAluno)
                    );
                    setSearchResults(availableAlunos);
                    setShowDropdown(availableAlunos.length > 0);
                })
                .catch(error => console.error("Erro ao buscar alunos", error));
        }, 300);

        return () => clearTimeout(timer); // Limpa o timer
    }, [alunoSearch, selectedAlunos]); // Roda novamente quando a busca ou os selecionados mudam

    const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setBanner(event.target.files[0]);
        } else {
            setBanner(null);
        }
    };

    const handleSelectAluno = (aluno: Aluno) => {
        setAlunoErro(''); // Limpa erros antigos
        if (selectedAlunos.length >= 8) {
            setAlunoErro('Um projeto pode ter no máximo 8 alunos.');
            return;
        }
        if (!selectedAlunos.find(sa => sa.matriculaAluno === aluno.matriculaAluno)) {
            setSelectedAlunos([...selectedAlunos, aluno]);
        }
        setAlunoSearch(''); // Limpa a busca
        setSearchResults([]);
        setShowDropdown(false);
    };

    const handleRemoveAluno = (alunoParaRemover: Aluno) => {
        setSelectedAlunos(selectedAlunos.filter(aluno => aluno.matriculaAluno !== alunoParaRemover.matriculaAluno));
    };

    const handleAddAluno = () => {
        setAlunoErro(''); // Limpa erros antigos
        const matricula = alunoInput.trim();

        if (matricula.length !== 11) {
            setAlunoErro('A matrícula deve ter 11 caracteres.');
            return;
        }
        if (alunos.includes(matricula)) {
            setAlunoErro('Este aluno já foi adicionado ao projeto.');
            return;
        }
        if (alunos.length >= 8) {
            setAlunoErro('Um projeto pode ter no máximo 8 alunos.');
            return;
        }
        
        setAlunos([...alunos, matricula]);
        setAlunoInput(''); // Limpa o input
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErro('');
        setSucesso('');

        // Validação de frontend antes de enviar
        if (selectedAlunos.length < 3) {
            setErro('O projeto deve ter no mínimo 3 alunos.');
            return; // Para a submissão
        }

        const formData = new FormData();

        // Anexar todos os dados
        formData.append('nomeProjeto', nomeProjeto);
        formData.append('descricaoProjeto', descricaoProjeto);
        if (banner) {
            formData.append('bannerProjeto', banner);
        }

        // 3. Enviar apenas os IDs dos alunos selecionados
        selectedAlunos.forEach((aluno, index) => {
            formData.append(`alunos[${index}]`, aluno.matriculaAluno);
        });

        try {
            // Enviar FormData
            await apiClient.post('/api/projetos', formData);

            setSucesso('Projeto cadastrado com sucesso!');
            
            // Limpar o formulário
            setNomeProjeto('');
            setDescricaoProjeto('');
            setBanner(null);
            setSelectedAlunos([]);
            setAlunoSearch('');
            
            // Limpar o input de arquivo
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (error: any) {
            console.error("Erro ao cadastrar projeto", error);
            if (error.response && error.response.status === 422) {
                // Erros de validação do Laravel
                const erros = error.response.data.errors;
                if (erros.alunos || erros['alunos.0']) {
                    setErro('Erro na seleção de alunos. Verifique se os alunos estão corretos e disponíveis.');
                } else {
                    setErro('Erro de validação, verifique os campos.');
                }
            } else {
                setErro('Ocorreu um erro ao cadastrar o projeto.');
            }
        }
    };

    // Proteção de Rota
    if (!user) {
        return (
          <div className="page-container">
              <h2>Acesso Negado</h2>
              <p>Você precisa estar logado como Orientador para cadastrar um projeto.</p>
              <button onClick={() => navigate('/login')}>Ir para Login</button>
          </div>
      );
    }

    return (
        <div className="page-container">
            <div className="register-project-container">
                <form className="register-project-form" onSubmit={handleSubmit}>
                    <h2>Cadastrar Projeto</h2>

                    <div className="input-group">
                        <label htmlFor="nomeProjeto">Nome do Projeto</label>
                        <input
                            type="text" id="nomeProjeto"
                            value={nomeProjeto}
                            onChange={(e) => setNomeProjeto(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="descricaoProjeto">Descrição</label>
                        <textarea
                            id="descricaoProjeto"
                            value={descricaoProjeto}
                            onChange={(e) => setDescricaoProjeto(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="bannerProjeto">Banner do Projeto</label>
                        <input
                            type="file"
                            id="bannerProjeto"
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handleBannerChange}
                            ref={fileInputRef}
                        />
                        {banner && <p>Arquivo selecionado: {banner.name}</p>}
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="alunoInput">Alunos (3 a 8)</label>
                        <div className="aluno-search-container"> {/* (Precisa de CSS) */}
                            <input
                                type="text"
                                id="alunoInput"
                                placeholder="Buscar aluno por nome ou matrícula..."
                                value={alunoSearch}
                                onChange={(e) => setAlunoSearch(e.target.value)}
                                onFocus={() => setShowDropdown(true)}
                            />
                            {/* Dropdown de resultados */}
                            {showDropdown && searchResults.length > 0 && (
                                <ul className="aluno-dropdown"> {/* (Precisa de CSS) */}
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
                        
                        {/* Lista de alunos selecionados */}
                        <ul className="aluno-list">
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