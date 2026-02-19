'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export default function AdminDashboardPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">BookLove Admin</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Books"
            description="Manage your book catalog"
            href="/admin/books"
            count="Coming soon"
          />
          <DashboardCard
            title="Characters"
            description="Manage character profiles"
            href="/admin/characters"
            count="Coming soon"
          />
          <DashboardCard
            title="Analytics"
            description="View site statistics"
            href="/admin/analytics"
            count="Coming soon"
          />
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Setup in progress:</strong> Book and Character management will be available after completing issues #11-13.
          </p>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
  count,
}: {
  title: string;
  description: string;
  href: string;
  count: string;
}) {
  return (
    <Link href={href} className="block bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      <p className="text-2xl font-bold text-gray-900 mt-4">{count}</p>
    </Link>
  );
}
