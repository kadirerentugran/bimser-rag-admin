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
    <div className="flex flex-col md:flex-row min-h-screen bg-transparent">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </div>
      </main>
      <Toaster theme="system" position="top-right" richColors />
    </div>
  );
}
