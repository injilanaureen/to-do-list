<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ListController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/fetchlist',[ListController::class,'fetchList']);
Route::get('/addlist  ',[ListController::class,'addList']);
Route::post('/deletelist/$id',[ListController::class,'deleteList']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
