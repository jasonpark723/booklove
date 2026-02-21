import { BottomNav } from '@/components/navigation';
import { UserProvider } from '@/context/UserContext';

export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-[428px] mx-auto">
          {children}
        </div>
        <BottomNav />
      </div>
    </UserProvider>
  );
}
