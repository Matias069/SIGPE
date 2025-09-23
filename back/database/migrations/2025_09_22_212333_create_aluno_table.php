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
        Schema::create('aluno', function (Blueprint $table) {
            $table->char('matriculaAluno', 11)->primary();
            $table->string('nomeAluno', 100);
            $table->unsignedInteger('idProjeto');
            $table->unsignedInteger('idTurma');

            $table->foreign('idProjeto')->references('idProjeto')->on('projeto');
            $table->foreign('idTurma')->references('idTurma')->on('turma');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aluno');
    }
};
