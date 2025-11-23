import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';
import { handleApiError } from '../utils/errorHandler';
// @ts-ignore: Importação de CSS
import '../styles/Pages.css';

const criteriosFixos = [
    "Qualidade na escrita e organização",
    "Desenvolvimento do tema",
    "Qualidade da apresentação",
    "Domínio do conteúdo",
    "Consistência na arguição"
];

// Tipagem para os dados que virão da API
type Aluno = {
    matriculaAluno: string;
    nomeAluno: string;
};

type Orientador = {
    nomeOrientador: string;
};

type ProjetoDetalhado = {
    idProjeto: number;
    nomeProjeto: string;
    orientador: Orientador;
    alunos: Aluno[];
};

export default function EvaluationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [projeto, setProjeto] = useState<ProjetoDetalhado | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    
    // Estados do formulário
    const [notas, setNotas] = useState<number[]>(new Array(5).fill(0));
    // Armazena as matrículas dos alunos que faltaram
    const [faltas, setFaltas] = useState<Set<string>>(new Set());
    const [observacoes, setObservacoes] = useState('');

    useEffect(() => {
        const fetchProjeto = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/projetos/${id}`);
                setProjeto(response.data);
            } catch (error) {
                console.error("Erro ao carregar projeto", error);
                setErro(handleApiError(error, "Erro ao carregar dados do projeto."));
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProjeto();
    }, [id]);

    const handleNotaChange = (index: number, novaNota: string) => {
        const novasNotas = [...notas];
        novasNotas[index] = parseInt(novaNota, 10);
        setNotas(novasNotas);
    };

    const toggleFalta = (matricula: string) => {
        const novasFaltas = new Set(faltas);
        if (novasFaltas.has(matricula)) {
            novasFaltas.delete(matricula);
        } else {
            novasFaltas.add(matricula);
        }
        setFaltas(novasFaltas);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const media = notas.reduce((a, b) => a + b, 0) / notas.length;
        
        // Estrutura do payload para envio futuro ao backend
        const payload = {
            idProjeto: projeto?.idProjeto,
            notas: notas, // Array com as 5 notas
            mediaFinal: parseFloat(media.toFixed(2)),
            alunosFaltantes: Array.from(faltas), // Lista de matrículas
            observacoes: observacoes
        };

        console.log("--- Enviando Avaliação ---", payload);
        
        // Aqui entraria a chamada: await apiClient.post('/avaliar', payload);
        
        alert(`Avaliação registrada com sucesso!\nProjeto: ${projeto?.nomeProjeto}\nMédia: ${media.toFixed(2)}`);
        navigate('/'); // Volta para a home ou lista de projetos
    };

    if (loading) return <div className="page-container"><h2>Carregando ficha de avaliação...</h2></div>;
    if (!projeto) return <div className="page-container"><h2>Projeto não encontrado.</h2></div>;

    return (
        <div className="evaluation-container">
            <div className="evaluation-paper">
                
                <h2 className="evaluation-title">Ficha de Avaliação</h2>

                <form onSubmit={handleSubmit}>
                    
                    {/* Cabeçalho */}
                    <div className="evaluation-header">
                        <div className="header-row">
                            <div className="input-group-underline">
                                <label className="header-label">Nome do Projeto</label>
                                <input 
                                    type="text" 
                                    className="input-underline read-only-field"
                                    value={projeto.nomeProjeto}
                                    readOnly
                                    style={{ fontWeight: 'bold', color: '#333' }}
                                />
                            </div>
                        </div>

                        {erro && (
                            <div className="error-message" style={{
                                color: '#721c24', 
                                backgroundColor: '#f8d7da', 
                                borderColor: '#f5c6cb', 
                                padding: '10px', 
                                marginTop: '10px', 
                                borderRadius: '5px',
                                fontSize: '0.9rem',
                                textAlign: 'center'
                            }}>
                                {erro}
                            </div>
                        )}

                        <div className="header-row">
                            <div className="input-group-underline">
                                <label className="header-label">Professor Orientador</label>
                                <input 
                                    type="text" 
                                    className="input-underline read-only-field"
                                    value={projeto.orientador.nomeOrientador}
                                    readOnly
                                    style={{ fontWeight: 'bold', color: '#333' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Critérios com Sliders */}
                    <div className="criteria-list">
                        {criteriosFixos.map((criterio, index) => (
                            <div key={index} className="criteria-item">
                                <div className="criteria-header">
                                    <span className="criteria-name">{criterio}</span>
                                    <span className="criteria-score">{notas[index]}</span>
                                </div>
                                <div className="slider-container">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="10" 
                                        step="1"
                                        value={notas[index]}
                                        onChange={(e) => handleNotaChange(index, e.target.value)}
                                        className="range-slider"
                                    />
                                </div>
                                <div className="slider-scale">
                                    <span>0</span>
                                    <span>1</span>
                                    <span>2</span>
                                    <span>3</span>
                                    <span>4</span>
                                    <span>5</span>
                                    <span>6</span>
                                    <span>7</span>
                                    <span>8</span>
                                    <span>9</span>
                                    <span>10</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Checkbox de Presença */}
                    <div className="attendance-section">
                        <div className="attendance-title">Registro de Ausências</div>
                        
                        {projeto.alunos && projeto.alunos.length > 0 ? (
                            <div className="students-grid">
                                {projeto.alunos.map((aluno) => (
                                    <label key={aluno.matriculaAluno} className="checkbox-wrapper">
                                        <input 
                                            type="checkbox" 
                                            checked={faltas.has(aluno.matriculaAluno)}
                                            onChange={() => toggleFalta(aluno.matriculaAluno)}
                                        />
                                        <span className="student-name">
                                            {aluno.nomeAluno}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <p style={{color: '#666', fontStyle: 'italic'}}>
                                Nenhum aluno vinculado a este projeto.
                            </p>
                        )}
                    </div>

                    {/* Rodapé e Botões */}
                    <div className="evaluation-footer">
                        <div className="comments-section">
                            <label style={{ fontWeight: 'bold', color: '#2d6a4f' }}>
                                Observações Adicionais:
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Digite suas considerações aqui..."
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn-cancel" 
                                onClick={() => navigate('/')}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn-submit">
                                Enviar Avaliação
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}