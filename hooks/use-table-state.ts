'use client';

import { useState, useMemo } from 'react';

export interface TableState {
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  filters: Record<string, string | string[]>;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface UseTableStateProps {
  initialPageSize?: number;
  initialFilters?: Record<string, string | string[]>;
}

export function useTableState({
  initialPageSize = 10,
  initialFilters = {},
}: UseTableStateProps = {}) {
  const [state, setState] = useState<TableState>({
    currentPage: 1,
    pageSize: initialPageSize,
    searchTerm: '',
    filters: initialFilters,
  });

  const setCurrentPage = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  const setPageSize = (size: number) => {
    setState(prev => ({ ...prev, pageSize: size, currentPage: 1 }));
  };

  const setSearchTerm = (term: string) => {
    setState(prev => ({ ...prev, searchTerm: term, currentPage: 1 }));
  };

  const setFilter = (key: string, value: string | string[]) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
      currentPage: 1,
    }));
  };

  const clearFilters = () => {
    setState(prev => ({
      ...prev,
      filters: {},
      searchTerm: '',
      currentPage: 1,
    }));
  };

  const setSort = (key: string, direction: 'asc' | 'desc') => {
    setState(prev => ({ ...prev, sortKey: key, sortDirection: direction }));
  };

  const clearSort = () => {
    setState(prev => ({ ...prev, sortKey: undefined, sortDirection: undefined }));
  };

  const reset = () => {
    setState({
      currentPage: 1,
      pageSize: initialPageSize,
      searchTerm: '',
      filters: initialFilters,
    });
  };

  return {
    state,
    setCurrentPage,
    setPageSize,
    setSearchTerm,
    setFilter,
    clearFilters,
    setSort,
    clearSort,
    reset,
  };
}

// Hook for filtering and sorting data
export function useFilteredData<T>(
  data: T[],
  state: TableState,
  searchFields: (keyof T)[],
  customFilter?: (item: T, filters: Record<string, string | string[]>) => boolean
) {
  return useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (state.searchTerm) {
      const searchLower = state.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value?.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply filters
    if (customFilter) {
      filtered = filtered.filter(item => customFilter(item, state.filters));
    } else {
      // Default filter logic
      Object.entries(state.filters).forEach(([key, value]) => {
        if (!value || value === 'all' || (Array.isArray(value) && value.length === 0)) return;
        
        filtered = filtered.filter(item => {
          const itemValue = item[key as keyof T];
          if (Array.isArray(value)) {
            return value.includes(itemValue as string);
          }
          return itemValue === value;
        });
      });
    }

    // Apply sorting
    if (state.sortKey && state.sortDirection) {
      filtered.sort((a, b) => {
        const aValue = a[state.sortKey as keyof T];
        const bValue = b[state.sortKey as keyof T];
        
        if (aValue === bValue) return 0;
        
        const comparison = aValue < bValue ? -1 : 1;
        return state.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [data, state, searchFields, customFilter]);
}