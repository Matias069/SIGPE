<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Projeto;
use App\Models\Aluno;

class ProjetoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $total = 100;
        for ($i = 0; $i < $total; ++$i) {
            Projeto::create([
                'idOrientador' => $i + 2, // Começa do 2 porque o id 1 é admin
                'nomeProjeto' => "Projeto Número ".($i+1),
                'descricaoProjeto' => 'Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit.',
                'bannerProjeto' => null,
            ]);
        }
    }
}