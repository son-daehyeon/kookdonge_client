import {
  ClubDetailRes,
  ClubListParams,
  ClubListRes,
  ClubRankingRes,
  PageResponse,
  ResponseDTO,
} from '@/types/api';
import { apiClient } from '@/lib/api/client';

export const clubApi = {
  getClubList: (params: ClubListParams) =>
    apiClient<ResponseDTO<PageResponse<ClubListRes>>>('/api/clubs', {
      params: {
        category: params.category,
        type: params.type,
        recruitmentStatus: params.recruitmentStatus,
        targetGraduate: params.targetGraduate,
        weeklyActiveFrequency: params.weeklyActiveFrequency,
        query: params.query,
        page: params.pageable.page,
        size: params.pageable.size,
        sort: params.pageable.sort?.join(','),
      },
    }),

  getClubDetail: (clubId: number) => apiClient<ResponseDTO<ClubDetailRes>>(`/api/clubs/${clubId}`),

  getClubRanking: () => apiClient<ResponseDTO<ClubRankingRes[]>>('/api/clubs/ranking'),

  likeClub: (clubId: number) =>
    apiClient<ResponseDTO<void>>(`/api/clubs/${clubId}/like`, {
      method: 'POST',
    }),

  unlikeClub: (clubId: number) =>
    apiClient<ResponseDTO<void>>(`/api/clubs/${clubId}/like`, {
      method: 'DELETE',
    }),
};
