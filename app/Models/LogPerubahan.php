<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogPerubahan extends Model
{
    protected $table = 'log_perubahan';
    public $timestamps = false;

    protected $fillable = [
        'waktu',
        'aksi',
        'keterangan',
        'query_sql'
    ];

    protected $casts = [
        'waktu' => 'datetime'
    ];
}
