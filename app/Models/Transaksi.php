<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaksi extends Model
{
    protected $table = 'transaksi';
    public $timestamps = false;
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'tanggal',
        'jenis',
        'kategori',
        'uraian',
        'nominal',
        'warga_id',
        'bulan_iuran',
        'tahun_iuran',
        'metode'
    ];

    protected $casts = [
        'tanggal' => 'date',
        'nominal' => 'integer',
        'bulan_iuran' => 'integer',
        'tahun_iuran' => 'integer'
    ];

    public function warga(): BelongsTo
    {
        return $this->belongsTo(Warga::class, 'warga_id', 'id');
    }
}
