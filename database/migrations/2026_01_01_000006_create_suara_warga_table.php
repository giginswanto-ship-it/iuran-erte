<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suara_warga', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('judul', 255);
            $table->string('kategori', 100)->index();
            $table->string('kategori_badge', 50)->default('purple');
            $table->string('pengirim', 150);
            $table->string('blok', 50)->index();
            $table->boolean('is_anonim')->default(false);
            $table->date('tanggal')->index();
            $table->text('isi');
            $table->integer('dukungan')->default(0);
            $table->string('status', 50)->default('Menunggu')->index();
            $table->string('tanggapan_penjawab', 150)->nullable();
            $table->date('tanggapan_tanggal')->nullable();
            $table->text('tanggapan_pesan')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suara_warga');
    }
};
