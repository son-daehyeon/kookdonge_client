'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/features/auth/store';

const HIDDEN_PATHS = ['/login', '/register'];

export function Header() {
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!accessToken;

  // 로그인/회원가입 페이지에서는 헤더 숨김
  if (HIDDEN_PATHS.includes(pathname)) {
    return null;
  }

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
