import { ClubInWaitingListDto, ResponseDTO } from '@/types/api';
import { apiClient } from '@/lib/api/client';

export const waitingListApi = {
  getMyWaitingList: () =>
    apiClient<ResponseDTO<ClubInWaitingListDto[]>>('/api/users/me/waiting-list'),

  addToWaitingList: (clubId: number) =>
    apiClient<ResponseDTO<void>>(`/api/clubs/${clubId}/waiting-list`, {
      method: 'POST',
    }),

  removeFromWaitingList: (clubId: number) =>
    apiClient<ResponseDTO<void>>(`/api/clubs/${clubId}/waiting-list`, {
      method: 'DELETE',
    }),
};
