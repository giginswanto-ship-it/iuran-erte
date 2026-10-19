<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengurus', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('jabatan', 100);
            $table->string('kategori', 50)->index();
            $table->string('nama', 150);
            $table->string('blok', 50)->nullable();
            $table->string('telp', 50)->nullable();
            $table->string('badge', 50)->nullable();
            $table->string('badge_color', 50)->nullable();
            $table->string('avatar_bg', 50)->nullable();
            $table->text('tugas')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengurus');
    }
};
