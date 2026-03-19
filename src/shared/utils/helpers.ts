export const isPositiveNumber = (val: unknown): boolean =>
  typeof val === 'number' && !isNaN(val) && val > 0;

export const calcAverageRating = (ratings: number[]): number => {
  if (!ratings.length) return 0;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
};

export const sortBy = <T>(arr: T[], key: keyof T, dir: 'asc' | 'desc' = 'asc'): T[] =>
  [...arr].sort((a, b) => {
    if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
    return 0;
  });

export const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

export const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'An unexpected error occurred';
};

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));