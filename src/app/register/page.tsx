'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button, Input, Label, Spinner } from '@heroui/react';
import { motion } from 'framer-motion';

import { useRegister } from '@/features/auth/hooks';
import { useAuthStore } from '@/features/auth/store';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const accessToken = useAuthStore((state) => state.accessToken);
  const { mutate: register, isPending, error } = useRegister();

  const [formData, setFormData] = useState({
    department: '',
    studentId: '',
    phoneNumber: '',
  });

  if (!code) {
    router.replace('/login');
    return null;
  }

  if (accessToken) {
    router.replace('/');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    register(
      {
        googleGrantCode: code,
        ...formData,
      },
      {
        onSuccess: () => {
          router.replace('/');
        },
      }
    );
  };

  const isValid = formData.department && formData.studentId && formData.phoneNumber;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--background)] px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30 dark:from-lime-400 dark:to-cyan-400 dark:shadow-lime-400/30"
          >
            <span className="text-3xl">👋</span>
          </motion.div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">환영해요!</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            마지막 단계예요. 추가 정보를 입력해주세요.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 rounded-2xl bg-rose-500/10 p-4 text-center text-sm text-rose-500"
          >
            회원가입에 실패했습니다. 다시 시도해주세요.
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label
              htmlFor="department"
              className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
            >
              학과
            </Label>
            <Input
              id="department"
              name="department"
              type="text"
              value={formData.department}
              onChange={handleChange}
              placeholder="예: 컴퓨터공학부"
              className="w-full rounded-xl"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label
              htmlFor="studentId"
              className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
            >
              학번
            </Label>
            <Input
              id="studentId"
              name="studentId"
              type="text"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="예: 20231234"
              className="w-full rounded-xl"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label
              htmlFor="phoneNumber"
              className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
            >
              전화번호
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="예: 010-1234-5678"
              className="w-full rounded-xl"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              size="lg"
              className="btn-accent touch-btn mt-4 w-full rounded-2xl"
              isDisabled={!isValid}
              isPending={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" color="current" />
                  가입 중...
                </span>
              ) : (
                '가입 완료하기'
              )}
            </Button>
          </motion.div>
        </form>

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
        >
          이미 계정이 있으신가요?{' '}
          <Link
            href="/login"
            className="font-semibold text-violet-500 hover:underline dark:text-lime-400"
          >
            로그인
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[var(--background)]">
          <Spinner size="lg" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
