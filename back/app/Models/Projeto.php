<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Projeto extends Model
{
    use HasFactory;

    protected $table = 'projeto';
    protected $primaryKey = 'idProjeto';
    public $timestamps = false;
    protected $fillable = [
        'idOrientador',
        'nomeProjeto',
        'descricaoProjeto',
        'bannerProjeto',
        'senhaAvaliador',
        'anoProjeto',
    ];

    // Um Projeto pertence a um Orientador
    public function orientador(): BelongsTo
    {
        return $this->belongsTo(Orientador::class, 'idOrientador', 'idOrientador');
    }

    // Um Projeto tem muitos Alunos
    public function alunos(): HasMany
    {
        return $this->hasMany(Aluno::class, 'idProjeto', 'idProjeto');
    }

    // Relacionamento N-para-N com Avaliador (tabela avaliar)
    public function avaliacoes()
    {
        return $this->hasMany(Avaliar::class, 'idProjeto', 'idProjeto');
    }
}