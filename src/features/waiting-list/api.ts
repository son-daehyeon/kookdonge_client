import { ClubInWaitingListDto } from '@/types/api';
import { apiClient } from '@/lib/api/client';

export const waitingListApi = {
  getMyWaitingList: () => apiClient<ClubInWaitingListDto[]>('/api/users/me/waiting-list'),

  addToWaitingList: (clubId: number) =>
    apiClient<void>(`/api/clubs/${clubId}/waiting-list`, {
      method: 'POST',
    }),

  removeFromWaitingList: (clubId: number) =>
    apiClient<void>(`/api/clubs/${clubId}/waiting-list`, {
      method: 'DELETE',
    }),
};
