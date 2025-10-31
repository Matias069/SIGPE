<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class Orientador extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'orientador';
    protected $primaryKey = 'idOrientador';
    protected $fillable = [
        'nomeOrientador',
        'emailOrientador',
        'senhaOrientador',
        'isAdmin',
    ];
    protected $hidden = [
        'senhaOrientador',
        'remember_token',
    ];
    public function getAuthPasswordName()
    {
        return 'senhaOrientador';
    }
    protected function casts(): array
    {
        return [
            'senhaOrientador' => 'hashed',
            'isAdmin' => 'boolean',
        ];
    }

    // Orientador tem muitos Projetos
    public function projetos(): HasMany
    {
        return $this->hasMany(Projeto::class, 'idOrientador', 'idOrientador');
    }
}