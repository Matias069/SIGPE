<?php

namespace Database\Seeders;
use App\Models\Orientador;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class OrientadorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Orientador::create([
            'nomeOrientador' => "Administrador Número 1",
            'emailOrientador' => "admin@admin.admin",
            'senhaOrientador' => Hash::make('senhaadmin'),
            'isAdmin' => true,
        ]);

        $total = 100;
        for ($i = 1; $i <= $total; ++$i) {
            $nome = 'o'.($i+1);

            Orientador::create([
                'nomeOrientador' => "Orientador Número ".($i+1),
                'emailOrientador' => "{$nome}@{$nome}.{$nome}",
                'senhaOrientador' => Hash::make('senha123'),
                'isAdmin' => false,
            ]);
        }
    }
}
