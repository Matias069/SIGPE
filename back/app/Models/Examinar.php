<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Examinar extends Model
{
    protected $table = 'examinar';
    protected $primaryKey = ['matriculaSiape', 'matriculaAluno'];
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'matriculaAluno',
        'matriculaSiape',
        'notaAluno'
    ];
}