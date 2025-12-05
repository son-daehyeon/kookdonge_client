import {
  ClubDetailRes,
  ClubListParams,
  ClubListRes,
  ClubRankingRes,
  Pageable,
  PageResponse,
} from '@/types/api';
import { apiClient } from '@/lib/api/client';

export const clubApi = {
  getClubList: (params: ClubListParams) =>
    apiClient<PageResponse<ClubListRes>>('/api/clubs', {
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

  getClubDetail: (clubId: number) => apiClient<ClubDetailRes>(`/api/clubs/${clubId}`),

  getTopWeeklyView: (pageable?: Pageable) =>
    apiClient<PageResponse<ClubRankingRes>>('/api/clubs/top/weekly-view', {
      params: {
        page: pageable?.page ?? 0,
        size: pageable?.size ?? 5,
      },
    }),

  getTopWeeklyLike: (pageable?: Pageable) =>
    apiClient<PageResponse<ClubRankingRes>>('/api/clubs/top/weekly-like', {
      params: {
        page: pageable?.page ?? 0,
        size: pageable?.size ?? 5,
      },
    }),

  likeClub: (clubId: number) =>
    apiClient<void>(`/api/clubs/${clubId}/like`, {
      method: 'POST',
    }),

  unlikeClub: (clubId: number) =>
    apiClient<void>(`/api/clubs/${clubId}/like`, {
      method: 'DELETE',
    }),
};
