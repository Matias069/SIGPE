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
