<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\TimeEntry;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'user_id' => 'nullable|integer|exists:users,id',
            'project_id' => 'nullable|integer|exists:projects,id',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);

        $timeEntries = TimeEntry::with(['user', 'project'])
            ->when($request->user_id, fn ($query, $userId) => $query->where('user_id', $userId))
            ->when($request->project_id, fn ($query, $projectId) => $query->where('project_id', $projectId))
            ->when($request->date_from, fn ($query, $dateFrom) => $query->whereDate('start_time', '>=', $dateFrom))
            ->when($request->date_to, fn ($query, $dateTo) => $query->whereDate('start_time', '<=', $dateTo))
            ->whereNotNull('end_time')
            ->orderBy('start_time', 'desc')
            ->get();

        // Calculate total hours for the filtered entries
        $totalHours = $timeEntries->reduce(function ($carry, $entry) {
            return $carry + (strtotime($entry->end_time) - strtotime($entry->start_time));
        }, 0) / 3600;

        return Inertia::render('Admin/Reports/Index', [
            'timeEntries' => $timeEntries,
            'totalHours' => round($totalHours, 2),
            'users' => User::orderBy('name')->get(),
            'projects' => Project::orderBy('name')->get(),
            'filters' => $request->only(['user_id', 'project_id', 'date_from', 'date_to']),
        ]);
    }

    public function export(Request $request)
    {
        $request->validate([
            'user_id' => 'nullable|integer|exists:users,id',
            'project_id' => 'nullable|integer|exists:projects,id',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);

        $timeEntries = TimeEntry::with(['user', 'project'])
            ->when($request->user_id, fn ($query, $userId) => $query->where('user_id', $userId))
            ->when($request->project_id, fn ($query, $projectId) => $query->where('project_id', $projectId))
            ->when($request->date_from, fn ($query, $dateFrom) => $query->whereDate('start_time', '>=', $dateFrom))
            ->when($request->date_to, fn ($query, $dateTo) => $query->whereDate('start_time', '<=', $dateTo))
            ->whereNotNull('end_time')
            ->orderBy('start_time', 'desc')
            ->get();

        $fileName = 'time-report.csv';
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use ($timeEntries) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Mitarbeiter', 'Projekt', 'Start', 'Ende', 'Dauer (Stunden)']);

            foreach ($timeEntries as $entry) {
                fputcsv($file, [
                    $entry->user->name,
                    $entry->project?->name ?? '',
                    $entry->start_time,
                    $entry->end_time,
                    round((strtotime($entry->end_time) - strtotime($entry->start_time)) / 3600, 2),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
