<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->notifications()->latest()->paginate(30);
    }

    public function markRead(Request $request, Notification $notification)
    {
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $notification->update(['is_read' => true, 'read_at' => now()]);
        return response()->json(['message' => 'Marked as read']);
    }

    public function markAllRead(Request $request)
    {
        $request->user()->notifications()->unread()->update(['is_read' => true, 'read_at' => now()]);
        return response()->json(['message' => 'All marked as read']);
    }

    public function unreadCount(Request $request)
    {
        return response()->json(['count' => $request->user()->notifications()->unread()->count()]);
    }
}
