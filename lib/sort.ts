export function sortData<T>(
  data: T[],
  key: keyof T,
  direction: 'asc' | 'desc'
): T[] {
  return [...data].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === bValue) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return (aValue.localeCompare(bValue) * (direction === 'asc' ? 1 : -1));
    }

    return ((aValue < bValue ? -1 : 1) * (direction === 'asc' ? 1 : -1));
  });
}
