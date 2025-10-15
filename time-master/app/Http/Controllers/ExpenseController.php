<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\User;
use App\Notifications\ExpenseRequestCreated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('Expenses/Index', [
            'expenses' => $request->user()->expenses()->with('category')->orderBy('expense_date', 'desc')->get(),
            'categories' => ExpenseCategory::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'amount' => 'required|numeric|min:0',
            'expense_date' => 'required|date',
            'description' => 'nullable|string',
            'receipt' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('receipt')) {
            $path = $request->file('receipt')->store('receipts', 'public');
        }

        $expense = $request->user()->expenses()->create([
            'expense_category_id' => $request->expense_category_id,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
            'description' => $request->description,
            'receipt_path' => $path,
        ]);

        $admins = User::where('role', 'admin')->get();
        Notification::send($admins, new ExpenseRequestCreated($expense));

        return Redirect::route('expenses.index');
    }
}
