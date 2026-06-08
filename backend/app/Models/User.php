<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'role_id', 'first_name', 'last_name', 'email', 'matric_number',
        'phone', 'faculty', 'department', 'password', 'is_active',
        'last_login_at', 'password_changed_at',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
            'password_changed_at' => 'datetime',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function applications()
    {
        return $this->hasMany(ClearanceApplication::class, 'student_id');
    }

    public function reviewedStatuses()
    {
        return $this->hasMany(DepartmentStatus::class, 'reviewed_by_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function hasRole(string $role): bool
    {
        return $this->role->name === $role;
    }

    public function isStudent(): bool
    {
        return $this->hasRole('student');
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('super_admin');
    }

    public function isOfficer(): bool
    {
        return str_ends_with($this->role->name, '_officer') || str_ends_with($this->role->name, '_admin');
    }
}
