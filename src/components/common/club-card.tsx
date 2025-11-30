import Image from 'next/image';
import Link from 'next/link';

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

const STATUS_CONFIG: Record<RecruitmentStatus, { label: string; className: string }> = {
  RECRUITING: { label: '모집중', className: 'bg-green-100 text-green-700' },
  SCHEDULED: { label: '모집예정', className: 'bg-blue-100 text-blue-700' },
  CLOSED: { label: '모집마감', className: 'bg-gray-100 text-gray-500' },
};

type ClubCardProps = {
  club: ClubListRes;
};

export function ClubCard({ club }: ClubCardProps) {
  const status = STATUS_CONFIG[club.recruitmentStatus];

  return (
    <Link href={`/clubs/${club.id}`} className="block">
      <div className="flex gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {club.logoImage ? (
            <Image
              src={club.logoImage}
              alt={club.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-gray-400">
              🏠
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
            {club.dday > 0 && club.recruitmentStatus === 'RECRUITING' && (
              <span className="text-xs text-red-500">D-{club.dday}</span>
            )}
          </div>
          <h3 className="mt-1 truncate font-semibold text-gray-900">{club.name}</h3>
          <p className="truncate text-xs text-gray-500">
            {TYPE_LABEL[club.type]} · {CATEGORY_LABEL[club.category]}
          </p>
          <p className="mt-1 line-clamp-1 text-xs text-gray-600">{club.introduction}</p>
        </div>
      </div>
    </Link>
  );
}
