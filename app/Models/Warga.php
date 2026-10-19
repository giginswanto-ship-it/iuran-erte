<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Warga extends Model
{
    protected $table = 'warga';
    public $timestamps = false;
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'blok',
        'nama',
        'telp',
        'status',
        'nominal_iuran'
    ];

    protected $casts = [
        'nominal_iuran' => 'integer'
    ];

    public function transaksi(): HasMany
    {
        return $this->hasMany(Transaksi::class, 'warga_id', 'id');
    }
}
