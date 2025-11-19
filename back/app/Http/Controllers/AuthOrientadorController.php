<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Orientador;

class AuthOrientadorController extends Controller
{
    /**
     * Handle an incoming authentication request (Login).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $request->validate([
            'emailOrientador' => 'required|email',
            'senhaOrientador' => 'required',
        ]);

        $orientador = Orientador::where('emailOrientador', $request->emailOrientador)->first();
        
        // Verifica as credenciais
        if (!$orientador || !Hash::check($request->senhaOrientador, $orientador->senhaOrientador)) {
            throw ValidationException::withMessages([
                'emailOrientador' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }

        // Realiza o login usando o guard 'web' (session-based)
        Auth::guard('web')->login($orientador, $request->boolean('remember'));
        
        // Regenera a sessão para evitar Session Fixation
        $request->session()->regenerate();

        return response()->json($orientador);
    }

    /**
     * Get the authenticated Orientador.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(Request $request)
    {
        // Retorna o usuário autenticado (requer middleware 'auth:sanctum')
        return response()->json($request->user());
    }

    /**
     * Log the Orientador out (invalidate the session).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout(); // Efetua o logout do guard 'web'
        
        $request->session()->invalidate(); // Invalida a sessão
        $request->session()->regenerateToken(); // Regenera o token CSRF

        return response()->noContent();
    }
}