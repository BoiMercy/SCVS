<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\ClearanceApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    public function download(Request $request, ClearanceApplication $application)
    {
        if ($application->student_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($application->status !== 'cleared') {
            return response()->json(['message' => 'Not yet cleared.'], 422);
        }

        $cert = Certificate::firstOrCreate(
            ['application_id' => $application->id],
            ['verification_code' => strtoupper(Str::random(12)), 'qr_token' => Str::uuid()->toString(), 'issued_at' => now()]
        );
        $cert->update(['downloaded_at' => now()]);
        $application->load(['student', 'departmentStatuses.department', 'departmentStatuses.reviewedBy']);

        return response()->json(['certificate' => $cert, 'application' => $application]);
    }

    public function verify(Request $request)
    {
        $request->validate(['code' => 'required|string']);
        $cert = Certificate::where('verification_code', $request->code)
            ->orWhere('qr_token', $request->code)
            ->with(['application.student', 'application.departmentStatuses.department'])
            ->first();

        if (!$cert) {
            return response()->json(['valid' => false, 'message' => 'No certificate found.'], 404);
        }

        $s = $cert->application->student;
        return response()->json([
            'valid' => true, 'student_name' => $s->full_name, 'matric_number' => $s->matric_number,
            'faculty' => $s->faculty, 'department' => $s->department,
            'reference_number' => $cert->application->reference_number, 'session' => $cert->application->session,
            'issued_at' => $cert->issued_at->toDateString(),
            'departments' => $cert->application->departmentStatuses->map(fn($ds) => [
                'name' => $ds->department->name, 'status' => $ds->status, 'reviewed_at' => $ds->reviewed_at?->toDateString(),
            ]),
        ]);
    }
}
