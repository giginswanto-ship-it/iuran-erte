<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->date('tanggal')->index();
            $table->string('jenis', 20)->index(); // 'pemasukan' atau 'pengeluaran'
            $table->string('kategori', 100)->index();
            $table->text('uraian');
            $table->bigInteger('nominal');
            $table->string('warga_id', 50)->nullable()->index();
            $table->integer('bulan_iuran')->nullable()->index();
            $table->integer('tahun_iuran')->nullable()->index();
            $table->string('metode', 50)->default('Tunai');

            $table->foreign('warga_id')->references('id')->on('warga')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
