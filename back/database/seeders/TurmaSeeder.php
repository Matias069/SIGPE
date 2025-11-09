<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Turma;

class TurmaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cursos = ['Agropecuária', 'Meio Ambiente', 'Informática', 'Agroindústria'];
        $total = 100;
        for ($i = 0; $i < $total; ++$i) {
            Turma::create([
                'numeroTurma' => ($i % 3 + 1)*100 + $i,
                'curso' => $cursos[$i % 4],
            ]);
        }
    }
}