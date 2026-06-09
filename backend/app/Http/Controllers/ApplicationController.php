<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\AuditLog;
use App\Models\ClearanceApplication;
use App\Models\Department;
use App\Models\DepartmentStatus;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ApplicationController extends Controller
{
    /**
     * Submit a new clearance application.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user->isStudent()) {
            return response()->json(['message' => 'Only students can submit applications.'], 403);
        }

        // Check for existing active application
        $existing = ClearanceApplication::where('student_id', $user->id)
            ->whereIn('status', ['pending', 'in_review'])
            ->exists();

        if ($existing) {
            return response()->json(['message' => 'You already have an active clearance application.'], 422);
        }

        $request->validate([
            'session' => 'required|string|max:20',
        ]);

        return DB::transaction(function () use ($user, $request) {
            $application = ClearanceApplication::create([
                'student_id' => $user->id,
                'reference_number' => ClearanceApplication::generateReference(),
                'session' => $request->session,
                'status' => 'pending',
                'submitted_at' => now(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Create a department_status row for each active department
            $departments = Department::active()->ordered()->get();
            foreach ($departments as $dept) {
                DepartmentStatus::create([
                    'application_id' => $application->id,
                    'department_id' => $dept->id,
                    'status' => 'pending',
                ]);
            }

            AuditLog::record('application_submitted', $user->id, [
                'resource_type' => ClearanceApplication::class,
                'resource_id' => $application->id,
                'description' => "Clearance application {$application->reference_number} submitted",
            ]);

            return response()->json([
                'message' => 'Application submitted successfully.',
                'application' => $application->load('departmentStatuses.department'),
            ], 201);
        });
    }

    /**
     * Get the student's current/latest application.
     */
    public function current(Request $request)
    {
        $application = ClearanceApplication::where('student_id', $request->user()->id)
            ->with(['departmentStatuses.department', 'departmentStatuses.reviewedBy', 'attachments', 'certificate'])
            ->latest()
            ->first();

        if (!$application) {
            return response()->json(['message' => 'No application found.', 'application' => null]);
        }

        return response()->json(['application' => $application]);
    }

    /**
     * Upload attachments for an application.
     */
    public function uploadAttachments(Request $request, ClearanceApplication $application)
    {
        if ($application->student_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'files' => 'required|array|min:1',
            'files.*.file' => 'required|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
            'files.*.label' => 'required|string|max:255',
            'files.*.department_id' => 'nullable|exists:departments,id',
        ]);

        $uploaded = [];
        foreach ($request->file('files') as $index => $fileData) {
            $file = $request->file("files.{$index}.file");
            $label = $request->input("files.{$index}.label");
            $deptId = $request->input("files.{$index}.department_id");

            $path = $file->store('attachments', 'local');

            $uploaded[] = Attachment::create([
                'application_id' => $application->id,
                'department_id' => $deptId,
                'uploaded_by_id' => $request->user()->id,
                'label' => $label,
                'original_filename' => $file->getClientOriginalName(),
                'stored_path' => $path,
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'file_hash' => hash_file('sha256', $file->getRealPath()),
            ]);
        }

        return response()->json([
            'message' => count($uploaded) . ' file(s) uploaded.',
            'attachments' => $uploaded,
        ]);
    }

    /**
     * Remediate: re-upload for a rejected department.
     */
    public function remediate(Request $request, ClearanceApplication $application, Department $department)
    {
        if ($application->student_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $status = DepartmentStatus::where('application_id', $application->id)
            ->where('department_id', $department->id)
            ->where('status', 'rejected')
            ->first();

        if (!$status) {
            return response()->json(['message' => 'This department has not rejected your application.'], 422);
        }

        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
            'label' => 'required|string|max:255',
        ]);

        $file = $request->file('file');
        $path = $file->store('attachments', 'local');

        Attachment::create([
            'application_id' => $application->id,
            'department_id' => $department->id,
            'uploaded_by_id' => $request->user()->id,
            'label' => $request->label,
            'original_filename' => $file->getClientOriginalName(),
            'stored_path' => $path,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'file_hash' => hash_file('sha256', $file->getRealPath()),
            'is_resubmission' => true,
        ]);

        // Reset department status back to pending
        $status->update([
            'status' => 'pending',
            'rejection_reason' => null,
            'reviewed_by_id' => null,
            'reviewed_at' => null,
        ]);

        // Recalculate master status
        \App\Services\ClearanceSyncService::sync($application);

        // Notify the department officers
        $officerRole = $department->officer_role;
        $officers = \App\Models\User::whereHas('role', fn($q) => $q->where('name', $officerRole))->get();
        foreach ($officers as $officer) {
            Notification::create([
                'user_id' => $officer->id,
                'type' => 'system',
                'title' => 'Resubmission Received',
                'message' => "Student {$application->student->full_name} has resubmitted documents for review.",
                'related_type' => ClearanceApplication::class,
                'related_id' => $application->id,
            ]);
        }

        AuditLog::record('remediation_submitted', $request->user()->id, [
            'resource_type' => DepartmentStatus::class,
            'resource_id' => $status->id,
            'description' => "Remediation submitted for {$department->name}",
        ]);

        return response()->json(['message' => 'Resubmission successful. Department will re-review.']);
    }
}
