<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Absence;
use App\Notifications\AbsenceRequestUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AbsenceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Absences/Index', [
            'absences' => Absence::with('user')->orderBy('created_at', 'desc')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Absence $absence)
    {
        $request->validate([
            'status' => 'required|string|in:approved,rejected',
        ]);

        $absence->update([
            'status' => $request->status,
        ]);

        $absence->user->notify(new AbsenceRequestUpdated($absence));

        return Redirect::route('admin.absences.index');
    }
}
