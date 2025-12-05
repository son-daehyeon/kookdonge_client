import {
  ClubFeedListRes,
  FeedCreatedReq,
  PresignedUrlListReq,
  PresignedUrlListRes,
} from '@/types/api';
import { apiClient } from '@/lib/api/client';

export const feedApi = {
  getClubFeeds: (clubId: number) =>
    apiClient<ClubFeedListRes>('/api/feeds', {
      params: { club: clubId },
    }),

  createFeed: (clubId: number, data: FeedCreatedReq) =>
    apiClient<void>('/api/feeds', {
      method: 'POST',
      params: { club: clubId },
      body: data,
    }),

  getPresignedUrls: (clubId: number, data: PresignedUrlListReq) =>
    apiClient<PresignedUrlListRes>('/api/presigned-urls', {
      method: 'POST',
      params: { club: clubId },
      body: data,
    }),
};
