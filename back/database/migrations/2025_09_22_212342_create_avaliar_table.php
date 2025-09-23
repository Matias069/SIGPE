<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('avaliar', function (Blueprint $table) {
            $table->unsignedInteger('idProjeto');
            $table->string('matriculaSiape', 8);
            $table->string('nomeTrabalho', 100);
            $table->string('nomeAvaliador', 100);
            $table->json('criteriosDeAvaliacao');
            $table->string('anotacoes', 500)->nullable();

            $table->primary(['idProjeto', 'matriculaSiape']);
            $table->foreign('idProjeto')->references('idProjeto')->on('projeto');
            $table->foreign('matriculaSiape')->references('matriculaSiape')->on('avaliador');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('avaliar');
    }
};
