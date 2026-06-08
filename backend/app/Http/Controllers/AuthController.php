<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'matric_number' => 'required|string|max:255|unique:users',
            'phone' => 'required|string|max:255',
            'faculty' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $studentRole = Role::where('name', 'student')->firstOrFail();

        $user = User::create([
            'role_id' => $studentRole->id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'matric_number' => $request->matric_number,
            'phone' => $request->phone,
            'faculty' => $request->faculty,
            'department' => $request->department,
            'password' => Hash::make($request->password),
            'email_verified_at' => now(), // auto-verify for demo
        ]);

        AuditLog::record('user_registered', $user->id, [
            'description' => "Student {$user->full_name} registered",
        ]);

        return response()->json([
            'message' => 'Registration successful. Please login.',
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            AuditLog::record('login_failed', null, [
                'description' => "Failed login attempt for {$request->email}",
                'metadata' => ['email' => $request->email],
            ]);

            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        $request->session()->regenerate();
        $user = Auth::user();

        $user->update(['last_login_at' => now()]);

        AuditLog::record('login', $user->id, [
            'description' => "User {$user->full_name} logged in",
        ]);

        return response()->json([
            'message' => 'Login successful',
            'user' => $user->load('role'),
            'csrf_token' => csrf_token(),
        ]);
    }

    public function logout(Request $request)
    {
        $userId = Auth::id();
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($userId) {
            AuditLog::record('logout', $userId, [
                'description' => 'User logged out',
            ]);
        }

        return response()->json(['message' => 'Logged out']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user()->load('role'));
    }
}
