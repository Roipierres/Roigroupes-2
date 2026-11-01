import test from 'node:test';
import assert from 'node:assert/strict';
import { filterApps, formatDownloadCount, calculateAverageRating, getNextCategoryIndex } from './helpers.js';
import { AppItem, ReviewItem } from '../types/index.js';

const mockApps: AppItem[] = [
  {
    id: '1',
    title: 'سجل الأعمال الذكي',
    titleFr: 'Registre Commercial Intelligente',
    slug: 'business-registry',
    category: 'commercial',
    shortDesc: 'إدارة متكاملة',
    shortDescFr: 'Gestion intégrée',
    fullDesc: '',
    fullDescFr: '',
    icon: 'briefcase',
    badge: 'تجارية',
    badgeFr: 'Commercial',
    downloadsCount: 150000,
    rating: 4.8,
    reviewsCount: 120,
    size: '25MB',
    version: '2.1.0',
    updatedDate: '2026-03-01',
    developer: 'ProTech',
    screenshots: [],
    features: [],
    featuresFr: [],
    downloadLinks: { androidUrl: '#', iosUrl: '#', apkSize: '25MB' },
    status: 'published'
  },
  {
    id: '2',
    title: 'مربّي الأسرة',
    titleFr: 'Guide Familial',
    slug: 'family-guide',
    category: 'family',
    shortDesc: 'تنظيم شؤون العائلة',
    shortDescFr: 'Organisation familiale',
    fullDesc: '',
    fullDescFr: '',
    icon: 'heart',
    badge: 'عائلية',
    badgeFr: 'Familiale',
    downloadsCount: 1200000,
    rating: 4.9,
    reviewsCount: 300,
    size: '18MB',
    version: '1.5.0',
    updatedDate: '2026-02-15',
    developer: 'FamilySoft',
    screenshots: [],
    features: [],
    featuresFr: [],
    downloadLinks: { androidUrl: '#', iosUrl: '#', apkSize: '18MB' },
    status: 'published'
  }
];

test('formatDownloadCount formats numbers correctly in Arabic and French', () => {
  assert.equal(formatDownloadCount(150000, 'ar'), '150 ألف+');
  assert.equal(formatDownloadCount(1200000, 'ar'), '1.2 مليون+');
  assert.equal(formatDownloadCount(1200000, 'fr'), '1.2M+');
  assert.equal(formatDownloadCount(500, 'ar'), '500');
});

test('filterApps filters correctly by category and query', () => {
  const commercialApps = filterApps(mockApps, 'commercial', '', 'ar');
  assert.equal(commercialApps.length, 1);
  assert.equal(commercialApps[0].id, '1');

  const searched = filterApps(mockApps, 'all', 'الأسرة', 'ar');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, '2');
});

test('calculateAverageRating calculates correct rounded mean', () => {
  const reviews: ReviewItem[] = [
    { id: '1', appId: '1', userName: 'A', userEmail: '', userAvatar: '', authProvider: 'google', rating: 5, comment: '', date: '', isVerified: true, status: 'approved' },
    { id: '2', appId: '1', userName: 'B', userEmail: '', userAvatar: '', authProvider: 'facebook', rating: 4, comment: '', date: '', isVerified: true, status: 'approved' }
  ];
  assert.equal(calculateAverageRating(reviews), 4.5);
});

test('getNextCategoryIndex loops over total apps count', () => {
  assert.equal(getNextCategoryIndex(0, 3), 1);
  assert.equal(getNextCategoryIndex(2, 3), 0);
  assert.equal(getNextCategoryIndex(0, 0), 0);
});
