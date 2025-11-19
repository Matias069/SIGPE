import React, { useState } from 'react';
import apiClient from '../apiClient';
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import "../styles/Pages.css";

export default function CadastrarTurmaPage() {
    const [formData, setFormData] = useState({
        numeroTurma: '',
        curso: '',
    });
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErro('');
        setSucesso('');

        // Converte numeroTurma para Int
        const dataToSend = {
            ...formData,
            numeroTurma: parseInt(formData.numeroTurma, 10),
        };

        try {
            await apiClient.post('/api/turmas', dataToSend);
            setSucesso('Turma cadastrada com sucesso!');
            setFormData({ numeroTurma: '', curso: '' }); // Reseta o formulário
        } catch (error: any) {
            console.error("Erro ao cadastrar turma", error);
            if (error.response && error.response.status === 422) {
                setErro('Erro de validação: ' + JSON.stringify(error.response.data.errors));
            } else {
                setErro('Ocorreu um erro ao cadastrar a turma.');
            }
        }
    };

    return (
        <div className="page-container">
            <div className="register-project-container">
                <form className="register-project-form" onSubmit={handleSubmit}>
                    <h2>Cadastrar Turma</h2>
                    
                    <div className="input-group">
                        <label htmlFor="numeroTurma">Número da Turma</label>
                        <input type="number" id="numeroTurma" name="numeroTurma" value={formData.numeroTurma} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="curso">Curso</label>
                        <select id="curso" name="curso" value={formData.curso} onChange={handleChange} required>
                            <option value="" disabled>Selecione o curso</option>
                            <option value="Informática">Informática</option>
                            <option value="Agropecuária">Agropecuária</option>
                            <option value="Meio Ambiente">Meio Ambiente</option>
                            <option value="Agroindústria">Agroindústria</option>
                        </select>
                    </div>

                    {erro && <p className="error-message">{erro}</p>}
                    {sucesso && <p className="success-message">{sucesso}</p>}

                    <button type="submit" className="register-button">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}
