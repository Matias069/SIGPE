import { useState } from "react";
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import "../styles/Pages.css";

export default function CadastrarTurmasPage() {
  const [turma, setTurma] = useState("");
  const [curso, setCurso] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const novaTurma = {
      turma,
      curso,
    };

    console.log("Turma cadastrada:", novaTurma);

    setTurma("");
    setCurso("");
  };

  return (
    <div className="turma-container">
      <div className="turma-box">

        <h2 className="turma-title">Cadastrar Turma</h2>

        <form onSubmit={handleSubmit}>

          <label className="turma-label">Número da Turma:</label>
          <input
            type="text"
            className="turma-input"
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
            required
            placeholder="Ex: 305"
          />

          <label className="turma-label">Curso:</label>
          <select
            className="turma-input"
            value={curso}
            onChange={(e) => setCurso(e.target.value)}
            required
          >
            <option value="">Selecione o curso</option>
            <option value="Informática">Informática</option>
            <option value="Agropecuária">Agropecuária</option>
            <option value="Agroindústria">Agroindústria</option>
            <option value="Meio Ambiente">Meio Ambiente</option>
          </select>

          <button type="submit" className="turma-button">
            Cadastrar
          </button>

        </form>
      </div>
    </div>
  );
}
