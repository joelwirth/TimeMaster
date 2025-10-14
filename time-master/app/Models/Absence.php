<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absence extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'status',
        'start_date',
        'end_date',
        'reason',
    ];

    /**
     * Get the user that owns the absence.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
