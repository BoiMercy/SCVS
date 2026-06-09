<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $fillable = [
        'application_id', 'verification_code', 'qr_token',
        'issued_at', 'downloaded_at',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'downloaded_at' => 'datetime',
    ];

    public function application()
    {
        return $this->belongsTo(ClearanceApplication::class, 'application_id');
    }
}
