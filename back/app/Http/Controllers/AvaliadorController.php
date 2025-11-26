<?php

namespace App\Http\Controllers;

use App\Models\Avaliador;
use Illuminate\Http\Request;

class AvaliadorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Avaliador::all();
    }

    /**
     * Busca todos os avaliadores por nome ou matrícula.
     */
    public function search(Request $request)
    {
        // Começa a query
        $query = Avaliador::query();

        // Se houver um parâmetro 'search' na URL e não estiver vazio
        if ($request->has('search') && $request->query('search') != '') {
            // Converte o termo de busca para minúsculas
            $searchTerm = strtolower($request->query('search'));

            $query->where(function ($q) use ($searchTerm) {
                // Case Insensitive LIKE
                $q->where('nomeAvaliador', 'ILIKE', "%{$searchTerm}%")
                  ->orWhere('matriculaSiape', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Retorna os avaliadores encontrados (limitado a 10 para o dropdown)
        return $query->take(10)->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validar
        $validatedData = $request->validate([
            'nomeAvaliador' => 'required|string|max:100',
            'emailAvaliador' => 'required|string|email|max:50',
            'matriculaSiape' => 'required|string|min:7|max:8|unique:avaliador,matriculaSiape',
        ]);

        // Criar
        $avaliador = Avaliador::create($validatedData);

        return response()->json($avaliador, 201);
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
