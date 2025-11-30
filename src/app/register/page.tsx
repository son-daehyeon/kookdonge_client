'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button, Input, Label, Spinner } from '@heroui/react';

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
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">👋</div>
          <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
          <p className="mt-2 text-sm text-gray-500">추가 정보를 입력해주세요</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            회원가입에 실패했습니다. 다시 시도해주세요.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="department" className="text-sm font-medium text-gray-700">
              학과
            </Label>
            <Input
              id="department"
              name="department"
              type="text"
              value={formData.department}
              onChange={handleChange}
              placeholder="예: 컴퓨터공학부"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="studentId" className="text-sm font-medium text-gray-700">
              학번
            </Label>
            <Input
              id="studentId"
              name="studentId"
              type="text"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="예: 20231234"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
              전화번호
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="예: 010-1234-5678"
              className="w-full"
              required
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-2 w-full"
            isDisabled={!isValid}
            isPending={isPending}
          >
            {isPending ? (
              <>
                <Spinner size="sm" color="current" />
                가입 중...
              </>
            ) : (
              '가입하기'
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
