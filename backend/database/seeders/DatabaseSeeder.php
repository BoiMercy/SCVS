<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // --- Roles ---
        $roles = [
            ['name' => 'student', 'display_name' => 'Student'],
            ['name' => 'library_officer', 'display_name' => 'Library Officer'],
            ['name' => 'bursary_officer', 'display_name' => 'Bursary Officer'],
            ['name' => 'department_officer', 'display_name' => 'Department Officer'],
            ['name' => 'faculty_admin', 'display_name' => 'Faculty Administrator'],
            ['name' => 'hostel_admin', 'display_name' => 'Hostel Administrator'],
            ['name' => 'ict_officer', 'display_name' => 'ICT Officer'],
            ['name' => 'student_affairs_officer', 'display_name' => 'Student Affairs Officer'],
            ['name' => 'super_admin', 'display_name' => 'Super Administrator'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role['name']], $role);
        }

        // --- Departments ---
        $departments = [
            ['name' => 'Library', 'code' => 'LIBRARY', 'officer_role' => 'library_officer', 'sort_order' => 1, 'description' => 'Validates book returns and outstanding fines.'],
            ['name' => 'Bursary', 'code' => 'BURSARY', 'officer_role' => 'bursary_officer', 'sort_order' => 2, 'description' => 'Verifies tuition and fee payments.'],
            ['name' => 'Department', 'code' => 'DEPT', 'officer_role' => 'department_officer', 'sort_order' => 3, 'description' => 'Confirms academic records and project submissions.'],
            ['name' => 'Faculty', 'code' => 'FACULTY', 'officer_role' => 'faculty_admin', 'sort_order' => 4, 'description' => 'Faculty-level endorsement and graduation eligibility.'],
            ['name' => 'Hostel', 'code' => 'HOSTEL', 'officer_role' => 'hostel_admin', 'sort_order' => 5, 'description' => 'Room inspection, key returns, and hostel debts.'],
            ['name' => 'ICT', 'code' => 'ICT', 'officer_role' => 'ict_officer', 'sort_order' => 6, 'description' => 'Device returns and portal compliance.'],
            ['name' => 'Student Affairs', 'code' => 'STUDENT_AFFAIRS', 'officer_role' => 'student_affairs_officer', 'sort_order' => 7, 'description' => 'Disciplinary records and conduct compliance.'],
        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate(['code' => $dept['code']], $dept);
        }

        // --- Demo Super Admin ---
        $adminRole = Role::where('name', 'super_admin')->first();
        User::firstOrCreate(
            ['email' => 'admin@scvs.edu'],
            [
                'role_id' => $adminRole->id,
                'first_name' => 'System',
                'last_name' => 'Administrator',
                'password' => Hash::make('Admin@12345678'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // --- Demo Officers (one per department) ---
        foreach ($departments as $dept) {
            $role = Role::where('name', $dept['officer_role'])->first();
            $emailSlug = str_replace('_', '.', $dept['officer_role']);
            User::firstOrCreate(
                ['email' => "{$emailSlug}@scvs.edu"],
                [
                    'role_id' => $role->id,
                    'first_name' => $dept['name'],
                    'last_name' => 'Officer',
                    'password' => Hash::make('Officer@12345678'),
                    'is_active' => true,
                    'email_verified_at' => now(),
                ]
            );
        }

        // --- Demo Student ---
        $studentRole = Role::where('name', 'student')->first();
        User::firstOrCreate(
            ['email' => 'student@scvs.edu'],
            [
                'role_id' => $studentRole->id,
                'first_name' => 'John',
                'last_name' => 'Doe',
                'matric_number' => 'STU/2025/001',
                'phone' => '+2348012345678',
                'faculty' => 'Engineering',
                'department' => 'Computer Science',
                'password' => Hash::make('Student@12345678'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
