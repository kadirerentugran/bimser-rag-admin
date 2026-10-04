'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { Toaster } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster theme="system" position="top-right" richColors />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <Toaster theme="system" position="top-right" richColors />
    </div>
  );
}
