import {
  ClubFeedListRes,
  FeedCreatedReq,
  PresignedUrlListReq,
  PresignedUrlListRes,
  RequestDTO,
  ResponseDTO,
} from '@/types/api';
import { apiClient } from '@/lib/api/client';

export const feedApi = {
  getClubFeeds: (clubId: number) =>
    apiClient<ResponseDTO<ClubFeedListRes>>(`/api/clubs/${clubId}/feeds`),

  createFeed: (clubId: number, data: FeedCreatedReq) =>
    apiClient<ResponseDTO<void>>(`/api/clubs/${clubId}/feeds`, {
      method: 'POST',
      body: { data } as RequestDTO<FeedCreatedReq>,
    }),

  deleteFeed: (clubId: number, feedId: number) =>
    apiClient<ResponseDTO<void>>(`/api/clubs/${clubId}/feeds/${feedId}`, {
      method: 'DELETE',
    }),

  getPresignedUrls: (data: PresignedUrlListReq) =>
    apiClient<ResponseDTO<PresignedUrlListRes>>('/api/presigned-urls', {
      method: 'POST',
      body: { data } as RequestDTO<PresignedUrlListReq>,
    }),
};
