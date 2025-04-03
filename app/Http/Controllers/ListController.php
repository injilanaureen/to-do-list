<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ListModel; 

class ListController extends Controller
{
    public function fetchList()
    {
        return response()->json([
            'all_tasks' => ListModel::all(),
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

    public function updateTaskStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,in-progress,completed'
        ]);

        try {
            $task = ListModel::findOrFail($id);

            $task->status = $request->status;
            $task->save();

            return response()->json([
                'message' => 'Task status updated successfully',
                'task' => $task
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Task not found or update failed.'
            ], 404);
        }
    }

    // Delete a task by ID
    public function deleteList($id)
    {
        try {
            $task = ListModel::findOrFail($id);

            $task->delete();

            return response()->json([
                'message' => 'Task deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Task not found or deletion failed.'
            ], 404);
        }
    }
}
