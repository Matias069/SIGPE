<?php

namespace App\Http\Controllers;

use App\Models\Projeto;
use App\Models\Aluno;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

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
            'descricaoProjeto' => [
                'required',
                'string',
                'max:5000', // Caracteres
                function ($attribute, $value, $fail) {
                    // Função inline para contar palavras (incluindo hífens e acentos)
                    $contarPalavras = function ($texto) {
                        // Utiliza regex (Regular Expression)
                        // \p{L} = qualquer letra Unicode, \p{N} = qualquer número, [-'] permite hífen e apóstrofo
                        preg_match_all("/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/u", $texto, $correspondencias);
                        return count($correspondencias[0]);
                    };

                    $quantidadePalavras = $contarPalavras($value);

                    if ($quantidadePalavras < 250) {
                        $fail("A descrição deve conter no mínimo 250 palavras (atualmente: $quantidadePalavras).");
                    }
                    if ($quantidadePalavras > 500) {
                        $fail("A descrição pode conter no máximo 500 palavras (atualmente: $quantidadePalavras).");
                    }
                }
            ],
            'bannerProjeto' => 'nullable|file|mimes:jpeg,png,jpg,pdf,pptx|max:2048', // 2MB max
            'alunos' => 'required|array|min:3|max:8',
            // idAluno
            'alunos.*' => [
                'required',
                'string',
                'size:11', // Ter exatamente 11 caracteres
                'distinct', // Ser único dentro do próprio array
                // O valor deve existir na tabela 'aluno' na coluna 'matriculaAluno' e o aluno deve estar disponível (não ter projeto associado)
                Rule::exists('aluno', 'matriculaAluno')->whereNull('idProjeto'),
            ],
        ]);

        $bannerPath = null;

        // Inicia a transação de BD para garantir atomicidade
        DB::beginTransaction();
        try {
            // Lidar com o Upload do Banner
            if ($request->hasFile('bannerProjeto')) {
                // Salva o arquivo em 'storage/app/public/banners' e armazena o caminho
                $bannerPath = $request->file('bannerProjeto')->store('banners', 'public');
            }

            // Obter o ID do orientador que está autenticado
            $orientadorId = $request->user()->idOrientador;

            $projeto = Projeto::create([
                'nomeProjeto' => $validatedData['nomeProjeto'],
                'descricaoProjeto' => $validatedData['descricaoProjeto'],
                'idOrientador' => $orientadorId,
                'bannerProjeto' => $bannerPath,
            ]);

            // Associar os Alunos
            Aluno::whereIn('matriculaAluno', $validatedData['alunos'])
                 ->update(['idProjeto' => $projeto->idProjeto]);

            // Se tudo correu bem, confirma as alterações
            DB::commit();

            // Retornar o projeto recém-criado e status 201 - Created
            return response()->json($projeto, 201);

        } catch (\Exception $e) {
            // Se algo falhou, desfaz todas as alterações
            DB::rollBack();

            // Se o arquivo foi salvo mas a BD falhou, apaga o arquivo
            if ($bannerPath) {
                Storage::disk('public')->delete($bannerPath);
            }

            // Retorna o erro
            return response()->json([
                'message' => 'Erro ao cadastrar o projeto.',
                'error' => $e->getMessage()
            ], 500);
        }
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
