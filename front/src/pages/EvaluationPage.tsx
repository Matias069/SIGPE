import React, { useState } from 'react';
// @ts-ignore: Importação de CSS
import '../styles/Pages.css'; 

const criteriosFixos = [
    "Qualidade na escrita e organização",
    "Desenvolvimento do tema",
    "Qualidade da apresentação",
    "Domínio do conteúdo",
    "Consistência na arguição"
];

// Mock de alunos para exemplo (em uma aplicação real, viria do backend/projeto selecionado)
const alunosMock = [
    { id: 1, nome: "Ana Silva" },
    { id: 2, nome: "Bruno Oliveira" },
    { id: 3, nome: "Carla Souza" },
    { id: 4, nome: "Daniel Ferreira" }
];

export default function EvaluationPage() {
    // Notas dos 5 critérios
    const [notas, setNotas] = useState<number[]>(new Array(5).fill(0));
    
    // Controle de faltas (Set de IDs dos alunos que faltaram)
    const [faltas, setFaltas] = useState<Set<number>>(new Set());
    
    const [observacoes, setObservacoes] = useState('');

    const handleNotaChange = (index: number, novaNota: string) => {
        const novasNotas = [...notas];
        novasNotas[index] = parseInt(novaNota, 10);
        setNotas(novasNotas);
    };

    const toggleFalta = (idAluno: number) => {
        const novasFaltas = new Set(faltas);
        if (novasFaltas.has(idAluno)) {
            novasFaltas.delete(idAluno);
        } else {
            novasFaltas.add(idAluno);
        }
        setFaltas(novasFaltas);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const media = notas.reduce((a, b) => a + b, 0) / notas.length;
        
        console.log("--- Dados da Avaliação ---");
        console.log("Notas:", notas);
        console.log("Média Final:", media.toFixed(2));
        console.log("Alunos que faltaram (IDs):", Array.from(faltas));
        console.log("Observações:", observacoes);
        
        alert(`Avaliação enviada!\nMédia calculada: ${media.toFixed(2)}`);
    };

    return (
        <div className="evaluation-container">
            <div className="evaluation-paper">
                
                <h2 className="evaluation-title">Ficha de Avaliação</h2>

                <form onSubmit={handleSubmit}>
                    
                    {/* Cabeçalho */}
                    <div className="evaluation-header">
                        <div className="header-row">
                            <div className="input-group-underline">
                                <label>Nome do Projeto</label>
                                <input 
                                    type="text" 
                                    className="input-underline" 
                                    placeholder="Projeto de Inovação Tecnológica..."
                                />
                            </div>
                        </div>
                        <div className="header-row">
                            <div className="input-group-underline">
                                <label>Professor Orientador</label>
                                <input 
                                    type="text" 
                                    className="input-underline" 
                                    placeholder="Nome do Professor..."
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

                    {/* Checkbox de Presença (Entre Critérios e Observações) */}
                    <div className="attendance-section">
                        <div className="attendance-title">Registro de Ausências</div>
                        <div className="students-grid">
                            {alunosMock.map((aluno) => (
                                <label key={aluno.id} className="checkbox-wrapper">
                                    <input 
                                        type="checkbox" 
                                        checked={faltas.has(aluno.id)}
                                        onChange={() => toggleFalta(aluno.id)}
                                    />
                                    <span className="student-name">{aluno.nome}</span>
                                </label>
                            ))}
                        </div>
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
                            <button type="button" className="btn-cancel" onClick={() => window.history.back()}>
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