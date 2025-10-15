<?php

namespace App\Http\Controllers;

use App\Models\TimeEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class TimeEntryController extends Controller
{
    /**
     * Start a new time entry for the authenticated user.
     */
    public function start(Request $request)
    {
        $request->validate([
            'project_id' => 'nullable|exists:projects,id',
        ]);

        // Prevent creating a new entry if one is already running
        $existing = TimeEntry::where('user_id', $request->user()->id)->whereNull('end_time')->first();
        if ($existing) {
            return Redirect::route('dashboard')->with('error', 'Eine Zeiterfassung läuft bereits.');
        }

        TimeEntry::create([
            'user_id' => $request->user()->id,
            'project_id' => $request->project_id,
            'start_time' => now(),
        ]);

        return Redirect::route('dashboard');
    }

    /**
     * Stop the active time entry for the authenticated user.
     */
    public function stop(Request $request)
    {
        $activeEntry = TimeEntry::where('user_id', $request->user()->id)->whereNull('end_time')->first();

        if ($activeEntry) {
            $activeEntry->update(['end_time' => now()]);
        }

        return Redirect::route('dashboard');
    }
}
