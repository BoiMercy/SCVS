<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $fillable = [
        'application_id', 'department_id', 'uploaded_by_id', 'label',
        'original_filename', 'stored_path', 'mime_type', 'file_size',
        'file_hash', 'is_resubmission',
    ];

    protected $casts = ['is_resubmission' => 'boolean'];

    public function application()
    {
        return $this->belongsTo(ClearanceApplication::class, 'application_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by_id');
    }
}
