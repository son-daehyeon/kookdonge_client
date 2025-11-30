'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';

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
  CENTRAL: '중앙',
  DEPARTMENTAL: '학과',
};

const STATUS_CONFIG: Record<RecruitmentStatus, { label: string; className: string }> = {
  RECRUITING: {
    label: '모집중',
    className: 'bg-lime-400 text-zinc-900 dark:bg-lime-400 dark:text-zinc-900',
  },
  SCHEDULED: {
    label: '모집예정',
    className: 'bg-cyan-400 text-zinc-900 dark:bg-cyan-400 dark:text-zinc-900',
  },
  CLOSED: {
    label: '마감',
    className: 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400',
  },
};

type ClubCardProps = {
  club: ClubListRes;
  index?: number;
};

export function ClubCard({ club, index = 0 }: ClubCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const status = STATUS_CONFIG[club.recruitmentStatus];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/clubs/${club.id}`} className="block">
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="card-hover flex overflow-hidden rounded-2xl border border-zinc-100 bg-[var(--card)] dark:border-zinc-800"
        >
          {/* Image Section */}
          <div className="relative h-28 w-28 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            {club.logoImage ? (
              <>
                {!imageLoaded && <div className="skeleton absolute inset-0" />}
                <Image
                  src={club.logoImage}
                  alt={club.name}
                  fill
                  className={`object-cover transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="112px"
                  onLoad={() => setImageLoaded(true)}
                />
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-100 to-cyan-100 dark:from-violet-900/30 dark:to-cyan-900/30">
                <span className="text-2xl font-bold text-violet-500 dark:text-violet-400">
                  {club.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex min-w-0 flex-1 flex-col justify-center p-3">
            <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider ${status.className}`}
              >
                {status.label}
              </span>
              {club.dday > 0 && club.recruitmentStatus === 'RECRUITING' && (
                <span className="inline-flex items-center rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  D-{club.dday}
                </span>
              )}
              <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {TYPE_LABEL[club.type]}
              </span>
              <span className="rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                {CATEGORY_LABEL[club.category]}
              </span>
            </div>

            <h3 className="mb-1 truncate text-base font-bold text-zinc-900 dark:text-zinc-100">
              {club.name}
            </h3>

            <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
              {club.introduction}
            </p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Skeleton Component for loading state
export function ClubCardSkeleton() {
  return (
    <div className="flex overflow-hidden rounded-2xl border border-zinc-100 bg-[var(--card)] dark:border-zinc-800">
      <div className="skeleton h-28 w-28 shrink-0" />
      <div className="flex flex-1 flex-col justify-center p-3">
        <div className="mb-1.5 flex gap-1.5">
          <div className="skeleton h-5 w-12 rounded-full" />
          <div className="skeleton h-5 w-10 rounded-md" />
          <div className="skeleton h-5 w-14 rounded-md" />
        </div>
        <div className="skeleton mb-1 h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
      </div>
    </div>
  );
}
