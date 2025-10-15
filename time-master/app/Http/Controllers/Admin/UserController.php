<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'sometimes|string|in:user,admin',
            'target_hours' => 'sometimes|numeric|min:0',
            'vacation_days' => 'sometimes|numeric|min:0',
        ]);

        if ($request->has('role') && $user->id === auth()->id() && $request->role === 'user') {
            return Redirect::route('admin.users.index')->with('error', 'Sie können Ihre eigene Admin-Rolle nicht entfernen.');
        }

        $user->update($validated);

        return Redirect::route('admin.users.index');
    }
}
