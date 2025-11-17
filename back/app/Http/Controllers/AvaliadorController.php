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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validar
        $validatedData = $request->validate([
            'nomeAvaliador' => 'required|string|max:100',
            'emailAvaliador' => 'required|string|email|max:50',
            'matriculaSiape' => 'required|string|max:8|unique:avaliador,matriculaSiape',
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
