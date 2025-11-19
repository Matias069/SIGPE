<?php

namespace App\Http\Controllers;

use App\Models\Turma;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TurmaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Turma::all();
    }

    /**
     * Busca todas as turmas por número ou curso.
     */
    public function search(Request $request)
    {
        // Começa a query
        $query = Turma::query();

        // Se houver um parâmetro 'search' na URL e não estiver vazio
        if ($request->has('search') && $request->query('search') != '') {
            // Converte o termo de busca para minúsculas
            $searchTerm = strtolower($request->query('search'));

            $query->where(function ($q) use ($searchTerm) {
                // Case Insensitive LIKE
                $q->where('curso', 'ILIKE', "%{$searchTerm}%")
                  ->orWhere('numeroTurma', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Retorna as turmas encontrados (limitado a 10 para o dropdown)
        return $query->take(10)->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validar
        $validatedData = $request->validate([
            'numeroTurma' => 'required|integer|unique:turma,numeroTurma',
            'curso' => [
                'required',
                // Garante que o curso está na lista da migração
                Rule::in(['Agropecuária', 'Meio Ambiente', 'Informática', 'Agroindústria']),
            ],
        ]);

        // Criar
        $turma = Turma::create($validatedData);

        return response()->json($turma, 201);
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
