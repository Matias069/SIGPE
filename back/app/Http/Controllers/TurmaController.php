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
