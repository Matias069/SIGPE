<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthOrientadorController;
use App\Http\Controllers\ProjetoController;
use App\Http\Controllers\AlunoController;
use App\Http\Controllers\TurmaController;
use App\Http\Controllers\OrientadorController;
use App\Http\Controllers\AvaliadorController;
use App\Http\Controllers\RelatorioController;

// Login
Route::post('/login', [AuthOrientadorController::class, 'login']);

// Listar avaliadores
Route::get('/avaliadores', [AvaliadorController::class, 'index']);
// Pesquisar avaliadores
Route::get('/avaliadores/search', [AvaliadorController::class, 'search']);
// Buscar critérios (Público para a página de avaliação carregar)
Route::get('/criterios', [ProjetoController::class, 'getCriterios']);

// Listar todos os projetos
Route::get('/projetos', [ProjetoController::class, 'index']);

// Buscar um projeto específico
Route::get('/projetos/{id}', [ProjetoController::class, 'show']);

// Rota para verificar a senha do avaliador
Route::post('/projetos/{id}/acesso', [ProjetoController::class, 'verificarAcesso']);

// Rota para salvar avaliação
Route::post('/projetos/{id}/avaliar', [ProjetoController::class, 'storeAvaliacao']);

// Rotas Privadas
Route::middleware('auth:sanctum')->group(function () {

    // Orientador Autenticado
    Route::get('/user', [AuthOrientadorController::class, 'user']);

    // Logout
    Route::post('/logout', [AuthOrientadorController::class, 'logout']);

    // Cadastrar um novo projeto
    Route::post('/projetos', [ProjetoController::class, 'store']);
    
    // Retorna alunos disponíveis para o dropdown de cadastro
    Route::get('/alunos/disponiveis', [AlunoController::class, 'searchAvailable']);

    // Requer Admin
    Route::middleware('admin')->group(function () {
        // Rotas de Relatório
        Route::get('/relatorios', [RelatorioController::class, 'index']);

        // Rotas de Turma
        Route::get('/turmas', [TurmaController::class, 'index']);
        Route::post('/turmas', [TurmaController::class, 'store']);
        // Pesquisar turmas
        Route::get('/turmas/search', [TurmaController::class, 'search']);

        // Rotas de Aluno
        Route::get('/alunos', [AlunoController::class, 'index']);
        Route::post('/alunos', [AlunoController::class, 'store']);
        
        // Rota de Orientador
        Route::post('/orientadores', [OrientadorController::class, 'store']);

        // Rota de Avaliador
        Route::post('/avaliadores', [AvaliadorController::class, 'store']);

        // Atualizar critérios
        Route::post('/criterios', [ProjetoController::class, 'updateCriterios']);
    });
});