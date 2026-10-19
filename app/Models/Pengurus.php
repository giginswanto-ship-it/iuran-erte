<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengurus extends Model
{
    protected $table = 'pengurus';
    public $timestamps = false;
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'jabatan',
        'kategori',
        'nama',
        'blok',
        'telp',
        'badge',
        'badge_color',
        'avatar_bg',
        'tugas'
    ];
}
