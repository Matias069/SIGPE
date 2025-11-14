import React, { useState } from "react";
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import '../styles/Pages.css';


export default function CadastrarOrientadorPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const orientador = {
      nome,
      email,
      senha,
      admin: isAdmin,
    };

    console.log("Orientador cadastrado:", orientador);
    alert("Orientador cadastrado com sucesso!");

    setNome("");
    setEmail("");
    setSenha("");
    setIsAdmin(false);
  }

  return (
    <div className="page-container-orientador">
      <form className="orientador-box" onSubmit={handleSubmit}>
        <h2 className="orientador-title">Cadastrar Orientador</h2>

        {/* Nome */}
        <div className="orientador-field">
          <label>Nome</label>
          <input
            type="text"
            className="orientador-input"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="orientador-field">
          <label>Email</label>
          <input
            type="email"
            className="orientador-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Senha */}
        <div className="orientador-field">
          <label>Senha</label>
          <input
            type="password"
            className="orientador-input"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        {/* Checkbox admin */}
        <div className="orientador-checkbox">
          <input
            type="checkbox"
            id="adminCheck"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          <label htmlFor="adminCheck">Administrador</label>
        </div>

        <button className="orientador-button" type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
