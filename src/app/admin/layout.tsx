import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | BookLove',
  description: 'BookLove Admin Panel',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
