import React, { useState } from 'react';
import apiClient from '../apiClient';
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import '../styles/Pages.css';

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
        } catch (error: any) {
            console.error("Erro ao cadastrar avaliador", error);
            if (error.response && error.response.status === 422) {
                setErro('Erro de validação: ' + JSON.stringify(error.response.data.errors));
            } else {
                setErro('Ocorreu um erro ao cadastrar o avaliador.');
            }
        }
    };

    return (
        <div className="page-container">
            <div className="register-project-container">
                <form className="register-project-form" onSubmit={handleSubmit}>
                    <h2>Cadastrar Avaliador</h2>
                    
                    <div className="input-group">
                        <label htmlFor="nomeAvaliador">Nome do Avaliador</label>
                        <input type="text" id="nomeAvaliador" name="nomeAvaliador" value={formData.nomeAvaliador} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="emailAvaliador">Email</label>
                        <input type="email" id="emailAvaliador" name="emailAvaliador" value={formData.emailAvaliador} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="matriculaSiape">Matrícula Siape (7 ou 8 dígitos)</label>
                        <input type="text" id="matriculaSiape" name="matriculaSiape" value={formData.matriculaSiape} onChange={handleChange} maxLength={8} required />
                    </div>

                    {erro && <p className="error-message">{erro}</p>}
                    {sucesso && <p className="success-message">{sucesso}</p>}

                    <button type="submit" className="register-button">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}
