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
      const orientador = await login(email, senha);

      if (orientador) {
        if (orientador.isAdmin) {
          navigate('/');
        } else {
          navigate('/cadastrarprojeto');
        }
      } else {
        setErro('Não foi possível obter os dados do usuário.');
      }
    } catch (error) {
      console.error('Erro de Login:', error);
      setErro(handleApiError(error, 'Email ou senha incorretos.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <form className="w-full" onSubmit={handleLogin}>
          <h2 className="text-center mb-6 text-2xl font-bold text-gray-800">Entrar</h2>

          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="mb-2 font-semibold text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none transition"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="password" className="mb-2 font-semibold text-gray-700">Senha</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none transition"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {erro && (
            <div
              className="text-red-800 bg-red-100 border border-red-200 p-3 mt-2 rounded text-sm text-center"
              role="alert"
            >
              {erro}
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 mt-4 rounded-lg font-semibold text-white transition
              ${isLoading ? 'bg-green-500 opacity-60 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
