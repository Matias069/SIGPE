<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Orientador;
use Illuminate\Http\JsonResponse;

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

        // Deleta tokens antigos para evitar acúmulo
        $orientador->tokens()->delete();
        
        // Cria um novo token
        $token = $orientador->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'orientador' => $orientador,
        ]);
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
    public function logout(Request $request): JsonResponse
    {
        // Revoga o token atual do usuário
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout realizado com sucesso']);
    }
}