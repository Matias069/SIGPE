// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import "../styles/Pages.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // Hooks
  const navigate = useNavigate(); // Inicializar o hook de navegação
  const { login } = useAuth();    // Obter a função login do contexto

  const handleLogin = async (event: React.FormEvent) => {
      event.preventDefault();
      setErro('');

      try {
          const response = await apiClient.post('/api/login', {
              emailOrientador: email,
              senhaOrientador: senha
          });
          
          // Salvar dados
          login(response.data);

          // Redirecionar
          navigate('/cadastrar-projeto');

      } catch (error: any) {
          console.error('Falha no login', error);
          if (error.response && error.response.status === 422) {
              // Erros de validação do Laravel
              setErro(error.response.data.errors.emailOrientador[0]);
          } else {
              setErro('Email ou senha incorretos.');
          }
      }
  };

  return (
    <div className="page-container">
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Entrar</h2>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="seuemail@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Senha</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>
                
                {/* Exibe a mensagem de erro, se houver */}
                {erro && <p className="error-message">{erro}</p>}

                <button type="submit" className="login-button">Entrar</button>
                <a href="/acesso" className="forgot-password">Esqueceu a senha?</a>
            </form>
        </div>
    </div>
  );
}
