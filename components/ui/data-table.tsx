'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  responsive?: 'hidden' | 'sm' | 'md' | 'lg' | 'xl'; // Hide on smaller screens
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  showPagination?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  totalItems,
  loading = false,
  emptyMessage = 'No data found',
  className,
  showPagination = true,
  onSort,
  sortKey,
  sortDirection,
}: DataTableProps<T>) {
  const [internalPage, setInternalPage] = useState(currentPage);
  
  const totalPages = totalItems 
    ? Math.ceil(totalItems / pageSize)
    : Math.ceil(data.length / pageSize);
  
  const startIndex = (internalPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = totalItems ? data : data.slice(startIndex, endIndex);
  const displayedTotal = totalItems || data.length;

  const handlePageChange = (page: number) => {
    setInternalPage(page);
    onPageChange?.(page);
  };

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return;
    
    const key = column.key as string;
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  };

  const getResponsiveClass = (responsive?: string) => {
    switch (responsive) {
      case 'sm': return 'hidden sm:table-cell';
      case 'md': return 'hidden md:table-cell';
      case 'lg': return 'hidden lg:table-cell';
      case 'xl': return 'hidden xl:table-cell';
      case 'hidden': return 'hidden';
      default: return '';
    }
  };

  const renderPagination = () => {
    if (!showPagination || totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, internalPage - delta); i <= Math.min(totalPages - 1, internalPage + delta); i++) {
        range.push(i);
      }

      if (internalPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (internalPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Showing {startIndex + 1} to {Math.min(endIndex, displayedTotal)} of {displayedTotal} items
        </div>
        <div className="flex items-center gap-1 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, internalPage - 1))}
            disabled={internalPage === 1}
            className="h-8 w-8 p-0 sm:w-auto sm:px-3"
          >
            <ChevronLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          
          <div className="hidden sm:flex items-center gap-1">
            {getVisiblePages().map((page, index) => (
              <Button
                key={index}
                variant={internalPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={typeof page !== 'number'}
                className="h-8 w-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>

          <div className="sm:hidden flex items-center px-3 py-1 text-sm bg-muted rounded">
            {internalPage} / {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(totalPages, internalPage + 1))}
            disabled={internalPage === totalPages}
            className="h-8 w-8 p-0 sm:w-auto sm:px-3"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 sm:ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const renderCellContent = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item);
    }
    
    const value = column.key.toString().split('.').reduce((obj, key) => obj?.[key], item);
    return value?.toString() || '';
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead 
                  key={index} 
                  className={cn(
                    column.className,
                    getResponsiveClass(column.responsive),
                    column.sortable && "cursor-pointer hover:bg-muted/50"
                  )}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && sortKey === column.key && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center h-24">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground h-24">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column, colIndex) => (
                    <TableCell 
                      key={colIndex} 
                      className={cn(
                        column.className,
                        getResponsiveClass(column.responsive)
                      )}
                    >
                      {renderCellContent(item, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {renderPagination()}
    </div>
  );
}