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
        Schema::create('avaliador', function (Blueprint $table) {
            $table->string('matriculaSiape', 8)->primary();
            $table->string('nomeAvaliador', 100);
            $table->string('emailAvaliador', 50);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('avaliador');
    }
};
