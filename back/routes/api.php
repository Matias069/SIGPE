<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Orientador;
use App\Http\Controllers\ProjetoController;

// Login
Route::post('/login', function (Request $request) {
    $request->validate([
        'emailOrientador' => 'required|email',
        'senhaOrientador' => 'required',
    ]);

    $orientador = Orientador::where('emailOrientador', $request->emailOrientador)->first();
    if (!$orientador || !Hash::check($request->senhaOrientador, $orientador->senhaOrientador)) {
        throw ValidationException::withMessages([
            'emailOrientador' => ['As credenciais fornecidas estão incorretas.'],
        ]);
    }

    Auth::guard('web')->login($orientador, $request->boolean('remember'));
    $request->session()->regenerate();
    return response()->json($orientador);
});

// Listar todos os projetos
Route::get('/projetos', [ProjetoController::class, 'index']);

// Rotas Privadas
Route::middleware('auth:sanctum')->group(function () {

    // Orientador Autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Logout
    Route::post('/logout', function (Request $request) {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->noContent();
    });

    // Cadastrar um novo projeto
    Route::post('/projetos', [ProjetoController::class, 'store']);
});