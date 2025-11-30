import {
  LoginReq,
  LoginRes,
  RegisterUserReq,
  RegisterUserRes,
  ReissueAccessTokenReq,
  ReissueAccessTokenRes,
  RequestDTO,
  ResponseDTO,
  UserProfileRes,
} from '@/types/api';
import { apiClient } from '@/lib/api/client';

export const authApi = {
  login: (data: LoginReq) =>
    apiClient<ResponseDTO<LoginRes>>('/api/auth', {
      method: 'POST',
      params: { request: JSON.stringify({ data }) },
    }),

  register: (data: RegisterUserReq) =>
    apiClient<ResponseDTO<RegisterUserRes>>('/api/users/me', {
      method: 'POST',
      body: { data } as RequestDTO<RegisterUserReq>,
    }),

  reissueToken: (data: ReissueAccessTokenReq) =>
    apiClient<ResponseDTO<ReissueAccessTokenRes>>('/api/auth/reissue', {
      method: 'POST',
      params: { request: JSON.stringify({ data }) },
    }),

  getMyProfile: () => apiClient<ResponseDTO<UserProfileRes>>('/api/users/me'),
};
