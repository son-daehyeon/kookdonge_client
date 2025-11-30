'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Spinner } from '@heroui/react';

import { authApi } from './api';
import { useAuthStore } from './store';

const PUBLIC_PATHS = ['/login', '/register'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setUser = useAuthStore((state) => state.setUser);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    const initAuth = async () => {
      // 토큰이 없으면 인증 실패
      if (!accessToken) {
        setInitialized(true);
        if (!isPublicPath) {
          router.replace('/login');
        }
        return;
      }

      // 토큰이 있으면 /users/me로 유저 정보 확인
      try {
        const user = await authApi.getMyProfile();
        setUser(user);
        setInitialized(true);

        // 로그인된 상태에서 public 페이지 접근 시 메인으로
        if (isPublicPath) {
          router.replace('/');
        }
      } catch {
        // 토큰이 유효하지 않으면 로그아웃 처리
        clearAuth();
        if (!isPublicPath) {
          router.replace('/login');
        }
      }
    };

    initAuth();
  }, [accessToken, isPublicPath, router, setUser, setInitialized, clearAuth]);

  // 초기화 전 로딩 표시 (public 페이지는 바로 렌더링)
  if (!isInitialized && !isPublicPath) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
