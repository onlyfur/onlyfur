/**
 * This file replaces mockContent.ts
 * All data is now loaded from the real PostgreSQL database via the realDataAPI
 * No more mock data is used in the application
 */

export const mockDataReplacementNote = `
OnlyFur Platform v3.4.0 - Real Data Integration Complete

All mock data has been replaced with real database queries:
- Creators are loaded from PostgreSQL User table
- Content is loaded from PostgreSQL Content table  
- Platform statistics are calculated from real data
- All components now use realDataAPI for data fetching

Mock data files are no longer used in the application.
`;

// Legacy export for backward compatibility - returns empty arrays
export const mockCreators: any[] = [];
export const mockContent: any[] = [];

export const getCreatorById = (id: string): any => {
  console.warn('getCreatorById is deprecated. Use realDataAPI.getUserById() instead.');
  return null;
};

export const getContentWithCreators = () => {
  console.warn('getContentWithCreators is deprecated. Use realDataAPI.getContentWithCreators() instead.');
  return [];
};

export const getSortedContent = () => {
  console.warn('getSortedContent is deprecated. Use realDataAPI.getSortedContent() instead.');
  return [];
};
