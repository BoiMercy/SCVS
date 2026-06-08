<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clearance_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->string('reference_number')->unique();
            $table->string('session'); // e.g. 2025/2026
            $table->enum('status', ['pending', 'in_review', 'cleared', 'rejected'])->default('pending');
            $table->timestamp('submitted_at');
            $table->timestamp('cleared_at')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clearance_applications');
    }
};
