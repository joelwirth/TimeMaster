<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TimeEntry;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $monthlyHours = User::withSum(['timeEntries' => function ($query) {
            $query->whereMonth('start_time', now()->month)
                  ->whereYear('start_time', now()->year)
                  ->whereNotNull('end_time');
        }], DB::raw('strftime("%s", end_time) - strftime("%s", start_time)'))
        ->get()
        ->map(function ($user) {
            $totalSeconds = (int) $user->time_entries_sum_strftime_s_end_time_strftime_s_start_time;
            return [
                'user_name' => $user->name,
                'total_hours' => round($totalSeconds / 3600, 2),
            ];
        });

        return Inertia::render('Admin/Reports/Index', [
            'monthlyHours' => $monthlyHours,
        ]);
    }
}
