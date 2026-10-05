'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UploadCloud, RefreshCw, MessageSquare, Database, Menu, X } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/upload/word', label: 'Word Yükle', icon: UploadCloud },
  { href: '/reindex', label: 'Vektör Reindex', icon: RefreshCw },
  { href: '/chat', label: ' Chat', icon: MessageSquare },
  { href: '/database', label: 'Veritabanı', icon: Database },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <img src="/logos/bimser.svg" alt="Logo" className="h-10 w-auto" />
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`md:w-64 bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 min-h-screen md:min-h-screen flex flex-col shadow-sm transition-all duration-300 ease-in-out z-40 fixed md:relative w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="hidden md:flex px-4 justify-between items-center border-b border-gray-200 dark:border-gray-700 py-4">
          <img src="/logos/bimser.svg" alt="Logo" className="h-12 w-auto" />
          <ThemeSwitcher />
        </div>

        <nav className="flex-1 mt-4 md:space-y-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 md:py-2.5 rounded-sm transition-all duration-200 border-l-[3px] mx-2 ${isActive
                    ? 'bg-eba-light dark:bg-eba/10 text-eba font-medium border-eba'
                    : 'border-transparent text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}
