import { NextRequest } from 'next/server';

export function getAppBaseUrl(request?: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  if (request) {
    return request.nextUrl.origin;
  }

  return 'http://localhost:3000';
}

export function toAbsoluteUrl(url: string, request?: NextRequest) {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `${getAppBaseUrl(request)}${url.startsWith('/') ? url : `/${url}`}`;
}
