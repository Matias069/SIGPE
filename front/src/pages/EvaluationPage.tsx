// src/pages/EvaluationPage.tsx
export default function EvaluationPage() {
  const criterios = [
    "Qualidade na escrita e organização",
    "Desenvolvimento do tema",
    "Qualidade da apresentação",
    "Domínio do conteúdo",
    "Consistência na arguição"
  ];

  return (
    <div className="p-6">
      <p className="mb-2">Nome do Projeto: __________</p>
      <p className="mb-4">Professor Orientador: __________</p>

      {criterios.map((criterio) => (
        <div key={criterio} className="mb-4">
          <p>{criterio}:</p>
          <input type="range" min="0" max="10" className="w-full" />
          <div className="flex justify-between text-xs">
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        </div>
      ))}

      <button className="w-full bg-green-700 text-white py-2 rounded">
        Enviar
      </button>
    </div>
  );
}
