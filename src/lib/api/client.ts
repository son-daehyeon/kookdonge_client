import { ResponseDTO } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.kookdonge.co.kr';

type RequestOptions<TBody = unknown> = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: TBody;
  params?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

function wrapRequest<T>(body: T) {
  return {
    timestamp: new Date().toISOString(),
    data: body,
  };
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body, params } = options;
  const token = getAuthToken();

  const shouldWrapBody = body !== undefined && ['POST', 'PUT', 'PATCH'].includes(method);

  const response = await fetch(buildUrl(endpoint, params), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: shouldWrapBody ? JSON.stringify(wrapRequest(body)) : undefined,
  });

  // TODO: 오류 핸들링
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const json: ResponseDTO<T> = await response.json();
  return json.data;
}
