<?php

namespace App\Http\Controllers;

use App\Models\Turma;
use App\Http\Controllers\AlunoController;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RelatorioController extends Controller
{
    /**
     * Função de busca para turmas.
     */
    protected function searchTurma(Request $request)
    {
        // Inicia a query
        $query = Turma::query();

        // Se houver um parâmetro 'search' na URL e não estiver vazio
        if ($request->has('search') && $request->query('search') !== '') {
            // Converte o termo de busca para minúsculas
            $searchTerm = strtolower($request->query('search'));

            $query->where(function ($q) use ($searchTerm) {
                // Case Insensitive LIKE
                $q->where('curso', 'ILIKE', "%{$searchTerm}%")
                  ->orWhere('numeroTurma', 'LIKE', "%{$searchTerm}%");
            });
        }

        return $query;
    }

    /**
     * Retorna uma lista de turmas com seus alunos e notas de examinação.
     * Pode ser filtrado por número da turma ou curso.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): Response
    {
        // Usa a função searchTurma para aplicar filtros
        $query = $this->searchTurma($request);

        // Carregar relações
        $turmas = $query
        ->with([
            'alunos' => function ($query) {
                $query->select('aluno.matriculaAluno', 'aluno.nomeAluno', 'aluno.idTurma');
            },
        ])
        ->get();

        // Instancia o AlunoController uma vez
        $alunoController = new AlunoController();

        // Formata cada turma com os alunos e suas notas
        $formattedTurmas = $turmas->map(function ($turma) use ($alunoController) {
            $alunosData = $turma->alunos->map(function ($aluno) use ($alunoController) {
                // Chama calcularNota para pegar os dados completos do aluno
                $notaData = $alunoController->calcularNota($aluno->matriculaAluno)->getData();  // O método getData() extrai o objeto PHP da JsonResponse

                return [
                    'nomeAluno' => $aluno->nomeAluno,
                    'notaExaminacao' => $notaData->nota_final, // Já vem formatada ou null
                    'statusAvaliacao' => $notaData->status_avaliacao, // pendente, em_andamento, concluido
                    'qtdAvaliacoes' => $notaData->qtd_avaliacoes
                ];
            });

            return [
                'idTurma' => $turma->idTurma,
                'numeroTurma' => $turma->numeroTurma,
                'curso' => $turma->curso,
                'alunos' => $alunosData,
            ];
        });

        return response()->json($formattedTurmas, 200);
    }
}