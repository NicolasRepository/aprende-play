import { Sidebar, MobileSidebarBar } from './Sidebar';

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/50 to-white">
      <Sidebar />
      <MobileSidebarBar />
      <div className="md:pl-64">{children}</div>
    </div>
  );
}
