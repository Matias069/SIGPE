// src/components/ProjectCard.tsx
type ProjectCardProps = {
  nome: string;
  professor: string;
  ambito: string;
};

export function ProjectCard({ nome, professor, ambito }: ProjectCardProps) {
  return (
    <div className="bg-green-300 p-4 rounded-lg shadow-md">
      <p className="font-bold">{nome}</p>
      <p>{professor}</p>
      <p>{ambito}</p>
    </div>
  );
}
