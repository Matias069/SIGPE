<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Avaliador;

class AvaliadorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $total = 100;
        for ($i = 0; $i < $total; ++$i) {
            $nome = 'a'.($i+1);

            Avaliador::create([
                'matriculaSiape' => '2025'.sprintf("%03d", $i),
                'nomeAvaliador' => "Avaliador Número ".($i+1),
                'emailAvaliador' => "{$nome}@{$nome}.{$nome}",
            ]);
        }
    }
}