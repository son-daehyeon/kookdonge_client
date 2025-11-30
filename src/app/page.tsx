'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Spinner } from '@heroui/react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';

import { ClubCategory, ClubType, RecruitmentStatus } from '@/types/api';
import { useClubList, useClubRanking } from '@/features/club/hooks';
import { ClubCard } from '@/components/common/club-card';

const CATEGORY_OPTIONS: { value: ClubCategory | ''; label: string }[] = [
  { value: '', label: '전체 분야' },
  { value: 'PERFORMING_ARTS', label: '공연예술' },
  { value: 'LIBERAL_ARTS_SERVICE', label: '교양봉사' },
  { value: 'EXHIBITION_ARTS', label: '전시창작' },
  { value: 'RELIGION', label: '종교' },
  { value: 'BALL_LEISURE', label: '구기레저' },
  { value: 'PHYSICAL_MARTIAL_ARTS', label: '체육무예' },
  { value: 'ACADEMIC', label: '학술' },
];

const TYPE_OPTIONS: { value: ClubType | ''; label: string }[] = [
  { value: '', label: '전체 유형' },
  { value: 'CENTRAL', label: '중앙동아리' },
  { value: 'DEPARTMENTAL', label: '학과동아리' },
];

const STATUS_OPTIONS: { value: RecruitmentStatus | ''; label: string }[] = [
  { value: '', label: '전체 상태' },
  { value: 'RECRUITING', label: '모집중' },
  { value: 'SCHEDULED', label: '모집예정' },
  { value: 'CLOSED', label: '모집마감' },
];

function RankingSection() {
  const { data: rankings, isLoading } = useClubRanking();

  if (isLoading) {
    return (
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-6">
        <div className="flex justify-center">
          <Spinner color="current" className="text-white" />
        </div>
      </section>
    );
  }

  if (!rankings || rankings.length === 0) return null;

  const top3 = rankings.slice(0, 3);

  return (
    <section className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-6">
      <h2 className="mb-4 text-lg font-bold text-white">🔥 이번 주 인기 동아리</h2>
      <div className="flex gap-3">
        {top3.map((club, index) => (
          <Link
            key={club.id}
            href={`/clubs/${club.id}`}
            className="flex flex-1 flex-col items-center rounded-xl bg-white/10 p-3 backdrop-blur-sm"
          >
            <span className="mb-2 text-2xl font-bold text-yellow-300">{index + 1}</span>
            <div className="relative mb-2 h-14 w-14 overflow-hidden rounded-full bg-white/20">
              {club.logoImage ? (
                <Image
                  src={club.logoImage}
                  alt={club.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl">🏠</div>
              )}
            </div>
            <span className="line-clamp-1 text-center text-xs font-medium text-white">
              {club.name}
            </span>
            <span className="mt-1 text-xs text-white/70">+{club.weeklyViewGrowth} 조회</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ClubFilters() {
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault(''));
  const [type, setType] = useQueryState('type', parseAsString.withDefault(''));
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault(''));
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''));

  return (
    <div className="space-y-3 border-b border-gray-200 px-4 py-3">
      <input
        type="text"
        placeholder="동아리 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value || null)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
      <div className="flex gap-2 overflow-x-auto">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value || null)}
          className="shrink-0 rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value || null)}
          className="shrink-0 rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value || null)}
          className="shrink-0 rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function ClubListSection() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(0));
  const [category] = useQueryState('category', parseAsString.withDefault(''));
  const [type] = useQueryState('type', parseAsString.withDefault(''));
  const [status] = useQueryState('status', parseAsString.withDefault(''));
  const [query] = useQueryState('q', parseAsString.withDefault(''));

  const { data, isLoading } = useClubList({
    category: category ? (category as ClubCategory) : undefined,
    type: type ? (type as ClubType) : undefined,
    recruitmentStatus: status ? (status as RecruitmentStatus) : undefined,
    query: query || undefined,
    pageable: { page, size: 10 },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!data || data.content.length === 0) {
    return <div className="py-12 text-center text-gray-500">검색 결과가 없습니다.</div>;
  }

  return (
    <div className="px-4 py-4">
      <div className="mb-3 text-sm text-gray-600">총 {data.totalElements}개의 동아리</div>
      <div className="space-y-3">
        {data.content.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
      {data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={data.first}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
          >
            이전
          </button>
          <span className="text-sm text-gray-600">
            {page + 1} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={data.last}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
          >
            다음
          </button>
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
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
