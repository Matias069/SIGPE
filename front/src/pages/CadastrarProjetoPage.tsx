import { useState } from "react";
import "../styles/Pages.css";

export default function CadastrarProjetoPage() {
  const [formData, setFormData] = useState({
    nomeProjeto: "",
    orientador: "",
    integrantes: "",
    resumo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const projetosSalvos = JSON.parse(localStorage.getItem("projetos") || "[]");
      const novosProjetos = [...projetosSalvos, formData];
      localStorage.setItem("projetos", JSON.stringify(novosProjetos));

      alert("Projeto cadastrado com sucesso!");

      setFormData({
        nomeProjeto: "",
        orientador: "",
        integrantes: "",
        resumo: "",
      });
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      alert("Ocorreu um erro ao cadastrar o projeto.");
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Cadastrar Projeto</h1>

      <form className="form" onSubmit={handleSubmit}>
        <label>Nome do Projeto:</label>
        <input
          type="text"
          name="nomeProjeto"
          value={formData.nomeProjeto}
          onChange={handleChange}
          required
        />

        <label>Orientador:</label>
        <input
          type="text"
          name="orientador"
          value={formData.orientador}
          onChange={handleChange}
          required
        />

        <label>Integrantes:</label>
        <input
          type="text"
          name="integrantes"
          value={formData.integrantes}
          onChange={handleChange}
          required
        />

        <label>Resumo:</label>
        <textarea
          name="resumo"
          rows={4}
          value={formData.resumo}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn-enviar">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
