<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Avaliador extends Model
{
    use HasFactory;

    protected $table = 'avaliador';
    protected $primaryKey = 'matriculaSiape';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'matriculaSiape',
        'nomeAvaliador',
        'emailAvaliador',
    ];

    // Relacionamento N-para-N com Projeto (tabela avaliar)
    public function projetosAvaliados(): BelongsToMany
    {
        return $this->belongsToMany(Projeto::class, 'avaliar', 'matriculaSiape', 'idProjeto')->withPivot('nomeTrabalho', 'nomeAvaliador', 'criteriosDeAvaliacao', 'anotacoes');
    }

    // Relacionamento N-para-N com Aluno (tabela examinar)
    public function alunosExaminados(): BelongsToMany
    {
        return $this->belongsToMany(Aluno::class, 'examinar', 'matriculaSiape', 'matriculaAluno')->withPivot('nota');
    }
}