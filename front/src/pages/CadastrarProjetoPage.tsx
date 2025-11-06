import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';
import { useAuth } from '../contexts/AuthContext';
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import "../styles/Pages.css";

export default function CadastrarProjetoPage() {
  // Hooks
  const navigate = useNavigate();
  const { user } = useAuth(); // Obter o utilizador logado

  // Estados do formulário
  const [nomeProjeto, setNomeProjeto] = useState('');
  const [descricaoProjeto, setDescricaoProjeto] = useState('');
  // TODO: Adicionar estado para Alunos e Banner
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      setErro('');
      setSucesso('');

      try {
          await apiClient.post('/api/projetos', {
              nomeProjeto,
              descricaoProjeto,
          });

          setSucesso('Projeto cadastrado com sucesso!');
          // Limpa o formulário
          setNomeProjeto('');
          setDescricaoProjeto('');

      } catch (error: any) {
          console.error("Erro ao cadastrar projeto", error);
          if (error.response && error.response.status === 422) {
              setErro('Erro de validação: ' + JSON.stringify(error.response.data.errors));
          } else {
              setErro('Ocorreu um erro ao cadastrar o projeto.');
          }
      }
  };

  // Proteção de Rota
  if (!user) {
      return (
          <div className="page-container">
              <h2>Acesso Negado</h2>
              <p>Você precisa estar logado como Orientador para cadastrar um projeto.</p>
              <button onClick={() => navigate('/login')}>Ir para Login</button>
          </div>
      );
  }

  return (
      <div className="page-container">
          <div className="register-project-container">
              <form className="register-project-form" onSubmit={handleSubmit}>
                  <h2>Cadastrar Projeto</h2>

                  <div className="input-group">
                      <label htmlFor="nomeProjeto">Nome do Projeto</label>
                      <input
                          type="text"
                          id="nomeProjeto"
                          value={nomeProjeto}
                          onChange={(e) => setNomeProjeto(e.target.value)}
                          required
                      />
                  </div>

                  <div className="input-group">
                      <label htmlFor="descricaoProjeto">Descrição</label>
                      <textarea
                          id="descricaoProjeto"
                          value={descricaoProjeto}
                          onChange={(e) => setDescricaoProjeto(e.target.value)}
                          required
                      />
                  </div>

                  {/* TODO: Adicionar inputs para Alunos e Banner */}
                  
                  {erro && <p className="error-message">{erro}</p>}
                  {sucesso && <p className="success-message">{sucesso}</p>}

                  <button type="submit" className="register-button">Cadastrar</button>
              </form>
          </div>
      </div>
  );
}