<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verifica se o utilizador está logado e se a sua flag 'isAdmin' é verdadeira
        if ($request->user() && $request->user()->isAdmin) {
            // Se for admin, permite que o pedido continue para o Controller
            return $next($request);
        }

        // Se não for admin, bloqueia o pedido com um erro 403 (Proibido)
        return response()->json([
            'message' => 'Acesso não autorizado.'
        ], 403);
    }
}
