<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OfficerController;
use Illuminate\Support\Facades\Route;

// --- Public Routes ---
Route::prefix('v1')->group(function () {
    Route::get('/csrf-token', fn() => response()->json(['csrf_token' => csrf_token()]));

    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/verify', [CertificateController::class, 'verify']);

    // --- Authenticated Routes ---
    Route::middleware(['auth:sanctum', 'web'])->group(function () {
        Route::get('/auth/user', [AuthController::class, 'user']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Notifications
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);

        // Student: Applications
        Route::post('/applications', [ApplicationController::class, 'store']);
        Route::get('/applications/current', [ApplicationController::class, 'current']);
        Route::post('/applications/{application}/attachments', [ApplicationController::class, 'uploadAttachments']);
        Route::post('/applications/{application}/remediate/{department}', [ApplicationController::class, 'remediate']);
        Route::get('/applications/{application}/certificate', [CertificateController::class, 'download']);

        // Officer: Reviews
        Route::get('/officer/queue', [OfficerController::class, 'queue']);
        Route::get('/officer/reviews/{status}', [OfficerController::class, 'show']);
        Route::post('/officer/reviews/{status}/approve', [OfficerController::class, 'approve']);
        Route::post('/officer/reviews/{status}/reject', [OfficerController::class, 'reject']);
        Route::get('/officer/history', [OfficerController::class, 'history']);

        // Admin
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::post('/admin/users', [AdminController::class, 'storeUser']);
        Route::patch('/admin/users/{user}', [AdminController::class, 'updateUser']);
        Route::get('/admin/roles', [AdminController::class, 'roles']);
        Route::get('/admin/departments', [AdminController::class, 'departments']);
        Route::get('/admin/reports', [AdminController::class, 'reports']);
        Route::get('/admin/audit-logs', [AdminController::class, 'auditLogs']);
    });
});
