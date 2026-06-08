<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\ClearanceApplication;
use App\Models\Department;
use App\Models\DepartmentStatus;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $total = ClearanceApplication::count();
        $cleared = ClearanceApplication::where('status', 'cleared')->count();
        $rejected = ClearanceApplication::where('status', 'rejected')->count();
        $pending = ClearanceApplication::whereIn('status', ['pending', 'in_review'])->count();

        $departments = Department::active()->ordered()->get()->map(function ($dept) {
            $s = DepartmentStatus::where('department_id', $dept->id);
            return [
                'id' => $dept->id, 'name' => $dept->name,
                'approved' => (clone $s)->where('status', 'approved')->count(),
                'rejected' => (clone $s)->where('status', 'rejected')->count(),
                'pending' => (clone $s)->where('status', 'pending')->count(),
            ];
        });

        $recent = AuditLog::with('user')->latest('created_at')->limit(20)->get();

        return response()->json(compact('total', 'cleared', 'rejected', 'pending', 'departments', 'recent'));
    }

    public function users(Request $request)
    {
        return User::with('role')->when($request->role, fn($q, $r) => $q->whereHas('role', fn($rq) => $rq->where('name', $r)))->paginate(20);
    }

    public function storeUser(Request $request)
    {
        $data = $request->validate([
            'first_name' => 'required|string', 'last_name' => 'required|string',
            'email' => 'required|email|unique:users', 'role_id' => 'required|exists:roles,id',
            'password' => 'required|string|min:8',
        ]);
        $data['password'] = bcrypt($data['password']);
        $data['email_verified_at'] = now();
        return response()->json(User::create($data)->load('role'), 201);
    }

    public function updateUser(Request $request, User $user)
    {
        $data = $request->validate([
            'first_name' => 'string', 'last_name' => 'string',
            'email' => "email|unique:users,email,{$user->id}", 'role_id' => 'exists:roles,id',
            'is_active' => 'boolean',
        ]);
        $user->update($data);
        return response()->json($user->load('role'));
    }

    public function roles()
    {
        return Role::all();
    }

    public function departments()
    {
        return Department::active()->ordered()->get();
    }

    public function reports(Request $request)
    {
        $apps = ClearanceApplication::with('student')
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->from, fn($q, $d) => $q->whereDate('submitted_at', '>=', $d))
            ->when($request->to, fn($q, $d) => $q->whereDate('submitted_at', '<=', $d))
            ->latest()->get();

        return response()->json($apps);
    }

    public function auditLogs(Request $request)
    {
        return AuditLog::with('user')
            ->when($request->action, fn($q, $a) => $q->where('action', $a))
            ->latest('created_at')->paginate(50);
    }
}
