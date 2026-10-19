<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengumuman', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('judul', 255);
            $table->string('kategori', 100)->index();
            $table->string('badge_color', 50)->default('emerald');
            $table->boolean('is_pinned')->default(false);
            $table->date('tanggal')->index();
            $table->string('pengirim', 150);
            $table->text('isi');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengumuman');
    }
};
