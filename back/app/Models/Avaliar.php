<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Avaliar extends Model
{
    protected $table = 'avaliar';
    public $timestamps = false;
    public $incrementing = false;

    protected $primaryKey = ['idProjeto', 'matriculaSiape'];

    protected $fillable = [
        'idProjeto',
        'matriculaSiape',
        'nomeTrabalho',
        'nomeAvaliador',
        'criteriosDeAvaliacao',
        'anotacoes'
    ];

    protected $casts = [
        'criteriosDeAvaliacao' => 'array',
    ];

    public function avaliador()
    {
        return $this->belongsTo(Avaliador::class, 'matriculaSiape', 'matriculaSiape');
    }
}