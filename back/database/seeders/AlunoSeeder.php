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
        $total = 100;
        for ($i = 0; $i < $total; ++$i) {
            Aluno::create([
                'matriculaAluno' => '20252008'.sprintf("%03d", $i),
                'idProjeto' => $i+1,
                'idTurma' => $i+1,
                'nomeAluno' => "Aluno Número ".($i+1),
            ]);
        }
    }
}