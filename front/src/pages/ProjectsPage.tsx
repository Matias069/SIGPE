// src/pages/ProjectsPage.tsx
import { ProjectCard } from "../components/ProjectCard";

export default function ProjectsPage() {
  return (
    <div className="p-6">
      <h1 className="text-center text-xl font-bold mb-4">PROJETOS CADASTRADOS</h1>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Pesquisar..."
          className="border p-2 rounded w-full"
        />
        <button className="bg-green-600 text-white px-3 py-2 rounded">Filtrar</button>
      </div>
      <div className="grid gap-4">
        <ProjectCard nome="Nome do Projeto" professor="Prof. João" ambito="Tecnologia" />
        <ProjectCard nome="Outro Projeto" professor="Prof. Maria" ambito="Educação" />
      </div>
    </div>
  );
}
