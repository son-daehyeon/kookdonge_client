'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button, Spinner } from '@heroui/react';

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
    <div className="border-b border-gray-200 bg-white px-4 py-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl">
          👤
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-gray-900">{profile.email}</h2>
          <p className="text-sm text-gray-500">{profile.department}</p>
          <p className="text-xs text-gray-400">학번: {profile.studentId}</p>
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
    <div className="px-4 py-4">
      <h3 className="mb-3 font-semibold text-gray-900">대기 중인 동아리</h3>
      {clubs.length === 0 ? (
        <div className="rounded-lg border border-gray-200 py-8 text-center text-gray-500">
          대기 중인 동아리가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {clubs.map((club) => (
            <Link
              key={club.clubId}
              href={`/clubs/${club.clubId}`}
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {club.clubProfileImageUrl ? (
                  <Image
                    src={club.clubProfileImageUrl}
                    alt={club.clubName}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl text-gray-400">
                    🏠
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{club.clubName}</h4>
                <p className="text-xs text-gray-500">{TYPE_LABEL[club.clubType]}</p>
              </div>
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
  const clearTokens = useAuthStore((state) => state.clearTokens);

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
    }
  }, [accessToken, router]);

  const handleLogout = () => {
    clearTokens();
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
    <div>
      <ProfileSection />
      <WaitingListSection />
      <div className="px-4 py-4">
        <Button variant="danger" size="lg" className="w-full" onPress={handleLogout}>
          로그아웃
        </Button>
      </div>
    </div>
  );
}
