import { BottomNav } from '@/components/navigation';

export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-[428px] mx-auto">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
