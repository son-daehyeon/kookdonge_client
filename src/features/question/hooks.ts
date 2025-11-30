'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AnswerCreateReq, Pageable, QuestionCreateReq } from '@/types/api';

import { questionApi } from './api';

export const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  list: (clubId: number, pageable: Pageable) =>
    [...questionKeys.lists(), clubId, pageable] as const,
};

export function useQuestions(clubId: number, pageable: Pageable) {
  return useQuery({
    queryKey: questionKeys.list(clubId, pageable),
    queryFn: () => questionApi.getQuestions(clubId, pageable),
    enabled: !!clubId,
  });
}

export function useCreateQuestion(clubId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QuestionCreateReq) => questionApi.createQuestion(clubId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}

export function useCreateAnswer(clubId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId, data }: { questionId: number; data: AnswerCreateReq }) =>
      questionApi.createAnswer(clubId, questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}

export function useDeleteQuestion(clubId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: number) => questionApi.deleteQuestion(clubId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}
