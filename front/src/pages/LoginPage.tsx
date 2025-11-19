// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import "../styles/Pages.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro('');

    try {
      const dadosUsuario = await login(email, senha);

      // Redireciona baseado no status de Admin
      if (dadosUsuario.isAdmin) {
        // Se for Admin, redireciona para a Home ('/')
        navigate('/');
      } else {
        // Se for Orientador (não-Admin), redireciona para Cadastrar Projeto
        navigate('/cadastrarprojeto');
      }

    } catch (error: any) {
      console.error('Erro no login:', error);
      
      if (error.response?.status === 422) {
        // Erro de validação (campos vazios ou inválidos)
        setErro(error.response.data.errors.emailOrientador?.[0] || 'Dados inválidos.');
      } else if (error.response?.status === 419) {
        // Erro de CSRF (Sessão expirada ou inválida)
        setErro('Sessão expirada. Atualize a página e tente novamente.');
      } else {
        // Outros erros (401 Credenciais incorretas, 500, etc)
        setErro('Email ou senha incorretos.');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="login-container-login">
        <form className="login-form" onSubmit={handleLogin}>
          
          <h2>Entrar</h2>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="input-field"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              className="input-field"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {erro && <p className="error-message">{erro}</p>}

          <button type="submit" className="login-button">Entrar</button>

          <a href="/acesso" className="forgot-password">
            Esqueceu a senha?
          </a>

        </form>
      </div>
    </div>
  );
}
