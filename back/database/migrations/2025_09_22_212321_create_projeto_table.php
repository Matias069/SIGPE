<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projeto', function (Blueprint $table) {
            $table->increments('idProjeto');
            $table->unsignedInteger('idOrientador');
            $table->string('nomeProjeto', 100);
            $table->string('descricaoProjeto', 5000);
            $table->string('bannerProjeto')->nullable();
            $table->string('senhaAvaliador');

            $table->foreign('idOrientador')->references('idOrientador')->on('orientador');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projeto');
    }
};
