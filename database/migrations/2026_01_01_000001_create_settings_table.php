<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->integer('id')->primary();
            $table->string('nama_rt', 100);
            $table->string('kelurahan', 100)->nullable();
            $table->string('kecamatan', 100)->nullable();
            $table->string('kota', 100)->nullable();
            $table->string('nama_ketua_rt', 100)->nullable();
            $table->string('nama_bendahara', 100)->nullable();
            $table->integer('nominal_iuran')->default(150000);
            $table->text('rincian_iuran')->nullable();
            $table->integer('tahun_aktif')->default(2026);
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
