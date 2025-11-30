'use client';

import { Suspense, use } from 'react';
import Image from 'next/image';

import { Spinner, Tabs } from '@heroui/react';
import { parseAsString, useQueryState } from 'nuqs';

import { ClubCategory, ClubType, RecruitmentStatus } from '@/types/api';
import { useClubDetail } from '@/features/club/hooks';
import { useClubFeeds } from '@/features/feed/hooks';
import { useQuestions } from '@/features/question/hooks';

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

function ClubHeader({ clubId }: { clubId: number }) {
  const { data: club, isLoading } = useClubDetail(clubId);

  if (isLoading || !club) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const status = STATUS_CONFIG[club.recruitmentStatus];

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-6">
      <div className="flex gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          {club.image ? (
            <Image src={club.image} alt={club.name} fill className="object-cover" sizes="80px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl text-gray-400">
              🏠
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2">
            <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${status.className}`}>
              {status.label}
            </span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-gray-900">{club.name}</h1>
          <p className="text-sm text-gray-500">
            {TYPE_LABEL[club.type]} · {CATEGORY_LABEL[club.category]}
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-4 text-center">
        <div className="flex-1 rounded-lg bg-gray-50 py-2">
          <div className="text-lg font-bold text-blue-600">{club.totalLikeCount}</div>
          <div className="text-xs text-gray-500">좋아요</div>
        </div>
        <div className="flex-1 rounded-lg bg-gray-50 py-2">
          <div className="text-lg font-bold text-blue-600">{club.totalViewCount}</div>
          <div className="text-xs text-gray-500">조회수</div>
        </div>
      </div>
    </div>
  );
}

function ClubInfoTab({ clubId }: { clubId: number }) {
  const { data: club } = useClubDetail(clubId);

  if (!club) return null;

  const infoItems = [
    { label: '모집 기간', value: `${club.recruitmentStartDate} ~ ${club.recruitmentEndDate}` },
    { label: '대상', value: club.targetGraduate },
    { label: '동아리장', value: club.leaderName },
    { label: '활동 장소', value: club.location },
    { label: '주간 활동', value: `${club.weeklyActiveFrequency}회` },
    { label: '휴학생 가입', value: club.allowLeaveOfAbsence ? '가능' : '불가능' },
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-3 font-semibold text-gray-900">동아리 소개</h3>
        <p className="text-sm whitespace-pre-wrap text-gray-700">{club.description}</p>
      </div>
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-3 font-semibold text-gray-900">기본 정보</h3>
        <div className="space-y-2">
          {infoItems.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClubFeedTab({ clubId }: { clubId: number }) {
  const { data, isLoading } = useClubFeeds(clubId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const feeds = data?.clubFeedList || [];

  if (feeds.length === 0) {
    return <div className="py-12 text-center text-gray-500">아직 피드가 없습니다.</div>;
  }

  return (
    <div className="space-y-4 p-4">
      {feeds.map((feed) => (
        <div key={feed.feedId} className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm whitespace-pre-wrap text-gray-700">{feed.content}</p>
          {feed.postUrls.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {feed.postUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100"
                >
                  <Image src={url} alt="" fill className="object-cover" sizes="96px" />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ClubQnaTab({ clubId }: { clubId: number }) {
  const { data, isLoading } = useQuestions(clubId, { page: 0, size: 20 });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const questions = data?.content || [];

  if (questions.length === 0) {
    return <div className="py-12 text-center text-gray-500">아직 질문이 없습니다.</div>;
  }

  return (
    <div className="space-y-4 p-4">
      {questions.map((qna) => (
        <div key={qna.id} className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-start gap-2">
            <span className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
              Q
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{qna.question}</p>
              <p className="mt-1 text-xs text-gray-500">
                {qna.userName} · {new Date(qna.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {qna.answer && (
            <div className="mt-3 flex items-start gap-2 border-t border-gray-100 pt-3">
              <span className="shrink-0 rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
                A
              </span>
              <p className="flex-1 text-sm text-gray-700">{qna.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ClubDetailContent({ clubId }: { clubId: number }) {
  const [tab, setTab] = useQueryState('tab', parseAsString.withDefault('info'));

  return (
    <>
      <ClubHeader clubId={clubId} />
      <Tabs selectedKey={tab} onSelectionChange={(key) => setTab(key as string)} className="w-full">
        <Tabs.ListContainer className="border-b border-gray-200 bg-white">
          <Tabs.List aria-label="동아리 정보" className="flex w-full">
            <Tabs.Tab id="info" className="flex-1 py-3 text-center text-sm font-medium">
              정보
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="feed" className="flex-1 py-3 text-center text-sm font-medium">
              피드
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="qna" className="flex-1 py-3 text-center text-sm font-medium">
              Q&A
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel id="info">
          <ClubInfoTab clubId={clubId} />
        </Tabs.Panel>
        <Tabs.Panel id="feed">
          <ClubFeedTab clubId={clubId} />
        </Tabs.Panel>
        <Tabs.Panel id="qna">
          <ClubQnaTab clubId={clubId} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function ClubDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const clubId = parseInt(id, 10);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      }
    >
      <ClubDetailContent clubId={clubId} />
    </Suspense>
  );
}
