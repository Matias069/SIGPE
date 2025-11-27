<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Projeto;

class ProjetoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $total = 1000;
        for ($i = 0; $i < $total; ++$i) {
            Projeto::create([
                'idOrientador' => ($i % 2) + 2, // Alterna entre 2 e 3
                'nomeProjeto' => "Projeto Número ".($i+1),
                'descricaoProjeto' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sagittis et leo sed ornare. Aenean sit amet tincidunt nisi, vitae vehicula libero. Suspendisse consectetur velit sit amet porttitor vestibulum. Donec faucibus cursus libero et accumsan. Donec pretium tincidunt faucibus. Curabitur pharetra libero ut nunc dapibus, at porttitor dolor efficitur. Vestibulum nunc purus, tempus eget risus sed, malesuada condimentum libero. Mauris vestibulum eros ac arcu sollicitudin aliquam. Curabitur vehicula vel dui in eleifend. Cras in nibh in nisi maximus feugiat. Cras lectus massa, luctus non auctor id, fermentum id quam. Suspendisse potenti. Curabitur lobortis nec enim et placerat. Integer dignissim gravida leo sodales finibus. Fusce scelerisque tempus nisl, eu eleifend tellus ullamcorper non. Duis mattis vulputate mi vitae volutpat. Duis turpis augue, auctor eu efficitur quis, convallis sed magna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer tincidunt dui et justo tristique, nec placerat enim congue. Aliquam vestibulum lectus ut metus fringilla, eu tincidunt nunc finibus. Nunc odio diam, sodales sit amet dui ut, eleifend interdum ante. Nulla facilisi. Etiam vitae nulla vulputate, dictum leo quis, porttitor ex. Vestibulum eget porttitor massa, molestie ornare nunc. Sed eros nunc, mattis vitae imperdiet vitae, blandit ut mauris. Vivamus nec odio vestibulum, iaculis velit ac, rhoncus orci. Suspendisse non pulvinar urna. Fusce mi mi, bibendum eget lacus eu, fermentum faucibus elit. Suspendisse laoreet tincidunt justo id fermentum. Cras sit amet vestibulum lectus. Ut maximus non lorem id elementum. Morbi faucibus iaculis auctor. Aenean ac libero vel lacus elementum ullamcorper nec eu metus. Donec hendrerit congue ante non mattis. In vitae risus accumsan lacus vehicula sollicitudin non nec massa. Ut faucibus enim in elit tincidunt ullamcorper. Nam non orci ex. Donec eu mattis mauris, et dictum orci. Donec vehicula, turpis sit amet iaculis hendrerit, quam nibh tincidunt nisi, a aliquam.',
                'bannerProjeto' => null,
                'senhaAvaliador' => 'senha de acesso',
            ]);
        }
    }
}