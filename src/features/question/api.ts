import {
  AnswerCreateReq,
  Pageable,
  PageResponse,
  QuestionAnswerRes,
  QuestionCreateReq,
  RequestDTO,
  ResponseDTO,
} from '@/types/api';
import { apiClient } from '@/lib/api/client';

export const questionApi = {
  getQuestions: (clubId: number, pageable: Pageable) =>
    apiClient<ResponseDTO<PageResponse<QuestionAnswerRes>>>(`/api/clubs/${clubId}/questions`, {
      params: {
        page: pageable.page,
        size: pageable.size,
        sort: pageable.sort?.join(','),
      },
    }),

  createQuestion: (clubId: number, data: QuestionCreateReq) =>
    apiClient<ResponseDTO<void>>(`/api/clubs/${clubId}/questions`, {
      method: 'POST',
      body: { data } as RequestDTO<QuestionCreateReq>,
    }),

  createAnswer: (clubId: number, questionId: number, data: AnswerCreateReq) =>
    apiClient<ResponseDTO<void>>(`/api/clubs/${clubId}/questions/${questionId}/answer`, {
      method: 'POST',
      body: { data } as RequestDTO<AnswerCreateReq>,
    }),

  deleteQuestion: (clubId: number, questionId: number) =>
    apiClient<ResponseDTO<void>>(`/api/clubs/${clubId}/questions/${questionId}`, {
      method: 'DELETE',
    }),
};
