<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DepartmentStatus extends Model
{
    protected $fillable = [
        'application_id', 'department_id', 'status',
        'reviewed_by_id', 'rejection_reason', 'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function application()
    {
        return $this->belongsTo(ClearanceApplication::class, 'application_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function reviewedBy()
    {
        return $this->belongsTo(User::class, 'reviewed_by_id');
    }
}
