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
        Schema::create('orientador', function (Blueprint $table) {
            $table->increments('idOrientador');
            $table->string('nomeOrientador', 100);
            $table->string('emailOrientador', 50)->unique();
            $table->string('senhaOrientador');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orientador');
    }
};
