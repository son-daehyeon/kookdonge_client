'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { motion } from 'framer-motion';

import { useAuthStore } from '@/features/auth/store';

const HIDDEN_PATHS = ['/login', '/register'];

type NavItem = {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
};

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={active ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={active ? 0 : 1.5}
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
);

const UserIcon = ({ active }: { active: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={active ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={active ? 0 : 1.5}
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: '홈',
    icon: (active) => <HomeIcon active={active} />,
  },
  {
    href: '/mypage',
    label: 'MY',
    icon: (active) => <UserIcon active={active} />,
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const isLoggedIn = useAuthStore((state) => !!state.accessToken);

  if (HIDDEN_PATHS.includes(pathname)) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.includes('?')) return false;
    return pathname.startsWith(href);
  };

  return (
    <nav className="glass fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-t-2xl border-t-0 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const href = item.href === '/mypage' && !isLoggedIn ? '/login' : item.href;

          return (
            <Link
              key={item.href}
              href={href}
              className="relative flex min-w-[64px] flex-col items-center gap-0.5 py-2"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`transition-colors ${
                  active ? 'text-violet-500 dark:text-lime-400' : 'text-zinc-400 dark:text-zinc-500'
                }`}
              >
                {item.icon(active)}
              </motion.div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? 'text-violet-500 dark:text-lime-400' : 'text-zinc-400 dark:text-zinc-500'
                }`}
              >
                {item.label}
              </span>
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-1 h-1 w-6 rounded-full bg-violet-500 dark:bg-lime-400"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
