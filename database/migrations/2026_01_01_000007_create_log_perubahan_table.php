<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('log_perubahan', function (Blueprint $table) {
            $table->id();
            $table->timestamp('waktu')->useCurrent()->index();
            $table->string('aksi', 100);
            $table->text('keterangan')->nullable();
            $table->text('query_sql')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_perubahan');
    }
};
