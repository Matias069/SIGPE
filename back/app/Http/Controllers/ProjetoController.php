<?php

namespace App\Http\Controllers;

use App\Models\Projeto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjetoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Projeto::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nomeProjeto' => 'required|string|max:100',
            'descricaoProjeto' => 'required|string|max:500',
            // TODO: bannerProjeto
        ]);

        $orientadorId = $request->user()->idOrientador;

        $projeto = Projeto::create([
            'nomeProjeto' => $validatedData['nomeProjeto'],
            'descricaoProjeto' => $validatedData['descricaoProjeto'],
            'idOrientador' => $orientadorId,
            'bannerProjeto' => null //TODO
        ]);

        return response()->json($projeto, 201);
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
