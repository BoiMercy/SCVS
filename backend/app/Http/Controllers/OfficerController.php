<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Department;
use App\Models\DepartmentStatus;
use App\Models\Notification;
use App\Services\ClearanceSyncService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OfficerController extends Controller
{
    /**
     * Get pending reviews for the officer's department.
     */
    public function queue(Request $request)
    {
        $dept = $this->getOfficerDepartment($request->user());

        if (!$dept) {
            return response()->json(['message' => 'No department assigned to your role.'], 403);
        }

        $statuses = DepartmentStatus::where('department_id', $dept->id)
            ->where('status', 'pending')
            ->with(['application.student', 'application.attachments' => function ($q) use ($dept) {
                $q->where('department_id', $dept->id)->orWhereNull('department_id');
            }])
            ->latest()
            ->paginate(20);

        return response()->json([
            'department' => $dept,
            'queue' => $statuses,
        ]);
    }

    /**
     * View a specific application's details for review.
     */
    public function show(Request $request, DepartmentStatus $status)
    {
        $dept = $this->getOfficerDepartment($request->user());

        if (!$dept || $status->department_id !== $dept->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $status->load([
            'application.student',
            'application.attachments',
            'application.departmentStatuses.department',
            'department',
            'reviewedBy',
        ]);

        return response()->json($status);
    }

    /**
     * Approve a department status.
     */
    public function approve(Request $request, DepartmentStatus $status)
    {
        $dept = $this->getOfficerDepartment($request->user());

        if (!$dept || $status->department_id !== $dept->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($status->status !== 'pending') {
            return response()->json(['message' => 'This item has already been reviewed.'], 422);
        }

        $status->update([
            'status' => 'approved',
            'reviewed_by_id' => $request->user()->id,
            'reviewed_at' => now(),
            'rejection_reason' => null,
        ]);

        // Notify student
        Notification::create([
            'user_id' => $status->application->student_id,
            'type' => 'approval',
            'title' => "{$dept->name} Approved",
            'message' => "Your clearance has been approved by the {$dept->name} department.",
            'related_type' => DepartmentStatus::class,
            'related_id' => $status->id,
        ]);

        AuditLog::record('department_approved', $request->user()->id, [
            'resource_type' => DepartmentStatus::class,
            'resource_id' => $status->id,
            'description' => "{$dept->name} approved for application #{$status->application->reference_number}",
        ]);

        // Sync master status
        ClearanceSyncService::sync($status->application);

        return response()->json(['message' => 'Approved successfully.']);
    }

    /**
     * Reject a department status.
     */
    public function reject(Request $request, DepartmentStatus $status)
    {
        $dept = $this->getOfficerDepartment($request->user());

        if (!$dept || $status->department_id !== $dept->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($status->status !== 'pending') {
            return response()->json(['message' => 'This item has already been reviewed.'], 422);
        }

        $request->validate([
            'rejection_reason' => 'required|string|min:10|max:1000',
        ]);

        $status->update([
            'status' => 'rejected',
            'reviewed_by_id' => $request->user()->id,
            'reviewed_at' => now(),
            'rejection_reason' => $request->rejection_reason,
        ]);

        // Notify student
        Notification::create([
            'user_id' => $status->application->student_id,
            'type' => 'rejection',
            'title' => "{$dept->name} Rejected",
            'message' => "Your clearance was rejected by {$dept->name}: {$request->rejection_reason}",
            'related_type' => DepartmentStatus::class,
            'related_id' => $status->id,
        ]);

        AuditLog::record('department_rejected', $request->user()->id, [
            'resource_type' => DepartmentStatus::class,
            'resource_id' => $status->id,
            'description' => "{$dept->name} rejected for application #{$status->application->reference_number}",
        ]);

        // Sync master status
        ClearanceSyncService::sync($status->application);

        return response()->json(['message' => 'Rejected.']);
    }

    /**
     * Get officer's review history.
     */
    public function history(Request $request)
    {
        $dept = $this->getOfficerDepartment($request->user());

        if (!$dept) {
            return response()->json(['message' => 'No department assigned.'], 403);
        }

        $statuses = DepartmentStatus::where('department_id', $dept->id)
            ->whereIn('status', ['approved', 'rejected'])
            ->with(['application.student', 'reviewedBy'])
            ->latest('reviewed_at')
            ->paginate(20);

        return response()->json($statuses);
    }

    /**
     * Resolve the officer's department by their role.
     */
    private function getOfficerDepartment($user): ?Department
    {
        return Department::where('officer_role', $user->role->name)->first();
    }
}
