<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['name', 'code', 'description', 'officer_role', 'is_active', 'sort_order'];

    protected $casts = ['is_active' => 'boolean'];

    public function statuses()
    {
        return $this->hasMany(DepartmentStatus::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}
