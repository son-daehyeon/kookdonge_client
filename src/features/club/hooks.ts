'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ClubListParams, Pageable } from '@/types/api';

import { clubApi } from './api';

export const clubKeys = {
  all: ['clubs'] as const,
  lists: () => [...clubKeys.all, 'list'] as const,
  list: (params: ClubListParams) => [...clubKeys.lists(), params] as const,
  details: () => [...clubKeys.all, 'detail'] as const,
  detail: (id: number) => [...clubKeys.details(), id] as const,
  topWeeklyView: () => [...clubKeys.all, 'top-weekly-view'] as const,
  topWeeklyLike: () => [...clubKeys.all, 'top-weekly-like'] as const,
};

export function useClubList(params: ClubListParams) {
  return useQuery({
    queryKey: clubKeys.list(params),
    queryFn: () => clubApi.getClubList(params),
  });
}

export function useClubDetail(clubId: number) {
  return useQuery({
    queryKey: clubKeys.detail(clubId),
    queryFn: () => clubApi.getClubDetail(clubId),
    enabled: !!clubId,
  });
}

export function useTopWeeklyView(pageable?: Pageable) {
  return useQuery({
    queryKey: clubKeys.topWeeklyView(),
    queryFn: () => clubApi.getTopWeeklyView(pageable),
  });
}

export function useTopWeeklyLike(pageable?: Pageable) {
  return useQuery({
    queryKey: clubKeys.topWeeklyLike(),
    queryFn: () => clubApi.getTopWeeklyLike(pageable),
  });
}

export function useLikeClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clubId: number) => clubApi.likeClub(clubId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clubKeys.all });
    },
  });
}

export function useUnlikeClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clubId: number) => clubApi.unlikeClub(clubId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clubKeys.all });
    },
  });
}
