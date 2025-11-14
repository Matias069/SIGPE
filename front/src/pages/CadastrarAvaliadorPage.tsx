import { useState } from "react";
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import '../styles/Pages.css';

export default function CadastrarAvaliadorPage() {
  const [siape, setSiape] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const novoAvaliador = {
      matricula_siape: siape,
      nome,
      email,
    };

    console.log("Avaliador cadastrado:", novoAvaliador);

    setSiape("");
    setNome("");
    setEmail("");
  };

  return (
    <div className="av-container">
      <div className="av-box">

        <h2 className="av-title">Cadastrar Avaliador</h2>

        <form onSubmit={handleSubmit}>

          <label className="av-label">Matrícula SIAPE:</label>
          <input
            type="text"
            className="av-input"
            value={siape}
            onChange={(e) => setSiape(e.target.value)}
            required
          />

          <label className="av-label">Nome:</label>
          <input
            type="text"
            className="av-input"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label className="av-label">Email:</label>
          <input
            type="email"
            className="av-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="av-button">
            Cadastrar
          </button>

        </form>
      </div>
    </div>
  );
}
