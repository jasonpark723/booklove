'use client';

import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

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
          <strong>Setup in progress:</strong> Book and Character management will be available after completing issues #12-13.
        </p>
      </div>
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
    <Link
      href={href}
      className="block bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
    >
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      <p className="text-2xl font-bold text-gray-900 mt-4">{count}</p>
    </Link>
  );
}
