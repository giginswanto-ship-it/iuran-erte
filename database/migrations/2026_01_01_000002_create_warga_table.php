<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warga', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('blok', 50)->index();
            $table->string('nama', 150);
            $table->string('telp', 50)->nullable();
            $table->string('status', 50)->default('Tetap');
            $table->integer('nominal_iuran')->default(150000);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warga');
    }
};
