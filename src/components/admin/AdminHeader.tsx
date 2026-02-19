'use client';

import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      {/* Left side - Menu button (mobile) */}
      <button
        onClick={onMenuClick}
        className="p-2 text-gray-500 hover:text-gray-700 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title (mobile only) */}
      <span className="text-lg font-semibold text-gray-900 lg:hidden">
        Admin
      </span>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Right side - User info and sign out */}
      <div className="flex items-center gap-4">
        <span
          className="text-sm text-gray-600 max-w-[150px] truncate hidden sm:block"
          title={user?.email || ''}
        >
          {user?.email}
        </span>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
