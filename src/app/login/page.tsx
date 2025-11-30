'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button, Spinner } from '@heroui/react';

import { useLogin } from '@/features/auth/hooks';
import { useAuthStore } from '@/features/auth/store';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/login` : '';

function getGoogleAuthUrl() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID || '',
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'offline',
    prompt: 'consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const accessToken = useAuthStore((state) => state.accessToken);
  const { mutate: login, isPending, error } = useLogin();

  useEffect(() => {
    if (accessToken) {
      router.replace('/');
    }
  }, [accessToken, router]);

  useEffect(() => {
    if (code && !accessToken) {
      login(
        { googleGrantCode: code },
        {
          onSuccess: () => {
            router.replace('/');
          },
          onError: (err) => {
            if (err.message.includes('404') || err.message.includes('not found')) {
              router.replace(`/register?code=${code}`);
            }
          },
        }
      );
    }
  }, [code, accessToken, login, router]);

  const handleGoogleLogin = () => {
    window.location.href = getGoogleAuthUrl();
  };

  if (isPending || code) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-gray-500">로그인 중...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mb-4 text-5xl">🎓</div>
          <h1 className="text-2xl font-bold text-gray-900">국동이</h1>
          <p className="mt-2 text-sm text-gray-500">국민대학교 동아리 정보 플랫폼</p>
        </div>

        {error && !code && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            로그인에 실패했습니다. 다시 시도해주세요.
          </div>
        )}

        <Button
          variant="secondary"
          size="lg"
          onPress={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google로 계속하기
        </Button>

        <p className="mt-6 text-center text-sm text-gray-500">
          아직 회원이 아니신가요? <span className="font-medium text-blue-600">Google로 시작</span>
          하면
          <br />
          자동으로 회원가입 페이지로 이동합니다.
        </p>

        <p className="mt-6 text-center text-xs text-gray-400">
          로그인 시 서비스 이용약관과 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
