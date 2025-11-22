<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthOrientadorController;
use App\Http\Controllers\ProjetoController;
use App\Http\Controllers\AlunoController;
use App\Http\Controllers\TurmaController;
use App\Http\Controllers\OrientadorController;
use App\Http\Controllers\AvaliadorController;

// Login
Route::post('/login', [AuthOrientadorController::class, 'login']);

// Listar todos os projetos
Route::get('/projetos', [ProjetoController::class, 'index']);
// Buscar um projeto específico
Route::get('/projetos/{id}', [ProjetoController::class, 'show']);

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
        // Rotas de Turma
        Route::get('/turmas', [TurmaController::class, 'index']);
        Route::post('/turmas', [TurmaController::class, 'store']);

        // Rotas de Aluno
        Route::get('/alunos', [AlunoController::class, 'index']);
        Route::post('/alunos', [AlunoController::class, 'store']);
        
        // Rota de Orientador
        Route::post('/orientadores', [OrientadorController::class, 'store']);

        // Rota de Avaliador
        Route::post('/avaliadores', [AvaliadorController::class, 'store']);
    });
});