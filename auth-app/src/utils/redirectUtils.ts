/**
 * Utility functions for handling redirect URLs consistently across the auth app
 */

export interface RedirectParams {
  redirectTo?: string;
  next?: string;
  returnTo?: string;
}

/**
 * Extracts redirect URL from URL search parameters with priority order
 * @param searchParams - URLSearchParams object
 * @returns The redirect URL or null if none found
 */
export const getRedirectUrlFromParams = (searchParams: URLSearchParams): string | null => {
  const redirectTo = searchParams.get('redirectTo');
  const next = searchParams.get('next');
  const returnTo = searchParams.get('returnTo');
  
  // Priority order: redirectTo > next > returnTo
  if (redirectTo) {
    return decodeURIComponent(redirectTo);
  } else if (next) {
    return decodeURIComponent(next);
  } else if (returnTo) {
    return decodeURIComponent(returnTo);
  }
  
  return null;
};

/**
 * Builds email redirect URL with optional redirect parameter
 * @param baseUrl - Base URL for email confirmation
 * @param redirectUrl - Optional redirect URL to include as parameter
 * @returns Complete email redirect URL
 */
export const buildEmailRedirectUrl = (baseUrl: string, redirectUrl?: string | null): string => {
  if (!redirectUrl) {
    return baseUrl;
  }
  
  const url = new URL(baseUrl);
  url.searchParams.set('redirectTo', redirectUrl);
  return url.toString();
};

/**
 * Extracts redirect URL from current window location
 * @returns The redirect URL or null if none found
 */
export const getCurrentRedirectUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return getRedirectUrlFromParams(urlParams);
};

/**
 * Safely redirects to a URL, with fallback to email-confirmed page
 * @param redirectUrl - URL to redirect to
 * @param fallbackUrl - Fallback URL if redirectUrl is not provided
 */
export const safeRedirect = (redirectUrl: string | null, fallbackUrl: string = '/email-confirmed'): void => {
  if (redirectUrl) {
    console.log("Redirecting to:", redirectUrl);
    window.location.href = redirectUrl;
  } else {
    console.log("No specific redirect, going to fallback:", fallbackUrl);
    window.location.href = `${window.location.origin}${fallbackUrl}`;
  }
}; 