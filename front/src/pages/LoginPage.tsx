// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import "../styles/Pages.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth/useAuth';
import { handleApiError } from '../utils/errorHandler';

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
          setErro('Não foi possível obter os dados do usuário.');
      }

    } catch (error: any) {
      console.error('Erro de Login:', error);
      const msg = handleApiError(error, 'Falha ao entrar. Verifique suas credenciais.');
      setErro(msg);
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

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
