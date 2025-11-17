<?php

namespace App\Http\Controllers;

use App\Models\Orientador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class OrientadorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Orientador::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validar
        $validatedData = $request->validate([
            'nomeOrientador' => 'required|string|max:100',
            'emailOrientador' => 'required|string|email|max:50|unique:orientador,emailOrientador',
            'senhaOrientador' => 'required|string|min:8',
            'isAdmin' => 'required|boolean',
        ]);

        // Criar
        $orientador = Orientador::create([
            'nomeOrientador' => $validatedData['nomeOrientador'],
            'emailOrientador' => $validatedData['emailOrientador'],
            'senhaOrientador' => Hash::make($validatedData['senhaOrientador']),
            'isAdmin' => $validatedData['isAdmin'],
        ]);

        return response()->json($orientador, 201);
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
