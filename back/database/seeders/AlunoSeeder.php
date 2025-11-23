<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Aluno;

class AlunoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $total = 3500;
        for ($i = 0; $i < $total; ++$i) {
            // Turma muda a cada 350 alunos
            $idTurma = intdiv($i, 350) + 1;

            if ($i<3000) {
                Aluno::create([
                    'matriculaAluno' => '2025'.sprintf("%07d", $i),
                    // Projetos em grupos de 3 alunos
                    'idProjeto' => intdiv($i, 3)+1,
                    'idTurma' => $idTurma,
                    'nomeAluno' => "Aluno Número ".($i+1),
                ]);
            } else {
                Aluno::create([
                    'matriculaAluno' => '2025'.sprintf("%07d", $i),
                    // Alunos sem projeto
                    'idTurma' => $idTurma,
                    'nomeAluno' => "Aluno Número ".($i+1),
                ]);
            }
        }
    }
}