<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = 'settings';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'nama_rt',
        'kelurahan',
        'kecamatan',
        'kota',
        'nama_ketua_rt',
        'nama_bendahara',
        'nominal_iuran',
        'rincian_iuran',
        'tahun_aktif',
        'updated_at'
    ];

    protected $casts = [
        'nominal_iuran' => 'integer',
        'tahun_aktif' => 'integer',
        'updated_at' => 'datetime'
    ];
}
