'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Spinner } from '@heroui/react';
import { motion } from 'framer-motion';

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
          onSuccess: (data) => {
            if (data?.accessToken) {
              router.replace('/');
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
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--background)]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-zinc-500">로그인 중...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--background)] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Title Section */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-black tracking-tight text-violet-500 dark:text-lime-400">
            KookDongE
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            국민대학교 동아리 정보 플랫폼
          </p>
        </div>

        {/* Error Message */}
        {error && !code && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 rounded-2xl bg-rose-500/10 p-4 text-center text-sm text-rose-500"
          >
            등록되지 않은 계정입니다. 회원가입을 먼저 해주세요.
          </motion.div>
        )}

        {/* Google Login Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleLogin}
          className="touch-btn flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white px-6 py-4 font-semibold text-zinc-700 shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
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
          Google로 로그인
        </motion.button>

        {/* Register Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            아직 계정이 없으신가요?{' '}
            <Link
              href="/register"
              className="font-semibold text-violet-500 hover:underline dark:text-lime-400"
            >
              회원가입
            </Link>
          </p>
        </motion.div>

        {/* Terms */}
        <p className="mt-8 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
          로그인 시 서비스 이용약관과
          <br />
          개인정보 처리방침에 동의하게 됩니다
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[var(--background)]">
          <Spinner size="lg" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
