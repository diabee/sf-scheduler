export * from './error';

/**
 * Appends a timestamp to the URL to bypass browser cache.
 * Robust implementation that cleans existing cache busters.
 */
export const getCacheFreeUrl = (url: string): string => {
  if (!url) return '';
  
  // Skip data URLs and very short strings
  if (url.startsWith('data:')) return url;
  if (!url.startsWith('http') && !url.startsWith('/') && !url.includes('.')) return url;

  try {
    const urlObj = new URL(url.startsWith('http') ? url : window.location.origin + (url.startsWith('/') ? url : '/' + url));
    urlObj.searchParams.set('cb', Date.now().toString());
    
    // If it was a relative URL, return the relative part
    if (!url.startsWith('http')) {
      return urlObj.pathname + urlObj.search + urlObj.hash;
    }
    return urlObj.toString();
  } catch {
    // Fallback for weird URLs
    // Remove old cb if present (simple regex)
    const cleanUrl = url.replace(/([?&])cb=[^&]*(&|$)/, '$1').replace(/[?&]$/, '');
    const finalSeparator = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${finalSeparator}cb=${Date.now()}`;
  }
};
