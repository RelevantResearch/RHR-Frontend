import { useMemo } from 'react';

export function usePagination<T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number
) {
  return useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = data.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    return {
      paginated,
      totalPages,
      startIndex,
    };
  }, [data, currentPage, itemsPerPage]);
}
