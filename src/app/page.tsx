'use client';

import { Suspense, useState, type Key } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button, Input, ListBox, Select, Spinner } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';

import { ClubCategory, ClubType, RecruitmentStatus } from '@/types/api';
import { useClubList, useClubRanking } from '@/features/club/hooks';
import { ClubCard, ClubCardSkeleton } from '@/components/common/club-card';

const CATEGORY_OPTIONS: { value: ClubCategory | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'PERFORMING_ARTS', label: '공연' },
  { value: 'LIBERAL_ARTS_SERVICE', label: '봉사' },
  { value: 'EXHIBITION_ARTS', label: '전시' },
  { value: 'RELIGION', label: '종교' },
  { value: 'BALL_LEISURE', label: '구기' },
  { value: 'PHYSICAL_MARTIAL_ARTS', label: '체육' },
  { value: 'ACADEMIC', label: '학술' },
];

const STATUS_OPTIONS: { value: RecruitmentStatus | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'RECRUITING', label: 'OPEN' },
  { value: 'SCHEDULED', label: 'SOON' },
  { value: 'CLOSED', label: 'CLOSED' },
];

function RankingSection() {
  const { data: rankings, isLoading } = useClubRanking();
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  if (isLoading) {
    return (
      <section className="px-4 py-6">
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 w-24 shrink-0 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!rankings || rankings.length === 0) return null;

  const top5 = rankings.slice(0, 5);

  return (
    <section className="px-4 py-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
          <span className="inline-block animate-pulse text-xl">🔥</span>
          <span>Trending</span>
        </h2>
        <span className="text-xs text-zinc-400">이번 주 인기</span>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
        {top5.map((club, index) => (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/clubs/${club.id}`}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="relative flex w-24 shrink-0 flex-col items-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 p-3 dark:from-violet-500/20 dark:to-cyan-500/20"
              >
                {/* Rank Badge */}
                <div className="absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white dark:bg-lime-400 dark:text-zinc-900">
                  {index + 1}
                </div>

                {/* Avatar */}
                <div className="relative mb-2 h-14 w-14 overflow-hidden rounded-full bg-zinc-200 ring-2 ring-violet-400/30 dark:bg-zinc-700 dark:ring-lime-400/30">
                  {!imageLoaded[club.id] && (
                    <div className="skeleton absolute inset-0 rounded-full" />
                  )}
                  {club.logoImage ? (
                    <Image
                      src={club.logoImage}
                      alt={club.name}
                      fill
                      className={`object-cover transition-opacity duration-300 ${
                        imageLoaded[club.id] ? 'opacity-100' : 'opacity-0'
                      }`}
                      sizes="56px"
                      onLoad={() => setImageLoaded((prev) => ({ ...prev, [club.id]: true }))}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl">🎭</div>
                  )}
                </div>

                {/* Name */}
                <span className="line-clamp-1 text-center text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                  {club.name}
                </span>

                {/* Growth Badge */}
                <span className="mt-1 rounded-full bg-lime-400/20 px-2 py-0.5 text-[9px] font-medium text-lime-700 dark:bg-lime-400/30 dark:text-lime-300">
                  +{club.weeklyViewGrowth}
                </span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ClubFilters() {
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault(''));
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault(''));
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''));

  const handleCategoryChange = (value: Key | null) => {
    setCategory((value as string) || null);
  };

  const handleStatusChange = (value: Key | null) => {
    setStatus((value as string) || null);
  };

  return (
    <div className="glass sticky top-14 z-30 border-y-0 px-4 py-3">
      {/* Search Input */}
      <div className="relative mb-3">
        <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <Input
          type="text"
          placeholder="어떤 동아리를 찾으시나요?"
          value={query}
          onChange={(e) => setQuery(e.target.value || null)}
          className="w-full pl-10"
          aria-label="동아리 검색"
        />
      </div>

      {/* Filter Pills */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        <Select
          className="shrink-0"
          placeholder="분야"
          aria-label="분야 선택"
          value={category || ''}
          onChange={handleCategoryChange}
        >
          <Select.Trigger className="min-w-[72px] rounded-full border-zinc-200 bg-zinc-50 text-xs dark:border-zinc-700 dark:bg-zinc-800">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {CATEGORY_OPTIONS.map((opt) => (
                <ListBox.Item key={opt.value} id={opt.value} textValue={opt.label}>
                  {opt.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          className="shrink-0"
          placeholder="상태"
          aria-label="상태 선택"
          value={status || ''}
          onChange={handleStatusChange}
        >
          <Select.Trigger className="min-w-[72px] rounded-full border-zinc-200 bg-zinc-50 text-xs dark:border-zinc-700 dark:bg-zinc-800">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {STATUS_OPTIONS.map((opt) => (
                <ListBox.Item key={opt.value} id={opt.value} textValue={opt.label}>
                  {opt.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        {/* Quick Filter Chips */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setStatus(status === 'RECRUITING' ? null : 'RECRUITING')}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            status === 'RECRUITING'
              ? 'bg-lime-400 text-zinc-900'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
          }`}
        >
          모집중만
        </motion.button>
      </div>
    </div>
  );
}

function ClubListSection() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(0));
  const [category] = useQueryState('category', parseAsString.withDefault(''));
  const [status] = useQueryState('status', parseAsString.withDefault(''));
  const [query] = useQueryState('q', parseAsString.withDefault(''));

  const { data, isLoading } = useClubList({
    category: category ? (category as ClubCategory) : undefined,
    recruitmentStatus: status ? (status as RecruitmentStatus) : undefined,
    query: query || undefined,
    pageable: { page, size: 10 },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 px-4 py-4">
        {[1, 2, 3].map((i) => (
          <ClubCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data || data.content.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <span className="mb-3 text-5xl">🔍</span>
        <p className="text-sm text-zinc-400">검색 결과가 없어요</p>
        <p className="mt-1 text-xs text-zinc-300 dark:text-zinc-600">다른 키워드로 검색해보세요</p>
      </motion.div>
    );
  }

  return (
    <div className="px-4 py-4">
      {/* Result Count */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          <span className="font-bold text-violet-500 dark:text-lime-400">{data.totalElements}</span>
          개의 동아리
        </span>
      </div>

      {/* Club Cards */}
      <AnimatePresence mode="wait">
        <div className="space-y-4">
          {data.content.map((club, index) => (
            <ClubCard key={club.id} club={club} index={index} />
          ))}
        </div>
      </AnimatePresence>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="secondary"
              size="sm"
              onPress={() => setPage(Math.max(0, page - 1))}
              isDisabled={data.first}
              className="touch-btn rounded-full"
            >
              이전
            </Button>
          </motion.div>
          <span className="min-w-[60px] text-center text-sm font-medium text-zinc-500">
            <span className="text-violet-500 dark:text-lime-400">{page + 1}</span> /{' '}
            {data.totalPages}
          </span>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="secondary"
              size="sm"
              onPress={() => setPage(page + 1)}
              isDisabled={data.last}
              className="touch-btn rounded-full"
            >
              다음
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function HomeContent() {
  return (
    <>
      <RankingSection />
      <ClubFilters />
      <ClubListSection />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
