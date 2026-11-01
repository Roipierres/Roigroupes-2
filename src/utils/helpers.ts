import { AppItem, CategoryType, Language, ReviewItem } from '../types';

/**
 * Filter apps by category filter and search keyword
 */
export function filterApps(
  apps: AppItem[],
  categoryFilter: CategoryType | 'all',
  searchQuery: string,
  lang: Language = 'ar'
): AppItem[] {
  const query = searchQuery.trim().toLowerCase();
  
  return apps.filter((app) => {
    // Category match
    const categoryMatch = categoryFilter === 'all' || app.category === categoryFilter;
    if (!categoryMatch) return false;

    // Search query match
    if (!query) return true;

    const title = lang === 'fr' ? app.titleFr : app.title;
    const desc = lang === 'fr' ? app.shortDescFr : app.shortDesc;
    const dev = app.developer;

    return (
      title.toLowerCase().includes(query) ||
      desc.toLowerCase().includes(query) ||
      dev.toLowerCase().includes(query) ||
      app.title.toLowerCase().includes(query) ||
      app.titleFr.toLowerCase().includes(query)
    );
  });
}

/**
 * Format download count into readable format
 * @param count The actual real count
 * @param lang Language code
 * @param base The starting number (default 980 for site, 333 for apps)
 */
export function formatDownloadCount(count: number, lang: Language = 'ar', base: number = 980): string {
  const currentCount = base + count;
  
  if (currentCount >= 1000000) {
    const val = (currentCount / 1000000).toFixed(1).replace(/\.0$/, '');
    return lang === 'ar' ? `${val} مليون+` : `${val}M+`;
  }

  if (currentCount >= 10000) {
    const val = (currentCount / 1000).toFixed(1).replace(/\.0$/, '');
    return lang === 'ar' ? `${val} ألف+` : `${val}k+`;
  }
  
  return currentCount.toString();
}

/**
 * Calculate average rating for an array of reviews
 */
export function calculateAverageRating(reviews: ReviewItem[]): number {
  const approved = reviews.filter((r) => r.status === 'approved');
  if (approved.length === 0) return 5.0;
  const sum = approved.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / approved.length) * 10) / 10;
}

/**
 * Calculate next index for category rotation loop
 */
export function getNextCategoryIndex(currentIndex: number, totalApps: number): number {
  if (totalApps === 0) return 0;
  return (currentIndex + 1) % totalApps;
}
