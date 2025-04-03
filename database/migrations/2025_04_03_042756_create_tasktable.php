<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('tasktable', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('taskname'); // Task name
            $table->enum('status', ['pending', 'in-progress', 'completed'])->default('pending'); // Task status
            $table->timestamps(); // Created at & Updated at
        });
    }

    public function down()
    {
        Schema::dropIfExists('tasktable');
    }
};

