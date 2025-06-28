'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  label?: string; // e.g. "employees", "records"
  className?: string;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  label = 'items',
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalItems === 0 || totalPages <= 1) {
    return (
      <div className={`mt-4 text-sm text-muted-foreground text-center ${className ?? ''}`}>
        Showing all {totalItems} {label}
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 ${className ?? ''}`}>
      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        Showing {startIndex} to {endIndex} of {totalItems} {label}
      </div>
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0 sm:w-auto sm:px-3"
        >
          <ChevronLeft className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="hidden sm:flex items-center gap-1">
          {getVisiblePages().map((page, idx) =>
            typeof page === 'number' ? (
              <Button
                key={idx}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ) : (
              <span
                key={idx}
                className="h-8 w-8 flex items-center justify-center text-xs text-muted-foreground"
              >
                ...
              </span>
            )
          )}
        </div>

        <div className="sm:hidden flex items-center px-3 py-1 text-sm bg-muted rounded">
          {currentPage} / {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0 sm:w-auto sm:px-3"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4 sm:ml-2" />
        </Button>
      </div>
    </div>
  );
}
