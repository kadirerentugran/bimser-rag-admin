import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UploadCloud, RefreshCw, MessageSquare, Database } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/upload/word', label: 'Word Yükle', icon: UploadCloud },
  { href: '/reindex', label: 'Vektör Reindex', icon: RefreshCw },
  { href: '/chat', label: ' Chat', icon: MessageSquare },
  { href: '/database', label: 'Veritabanı', icon: Database },
];


export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 min-h-screen flex flex-col shadow-sm">
      <div className=" px-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
        <img src="/logos/bimser.svg" alt="Logo" className="h-30 w-auto" />
        <ThemeSwitcher />
      </div>

      <nav className="flex-1 space-y-2 space-x-4 ">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-sm transition-all duration-200 border-l-[3px] ${isActive
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
  );
}
