// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import "../styles/Pages.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro('');
    setIsLoading(true);

    try {
      // Chama o login do contexto
      const orientador = await login(email, senha);
      
      // Redirecionamento baseado na role com verificação de segurança
      if (orientador) {
          if (orientador.isAdmin) {
            navigate('/'); 
          } else {
            navigate('/cadastrarprojeto');
          }
      } else {
          // Se login não jogou erro mas também não retornou user
          setErro('Erro ao obter dados do usuário.');
      }

    } catch (error: any) {
      console.error('Erro de Login:', error);

      if (!error.response) {
         // Erro de rede (backend desligado ou CORS)
         setErro('Erro de conexão com o servidor.');
      } else if (error.response.status === 401) {
         // 401 = Unauthorized (Senha ou Email errados)
         setErro('Email ou senha incorretos.');
      } else if (error.response.status === 422) {
         // 422 = Erro de Validação do Laravel
         const msg = error.response.data.errors?.emailOrientador?.[0];
         setErro(msg || 'Dados inválidos preenchidos.');
      } else {
         // Outros erros (500, 404, etc)
         setErro('Ocorreu um erro inesperado. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
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

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
