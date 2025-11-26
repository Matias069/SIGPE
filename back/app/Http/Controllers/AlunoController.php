<?php

namespace App\Http\Controllers;

use App\Models\Aluno;
use Illuminate\Http\Request;

class AlunoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Aluno::all();
    }

    /**
     * Lista alunos disponíveis (sem projeto) e permite filtrar por nome ou matrícula para o dropdown.
     */
    public function searchAvailable(Request $request)
    {
        // Começa a query buscando apenas alunos sem projeto
        $query = Aluno::whereNull('idProjeto');

        // Se houver um parâmetro 'search' na URL e não estiver vazio
        if ($request->has('search') && $request->query('search') != '') {
            // Converte o termo de busca para minúsculas
            $searchTerm = strtolower($request->query('search'));
            
            $query->where(function ($q) use ($searchTerm) {
                // Case Insensitive LIKE
                $q->where('nomeAluno', 'ILIKE', "%{$searchTerm}%")
                  ->orWhere('matriculaAluno', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Retorna os alunos encontrados (limitado a 10 para o dropdown)
        return $query->take(10)->get();
    }

    /**
     * Calcula e retorna a nota do aluno baseada nas avaliações.
     */
    public function calcularNota($matriculaAluno)
    {
        // Busca o aluno e carrega os exames (relacionamento com a tabela pivot examinar)
        $aluno = Aluno::with('exames')->find($matriculaAluno);

        if (!$aluno) {
            return response()->json(['message' => 'Aluno não encontrado'], 404);
        }

        $qtdAvaliacoes = $aluno->exames->count();
        $status = 'pendente';
        $notaFinal = null;

        if ($qtdAvaliacoes === 0) {
            $status = 'pendente';
            $notaFinal = null;
        } elseif ($qtdAvaliacoes === 1) {
            // Se tiver apenas 1 nota, definimos como 'em_andamento' (aviso)
            $status = 'em_andamento';
            // Pega a nota da única avaliação disponível
            $notaFinal = $aluno->exames->first()->pivot->notaAluno;
        } else {
            // 2 avaliações
            $status = 'concluido';
            // Calcula a média das colunas 'notaAluno' da tabela pivot
            $notaFinal = $aluno->exames->avg('pivot.notaAluno');
        }

        return response()->json([
            'matricula' => $aluno->matriculaAluno,
            'nome' => $aluno->nomeAluno,
            'status_avaliacao' => $status, // pendente, em_andamento (aviso), concluido
            'nota_final' => $notaFinal !== null ? number_format($notaFinal/100, 2) : null,
            'qtd_avaliacoes' => $qtdAvaliacoes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validar
        $validatedData = $request->validate([
            'idTurma' => 'required|integer|exists:turma,idTurma',
            'nomeAluno' => 'required|string|max:100',
            'matriculaAluno' => 'required|string|size:11|unique:aluno,matriculaAluno',
        ]);

        // Criar
        $aluno = Aluno::create($validatedData);

        return response()->json($aluno, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
