<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Absence;
use App\Models\Expense;
use App\Models\TimeEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard/Index', [
            'pendingAbsencesCount' => Absence::where('status', 'pending')->count(),
            'pendingExpensesCount' => Expense::where('status', 'pending')->count(),
            'activeTimeEntriesCount' => TimeEntry::whereNull('end_time')->count(),
        ]);
    }
}
