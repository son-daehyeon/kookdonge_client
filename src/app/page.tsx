'use client';

import { Suspense, type Key } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button, Chip, Input, ListBox, Select, Spinner } from '@heroui/react';
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
      <section className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 px-4 py-6">
        <div className="flex justify-center">
          <Spinner color="current" className="text-white" />
        </div>
      </section>
    );
  }

  if (!rankings || rankings.length === 0) return null;

  const top3 = rankings.slice(0, 3);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <section className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 px-4 py-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
        <span className="text-xl">🔥</span>
        이번 주 인기 동아리
      </h2>
      <div className="flex gap-3">
        {top3.map((club, index) => (
          <Link
            key={club.id}
            href={`/clubs/${club.id}`}
            className="flex flex-1 flex-col items-center rounded-2xl bg-white/15 p-4 backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-white/25"
          >
            <span className="mb-2 text-2xl">{medals[index]}</span>
            <div className="relative mb-2 h-14 w-14 overflow-hidden rounded-full bg-white/20 ring-2 ring-white/30">
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
            <span className="line-clamp-1 text-center text-xs font-semibold text-white">
              {club.name}
            </span>
            <Chip size="sm" variant="soft" className="mt-2 bg-white/20 text-[10px] text-white">
              +{club.weeklyViewGrowth} 조회
            </Chip>
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

  const handleCategoryChange = (value: Key | null) => {
    setCategory((value as string) || null);
  };

  const handleTypeChange = (value: Key | null) => {
    setType((value as string) || null);
  };

  const handleStatusChange = (value: Key | null) => {
    setStatus((value as string) || null);
  };

  return (
    <div className="space-y-3 border-b border-gray-100 bg-white px-4 py-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="동아리 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value || null)}
          className="w-full"
          aria-label="동아리 검색"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Select
          className="min-w-[100px]"
          placeholder="전체 분야"
          aria-label="분야 선택"
          value={category || ''}
          onChange={handleCategoryChange}
        >
          <Select.Trigger className="text-xs">
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
          className="min-w-[100px]"
          placeholder="전체 유형"
          aria-label="유형 선택"
          value={type || ''}
          onChange={handleTypeChange}
        >
          <Select.Trigger className="text-xs">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {TYPE_OPTIONS.map((opt) => (
                <ListBox.Item key={opt.value} id={opt.value} textValue={opt.label}>
                  {opt.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          className="min-w-[100px]"
          placeholder="전체 상태"
          aria-label="상태 선택"
          value={status || ''}
          onChange={handleStatusChange}
        >
          <Select.Trigger className="text-xs">
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
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <span className="mb-2 text-4xl">🔍</span>
        <p>검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">
          총 <span className="text-blue-600">{data.totalElements}</span>개의 동아리
        </span>
      </div>
      <div className="space-y-3">
        {data.content.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
      {data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onPress={() => setPage(Math.max(0, page - 1))}
            isDisabled={data.first}
          >
            이전
          </Button>
          <span className="min-w-[60px] text-center text-sm font-medium text-gray-600">
            {page + 1} / {data.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onPress={() => setPage(page + 1)}
            isDisabled={data.last}
          >
            다음
          </Button>
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
