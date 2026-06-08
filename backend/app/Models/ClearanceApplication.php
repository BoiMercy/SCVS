<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClearanceApplication extends Model
{
    protected $fillable = [
        'student_id', 'reference_number', 'session', 'status',
        'submitted_at', 'cleared_at', 'ip_address', 'user_agent',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'cleared_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function departmentStatuses()
    {
        return $this->hasMany(DepartmentStatus::class, 'application_id');
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class, 'application_id');
    }

    public function certificate()
    {
        return $this->hasOne(Certificate::class, 'application_id');
    }

    public function isCleared(): bool
    {
        return $this->status === 'cleared';
    }

    /**
     * Generate a unique reference number.
     */
    public static function generateReference(): string
    {
        $year = date('Y');
        $count = self::whereYear('created_at', $year)->count() + 1;
        return 'CLR-' . $year . '-' . str_pad($count, 5, '0', STR_PAD_LEFT);
    }
}
