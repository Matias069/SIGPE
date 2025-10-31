import { useEffect, useState } from "react";
import "../styles/Pages.css";

interface Projeto {
  nomeProjeto: string;
  orientador: string;
  integrantes: string;
  resumo: string;
}

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [busca, setBusca] = useState("");
  const [projetoSelecionado, setProjetoSelecionado] = useState<Projeto | null>(null);

  // Carregar projetos do localStorage
  useEffect(() => {
    try {
      const dados = localStorage.getItem("projetos");
      if (dados) {
        const parsed: Projeto[] = JSON.parse(dados);
        if (Array.isArray(parsed)) {
          setProjetos(parsed);
        }
      }
    } catch (error) {
      console.error("Erro ao ler projetos do localStorage:", error);
      setProjetos([]);
    }
  }, []);

  // Função para excluir projeto
  const excluirProjeto = (index: number) => {
    if (window.confirm("Tem certeza que deseja excluir este projeto?")) {
      const novosProjetos = projetos.filter((_, i) => i !== index);
      setProjetos(novosProjetos);
      localStorage.setItem("projetos", JSON.stringify(novosProjetos));
    }
  };

  const projetosFiltrados = projetos.filter((p) => {
    const termo = busca.toLowerCase();
    return (
      (p.nomeProjeto?.toLowerCase().includes(termo) ?? false) ||
      (p.orientador?.toLowerCase().includes(termo) ?? false) ||
      (p.integrantes?.toLowerCase().includes(termo) ?? false)
    );
  });

  return (
    <div className="page">
      <h1 className="page-title">Projetos Cadastrados</h1>

      {/* Barra de pesquisa */}
      <div className="form">
        <input
          type="text"
          placeholder="Pesquisar por projeto, orientador ou integrantes..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="input"
        />
      </div>

      {/* Lista de projetos */}
      {projetosFiltrados.length === 0 ? (
        <p>Nenhum projeto encontrado.</p>
      ) : (
        <div className="cards-container">
          {projetosFiltrados.map((p, index) => (
            <div key={index} className="card-projeto">
              <h2 className="card-titulo">{p.nomeProjeto ?? "Sem nome"}</h2>
              <p><strong>Orientador:</strong> {p.orientador ?? "Não informado"}</p>
              <p><strong>Integrantes:</strong> {p.integrantes ?? "Não informado"}</p>
              <p className="card-resumo"><strong>Resumo:</strong> {p.resumo ?? "Sem resumo"}</p>

              {/* Botões */}
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button onClick={() => setProjetoSelecionado(p)}>Visualizar</button>
                <button onClick={() => excluirProjeto(index)} style={{ backgroundColor: "red", color: "white" }}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {projetoSelecionado && (
        <div className="modal-overlay" onClick={() => setProjetoSelecionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setProjetoSelecionado(null)}>×</button>
            <h2>{projetoSelecionado.nomeProjeto ?? "Sem nome"}</h2>
            <p><strong>Orientador:</strong> {projetoSelecionado.orientador ?? "Não informado"}</p>
            <p><strong>Integrantes:</strong> {projetoSelecionado.integrantes ?? "Não informado"}</p>
            <p><strong>Resumo:</strong> {projetoSelecionado.resumo ?? "Sem resumo"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
