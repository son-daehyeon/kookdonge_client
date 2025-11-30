import Image from 'next/image';
import Link from 'next/link';

import { Chip } from '@heroui/react';

import { ClubCategory, ClubListRes, ClubType, RecruitmentStatus } from '@/types/api';

const CATEGORY_LABEL: Record<ClubCategory, string> = {
  PERFORMING_ARTS: '공연예술',
  LIBERAL_ARTS_SERVICE: '교양봉사',
  EXHIBITION_ARTS: '전시창작',
  RELIGION: '종교',
  BALL_LEISURE: '구기레저',
  PHYSICAL_MARTIAL_ARTS: '체육무예',
  ACADEMIC: '학술',
};

const TYPE_LABEL: Record<ClubType, string> = {
  CENTRAL: '중앙동아리',
  DEPARTMENTAL: '학과동아리',
};

const STATUS_CONFIG: Record<
  RecruitmentStatus,
  { label: string; color: 'success' | 'accent' | 'default' }
> = {
  RECRUITING: { label: '모집중', color: 'success' },
  SCHEDULED: { label: '모집예정', color: 'accent' },
  CLOSED: { label: '모집마감', color: 'default' },
};

type ClubCardProps = {
  club: ClubListRes;
};

export function ClubCard({ club }: ClubCardProps) {
  const status = STATUS_CONFIG[club.recruitmentStatus];

  return (
    <Link href={`/clubs/${club.id}`} className="block">
      <div className="flex gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all hover:border-gray-200 hover:shadow-md">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
          {club.logoImage ? (
            <Image
              src={club.logoImage}
              alt={club.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-gray-300">
              🏠
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            <Chip size="sm" color={status.color} variant="soft">
              {status.label}
            </Chip>
            {club.dday > 0 && club.recruitmentStatus === 'RECRUITING' && (
              <Chip size="sm" color="danger" variant="soft">
                D-{club.dday}
              </Chip>
            )}
          </div>
          <h3 className="mt-1.5 truncate text-[15px] font-semibold text-gray-900">{club.name}</h3>
          <p className="truncate text-xs text-gray-500">
            {TYPE_LABEL[club.type]} · {CATEGORY_LABEL[club.category]}
          </p>
          <p className="mt-1 line-clamp-1 text-xs text-gray-600">{club.introduction}</p>
        </div>
      </div>
    </Link>
  );
}
