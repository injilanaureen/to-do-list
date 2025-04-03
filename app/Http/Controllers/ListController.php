<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ListModel; 

class ListController extends Controller
{
    public function fetchList()
    {
        return response()->json([
            'all_tasks' => ListModel::all(),  // Fetch all tasks
            'pending_tasks' => ListModel::where('status', 'pending')->get(),
            'in_progress_tasks' => ListModel::where('status', 'in-progress')->get(),
            'completed_tasks' => ListModel::where('status', 'completed')->get(),
        ]);
    }

    public function addList(Request $request)
    {
        $request->validate([
            'taskname' => 'required|string|max:255',
            'status' => 'required|in:pending,in-progress,completed'
        ]);

        $task = ListModel::create([
            'taskname' => $request->taskname,
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Task added successfully',
            'task' => $task
        ], 201);
    }
}
