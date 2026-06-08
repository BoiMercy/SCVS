<?php

namespace App\Services;

use App\Models\ClearanceApplication;
use App\Models\Notification;

class ClearanceSyncService
{
    /**
     * Recalculate the master application status based on all department statuses.
     * Rules (PRD §17):
     *   - Any rejection → master = rejected
     *   - All approved → master = cleared (set cleared_at)
     *   - Otherwise → master = in_review
     */
    public static function sync(ClearanceApplication $application): void
    {
        $statuses = $application->departmentStatuses()->get();

        if ($statuses->isEmpty()) {
            return;
        }

        $hasRejection = $statuses->contains('status', 'rejected');
        $allApproved = $statuses->every(fn($s) => $s->status === 'approved');

        if ($hasRejection) {
            $application->update(['status' => 'rejected']);

            Notification::create([
                'user_id' => $application->student_id,
                'type' => 'rejection',
                'title' => 'Clearance Rejected',
                'message' => 'One or more departments have rejected your clearance application. Please review and remediate.',
                'related_type' => ClearanceApplication::class,
                'related_id' => $application->id,
            ]);
        } elseif ($allApproved) {
            $application->update([
                'status' => 'cleared',
                'cleared_at' => now(),
            ]);

            Notification::create([
                'user_id' => $application->student_id,
                'type' => 'certificate_ready',
                'title' => 'Clearance Complete!',
                'message' => 'All departments have approved your clearance. Your certificate is now available for download.',
                'related_type' => ClearanceApplication::class,
                'related_id' => $application->id,
            ]);
        } else {
            $application->update(['status' => 'in_review']);
        }
    }
}
