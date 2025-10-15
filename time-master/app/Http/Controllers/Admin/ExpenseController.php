<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Notifications\ExpenseRequestUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Expenses/Index', [
            'expenses' => Expense::with(['user', 'category'])->orderBy('created_at', 'desc')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expense $expense)
    {
        $request->validate([
            'status' => 'required|string|in:approved,rejected',
        ]);

        $expense->update([
            'status' => $request->status,
        ]);

        $expense->user->notify(new ExpenseRequestUpdated($expense));

        return Redirect::route('admin.expenses.index');
    }
}
