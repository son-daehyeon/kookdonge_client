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
    apiClient<PageResponse<QuestionAnswerRes>>('/api/clubs/questions', {
      params: {
        club: clubId,
        page: pageable.page,
        size: pageable.size,
      },
    }),

  createQuestion: (clubId: number, data: QuestionCreateReq) =>
    apiClient<QuestionAnswerRes>(`/api/clubs/${clubId}/questions`, {
      method: 'POST',
      body: data,
    }),

  createAnswer: (questionId: number, data: AnswerCreateReq) =>
    apiClient<QuestionAnswerRes>(`/api/clubs/questions/${questionId}/answer`, {
      method: 'PUT',
      body: data,
    }),
};
