<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuaraWarga extends Model
{
    protected $table = 'suara_warga';
    public $timestamps = false;
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'judul',
        'kategori',
        'kategori_badge',
        'pengirim',
        'blok',
        'is_anonim',
        'tanggal',
        'isi',
        'dukungan',
        'status',
        'tanggapan_penjawab',
        'tanggapan_tanggal',
        'tanggapan_pesan'
    ];

    protected $casts = [
        'is_anonim' => 'boolean',
        'tanggal' => 'date',
        'tanggapan_tanggal' => 'date',
        'dukungan' => 'integer'
    ];
}
