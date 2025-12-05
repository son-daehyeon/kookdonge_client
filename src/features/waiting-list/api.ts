import { ClubInWaitingListDto } from '@/types/api';
import { apiClient } from '@/lib/api/client';

export const waitingListApi = {
  getMyWaitingList: () => apiClient<ClubInWaitingListDto[]>('/api/waiting-lists'),

  addToWaitingList: (clubId: number) =>
    apiClient<void>(`/api/clubs/${clubId}/waiting`, {
      method: 'POST',
    }),

  removeFromWaitingList: (clubId: number) =>
    apiClient<void>(`/api/clubs/${clubId}/waiting`, {
      method: 'DELETE',
    }),
};
