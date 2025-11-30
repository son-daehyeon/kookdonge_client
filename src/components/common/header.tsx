'use client';

import Link from 'next/link';

import { useAuthStore } from '@/features/auth/store';

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!accessToken;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-blue-600">
          국동이
        </Link>
        <nav>
          {isLoggedIn ? (
            <Link href="/mypage" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              마이페이지
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
