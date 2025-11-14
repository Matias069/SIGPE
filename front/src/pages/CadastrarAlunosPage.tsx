import React, { useState } from "react";
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import '../styles/Pages.css';

interface Turma {
  id: number;
  nome: string;
}

export default function CadastrarAlunosPage() {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [turma, setTurma] = useState("");

  const turmas: Turma[] = [
    { id: 1, nome: "1º Ano - Informática" },
    { id: 2, nome: "2º Ano - Informática" },
    { id: 3, nome: "3º Ano - Informática" }
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const novoAluno = { nome, matricula, turma };

    console.log("Aluno cadastrado:", novoAluno);
    alert("Aluno cadastrado com sucesso!");

    setNome("");
    setMatricula("");
    setTurma("");
  }

  return (
    <div className="page-container-cadastro">
      <form className="cadastro-box" onSubmit={handleSubmit}>
        <h2 className="cadastro-title">Cadastrar Aluno</h2>

        {/* Nome */}
        <div className="cadastro-field">
          <label>Nome</label>
          <input
            type="text"
            className="cadastro-input"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        {/* Matrícula */}
        <div className="cadastro-field">
          <label>Matrícula</label>
          <input
            type="text"
            className="cadastro-input"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            required
          />
        </div>

        {/* Turma */}
        <div className="cadastro-field">
          <label>Turma</label>
          <select
            className="cadastro-select"
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
            required
          >
            <option value="">Selecione uma turma</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.nome}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>

        <button className="cadastro-button" type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
