<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengumuman extends Model
{
    protected $table = 'pengumuman';
    public $timestamps = false;
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'judul',
        'kategori',
        'badge_color',
        'is_pinned',
        'tanggal',
        'pengirim',
        'isi'
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'tanggal' => 'date'
    ];
}
