<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Turma extends Model
{
    use HasFactory;

    protected $table = 'turma';
    protected $primaryKey = 'idTurma';
    public $timestamps = false;
    protected $fillable = [
        'numeroTurma',
        'curso',
    ];

    // Uma Turma tem muitos Alunos
    public function alunos(): HasMany
    {
        return $this->hasMany(Aluno::class, 'idTurma', 'idTurma');
    }
}