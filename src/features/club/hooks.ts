'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ClubListParams } from '@/types/api';

import { clubApi } from './api';

export const clubKeys = {
  all: ['clubs'] as const,
  lists: () => [...clubKeys.all, 'list'] as const,
  list: (params: ClubListParams) => [...clubKeys.lists(), params] as const,
  details: () => [...clubKeys.all, 'detail'] as const,
  detail: (id: number) => [...clubKeys.details(), id] as const,
  ranking: () => [...clubKeys.all, 'ranking'] as const,
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

export function useClubRanking() {
  return useQuery({
    queryKey: clubKeys.ranking(),
    queryFn: clubApi.getClubRanking,
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
