<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AbsenceController extends Controller
{
    /**
     * Display the absences page.
     */
    public function index(Request $request)
    {
        return Inertia::render('Absences/Index', [
            'absences' => $request->user()->absences()->orderBy('start_date', 'desc')->get(),
        ]);
    }

    /**
     * Store a newly created absence request in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string',
        ]);

        $request->user()->absences()->create([
            'type' => $request->type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
        ]);

        return Redirect::route('absences.index');
    }
}
