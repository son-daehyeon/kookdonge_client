'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { LoginReq, RegisterUserReq, ReissueAccessTokenReq } from '@/types/api';

import { authApi } from './api';

export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

export function useMyProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authApi.getMyProfile,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginReq) => authApi.login(data),
    onSuccess: (res) => {
      if (res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterUserReq) => authApi.register(data),
    onSuccess: (res) => {
      if (res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

export function useReissueToken() {
  return useMutation({
    mutationFn: (data: ReissueAccessTokenReq) => authApi.reissueToken(data),
    onSuccess: (res) => {
      if (res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
      }
    },
  });
}
