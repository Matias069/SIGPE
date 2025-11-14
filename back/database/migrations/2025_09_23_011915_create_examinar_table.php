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
        Schema::create('examinar', function (Blueprint $table) {
            $table->string('matriculaSiape', 8);
            $table->char('matriculaAluno', 11);
            $table->tinyInteger('notaAluno')->unsigned();
            $table->primary(['matriculaSiape', 'matriculaAluno']);

            $table->foreign('matriculaSiape')->references('matriculaSiape')->on('avaliador');
            $table->foreign('matriculaAluno')->references('matriculaAluno')->on('aluno');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('examinar');
    }
};
