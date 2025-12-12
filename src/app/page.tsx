'use client';

import { Suspense, useEffect, useState, type Key } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button, Input, ListBox, Select, Spinner } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';

import { ClubCategory, RecruitmentStatus } from '@/types/api';
import { useClubList, useTopWeeklyLike, useTopWeeklyView } from '@/features/club/hooks';
import { ClubCard, ClubCardSkeleton } from '@/components/common/club-card';

const CATEGORY_OPTIONS: { value: ClubCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'PERFORMING_ARTS', label: '공연' },
  { value: 'LIBERAL_ARTS_SERVICE', label: '봉사' },
  { value: 'EXHIBITION_ARTS', label: '전시' },
  { value: 'RELIGION', label: '종교' },
  { value: 'BALL_LEISURE', label: '구기' },
  { value: 'PHYSICAL_MARTIAL_ARTS', label: '체육' },
  { value: 'ACADEMIC', label: '학술' },
];

const STATUS_OPTIONS: { value: RecruitmentStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'RECRUITING', label: '모집중' },
  { value: 'SCHEDULED', label: '모집예정' },
  { value: 'CLOSED', label: '모집마감' },
];

type RankingTab = 'view' | 'like';

function RankingSection() {
  const [activeTab, setActiveTab] = useState<RankingTab>('view');
  const { data: viewRankings, isLoading: viewLoading } = useTopWeeklyView();
  const { data: likeRankings, isLoading: likeLoading } = useTopWeeklyLike();
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  const isLoading = activeTab === 'view' ? viewLoading : likeLoading;
  const rawRankings = activeTab === 'view' ? viewRankings : likeRankings;

  // API 응답이 배열 또는 { content: [...] } 형태일 수 있음
  type RankingItem = {
    id: number;
    name: string;
    logoImage: string;
    weeklyViewGrowth: number;
    weeklyLikeGrowth: number;
  };
  const rankings: RankingItem[] = Array.isArray(rawRankings)
    ? rawRankings
    : ((rawRankings as unknown as { content?: RankingItem[] })?.content ?? []);

  if (isLoading) {
    return (
      <section className="px-4 py-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="skeleton h-8 w-20 rounded-full" />
          <div className="skeleton h-8 w-20 rounded-full" />
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 w-24 shrink-0 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  const top5 = rankings?.slice(0, 5) || [];
  const isEmpty = !rankings || rankings.length === 0;

  return (
    <section className="px-4 py-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Tab Buttons */}
          <div className="flex gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
            <button
              onClick={() => setActiveTab('view')}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                activeTab === 'view'
                  ? 'bg-violet-500 text-white dark:bg-lime-400 dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              조회수
            </button>
            <button
              onClick={() => setActiveTab('like')}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                activeTab === 'like'
                  ? 'bg-violet-500 text-white dark:bg-lime-400 dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              좋아요
            </button>
          </div>
        </div>
        <span className="text-xs text-zinc-400">이번 주 인기</span>
      </div>

      {isEmpty ? (
        <div className="flex h-36 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500">
          인기 동아리가 없습니다
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="no-scrollbar flex gap-3 overflow-x-auto pt-2 pb-2 pl-2"
          >
            {top5.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/clubs/${club.id}`}>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="relative flex w-24 shrink-0 flex-col items-center rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-800"
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
                        <div className="flex h-full w-full items-center justify-center text-xl">
                          🎭
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <span className="line-clamp-1 text-center text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                      {club.name}
                    </span>

                    {/* Growth Badge */}
                    <span className="mt-1 rounded-full bg-lime-400/20 px-2 py-0.5 text-[9px] font-medium text-lime-700 dark:bg-lime-400/30 dark:text-lime-300">
                      +{activeTab === 'view' ? club.weeklyViewGrowth : club.weeklyLikeGrowth}
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}

function ClubFilters() {
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault('ALL'));
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault('ALL'));
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''));
  const [searchInput, setSearchInput] = useState(query);

  // 디바운스: 300ms 후에 쿼리 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(searchInput || null);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, setQuery]);

  const handleCategoryChange = (value: Key | null) => {
    setCategory(value === 'ALL' ? null : (value as string) || null);
  };

  const handleStatusChange = (value: Key | null) => {
    setStatus(value === 'ALL' ? null : (value as string) || null);
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
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full border border-zinc-300 bg-zinc-50 pl-10 text-zinc-900 placeholder:text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400"
          aria-label="동아리 검색"
        />
      </div>

      {/* Filter Pills */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto p-1">
        <Select
          className="shrink-0"
          placeholder="전체"
          aria-label="분야 선택"
          value={category || undefined}
          onChange={handleCategoryChange}
        >
          <Select.Trigger className="min-w-[72px] rounded-full border border-zinc-300 bg-zinc-50 text-xs !text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:!text-zinc-200">
            <Select.Value className="[color:rgb(82,82,91)] dark:[color:rgb(228,228,231)]" />
            <Select.Indicator className="!text-zinc-500 dark:!text-zinc-400" />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {CATEGORY_OPTIONS.map((opt) => (
                <ListBox.Item
                  key={opt.value}
                  id={opt.value}
                  textValue={opt.label}
                  className="flex items-center justify-center text-center !text-zinc-600 dark:!text-zinc-200"
                >
                  {opt.label}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          className="shrink-0"
          placeholder="전체"
          aria-label="상태 선택"
          value={status || undefined}
          onChange={handleStatusChange}
        >
          <Select.Trigger className="min-w-[72px] rounded-full border border-zinc-300 bg-zinc-50 text-xs !text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:!text-zinc-200">
            <Select.Value className="[color:rgb(82,82,91)] dark:[color:rgb(228,228,231)]" />
            <Select.Indicator className="!text-zinc-500 dark:!text-zinc-400" />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {STATUS_OPTIONS.map((opt) => (
                <ListBox.Item
                  key={opt.value}
                  id={opt.value}
                  textValue={opt.label}
                  className="flex items-center justify-center text-center !text-zinc-600 dark:!text-zinc-200"
                >
                  {opt.label}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
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
