import {
  AnswerCreateReq,
  Pageable,
  PageResponse,
  QuestionAnswerRes,
  QuestionCreateReq,
} from '@/types/api';
import { apiClient } from '@/lib/api/client';

export const questionApi = {
  getQuestions: (clubId: number, pageable: Pageable) =>
    apiClient<PageResponse<QuestionAnswerRes>>(`/api/clubs/${clubId}/questions`, {
      params: {
        page: pageable.page,
        size: pageable.size,
        sort: pageable.sort?.join(','),
      },
    }),

  createQuestion: (clubId: number, data: QuestionCreateReq) =>
    apiClient<void>(`/api/clubs/${clubId}/questions`, {
      method: 'POST',
      body: data,
    }),

  createAnswer: (clubId: number, questionId: number, data: AnswerCreateReq) =>
    apiClient<void>(`/api/clubs/${clubId}/questions/${questionId}/answer`, {
      method: 'POST',
      body: data,
    }),

  deleteQuestion: (clubId: number, questionId: number) =>
    apiClient<void>(`/api/clubs/${clubId}/questions/${questionId}`, {
      method: 'DELETE',
    }),
};
