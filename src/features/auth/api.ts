import {
  LoginReq,
  LoginRes,
  RegisterUserReq,
  RegisterUserRes,
  ReissueAccessTokenReq,
  ReissueAccessTokenRes,
  UserProfileRes,
} from '@/types/api';
import { apiClient } from '@/lib/api/client';

export const authApi = {
  login: (data: LoginReq) =>
    apiClient<LoginRes>('/api/auth', {
      method: 'POST',
      body: data,
    }),

  register: (data: RegisterUserReq) =>
    apiClient<RegisterUserRes>('/api/users/me', {
      method: 'POST',
      body: data,
    }),

  reissueToken: (data: ReissueAccessTokenReq) =>
    apiClient<ReissueAccessTokenRes>('/api/auth/reissue', {
      method: 'POST',
      body: data,
    }),

  getMyProfile: () => apiClient<UserProfileRes>('/api/users/me'),
};
