'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button, Chip, Spinner } from '@heroui/react';

import { ClubType } from '@/types/api';
import { useMyProfile } from '@/features/auth/hooks';
import { useAuthStore } from '@/features/auth/store';
import { useMyWaitingList } from '@/features/waiting-list/hooks';

const TYPE_LABEL: Record<ClubType, string> = {
  CENTRAL: '중앙동아리',
  DEPARTMENTAL: '학과동아리',
};

function ProfileSection() {
  const { data: profile, isLoading } = useMyProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="px-4 py-8">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{profile.email}</h2>
          <div className="flex items-center gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile.department}</p>
            <Chip size="sm" variant="primary">
              {profile.studentId}
            </Chip>
          </div>
        </div>
      </div>
    </div>
  );
}

function WaitingListSection() {
  const { data: waitingList, isLoading } = useMyWaitingList();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  const clubs = waitingList || [];

  return (
    <div className="px-4 py-5">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-100">
        대기 중인 동아리
      </h3>
      {clubs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 py-12 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500">
          <p>대기 중인 동아리가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clubs.map((club) => (
            <Link
              key={club.clubId}
              href={`/clubs/${club.clubId}`}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-700">
                {club.clubProfileImageUrl ? (
                  <Image
                    src={club.clubProfileImageUrl}
                    alt={club.clubName}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl text-zinc-400 dark:text-zinc-500">
                    🏠
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-semibold text-zinc-800 dark:text-zinc-100">
                  {club.clubName}
                </h4>
                <div className="mt-1 flex items-center gap-2">
                  <Chip size="sm" color="accent" variant="soft">
                    {TYPE_LABEL[club.clubType]}
                  </Chip>
                  <Chip size="sm" color="warning" variant="soft">
                    대기중
                  </Chip>
                </div>
              </div>
              <svg
                className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyPage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
    }
  }, [accessToken, router]);

  const handleLogout = () => {
    clearAuth();
    router.replace('/');
  };

  if (!accessToken) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="pb-6">
      <ProfileSection />
      <WaitingListSection />
      <div className="px-4 pt-4">
        <Button size="lg" className="w-full" onPress={handleLogout}>
          로그아웃
        </Button>
      </div>
    </div>
  );
}
