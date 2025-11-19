import React, { useState } from 'react';
import apiClient from '../apiClient';
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import '../styles/Pages.css';


export default function CadastrarOrientadorPage() {
    const [formData, setFormData] = useState({
        nomeOrientador: '',
        emailOrientador: '',
        senhaOrientador: '',
        isAdmin: false,
    });
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErro('');
        setSucesso('');

        try {
            await apiClient.post('/api/orientadores', formData);
            setSucesso('Orientador cadastrado com sucesso!');
            setFormData({ nomeOrientador: '', emailOrientador: '', senhaOrientador: '', isAdmin: false });
        } catch (error: any) {
            console.error("Erro ao cadastrar orientador", error);
            if (error.response && error.response.status === 422) {
                setErro('Erro de validação: ' + JSON.stringify(error.response.data.errors));
            } else {
                setErro('Ocorreu um erro ao cadastrar o orientador.');
            }
        }
    };

    return (
        <div className="page-container">
            <div className="register-project-container">
                <form className="register-project-form" onSubmit={handleSubmit}>
                    <h2>Cadastrar Orientador</h2>
                    
                    <div className="input-group">
                        <label htmlFor="nomeOrientador">Nome do Orientador</label>
                        <input type="text" id="nomeOrientador" name="nomeOrientador" value={formData.nomeOrientador} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="emailOrientador">Email</label>
                        <input type="email" id="emailOrientador" name="emailOrientador" value={formData.emailOrientador} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="senhaOrientador">Senha (mín. 8 caracteres)</label>
                        <input type="password" id="senhaOrientador" name="senhaOrientador" value={formData.senhaOrientador} onChange={handleChange} minLength={8} required />
                    </div>

                    <div className="input-group-checkbox">
                        <input type="checkbox" id="isAdmin" name="isAdmin" checked={formData.isAdmin} onChange={handleChange} />
                        <label htmlFor="isAdmin">Este orientador é um Administrador?</label>
                    </div>

                    {erro && <p className="error-message">{erro}</p>}
                    {sucesso && <p className="success-message">{sucesso}</p>}

                    <button type="submit" className="register-button">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}
