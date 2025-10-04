// src/pages/AccessPage.tsx
export default function AccessPage() {
  return (
    <div className="flex justify-center mt-10">
      <div className="bg-green-300 p-6 rounded-lg shadow-lg w-96 text-center">
        <p className="mb-3">INSIRA A PALAVRA CHAVE DO PROFESSOR AVALIADOR:</p>
        <input className="w-full border rounded p-2 mb-4" type="text" />
        <button className="w-full bg-green-700 text-white py-2 rounded">
          Acessar
        </button>
      </div>
    </div>
  );
}
