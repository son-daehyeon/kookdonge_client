import {
  ClubFeedListRes,
  FeedCreatedReq,
  PresignedUrlListReq,
  PresignedUrlListRes,
} from '@/types/api';
import { apiClient } from '@/lib/api/client';

export const feedApi = {
  getClubFeeds: (clubId: number) => apiClient<ClubFeedListRes>(`/api/clubs/${clubId}/feeds`),

  createFeed: (clubId: number, data: FeedCreatedReq) =>
    apiClient<void>(`/api/clubs/${clubId}/feeds`, {
      method: 'POST',
      body: data,
    }),

  deleteFeed: (clubId: number, feedId: number) =>
    apiClient<void>(`/api/clubs/${clubId}/feeds/${feedId}`, {
      method: 'DELETE',
    }),

  getPresignedUrls: (data: PresignedUrlListReq) =>
    apiClient<PresignedUrlListRes>('/api/presigned-urls', {
      method: 'POST',
      body: data,
    }),
};
