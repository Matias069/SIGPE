<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Aluno extends Model
{
    use HasFactory;

    protected $table = 'aluno';
    protected $primaryKey = 'matriculaAluno';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'matriculaAluno',
        'nomeAluno',
        'idProjeto',
        'idTurma',
    ];

    // Um Aluno pertence a um Projeto
    public function projeto(): HasOne
    {
        return $this->hasOne(Projeto::class, 'matriculaAluno', 'matriculaAluno');
    }

    // Um Aluno pertence a uma Turma
    public function turma(): BelongsTo
    {
        return $this->belongsTo(Turma::class, 'idTurma', 'idTurma');
    }

    // Relacionamento N-para-N com Avaliador (tabela examinar)
    public function exames(): BelongsToMany
    {
        return $this->belongsToMany(Avaliador::class, 'examinar', 'matriculaAluno', 'matriculaSiape')->withPivot('notaAluno');
    }
}