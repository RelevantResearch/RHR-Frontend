'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface TableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  responsive?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  render?: (item: T) => ReactNode;
}

export interface TableAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
}

interface ReusableTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
}

export function ReusableTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  sortKey,
  sortDirection,
  onSort,
  emptyMessage = 'No data available',
  striped = false,
  hoverable = true,
  className,
}: ReusableTableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;

    if (sortKey === key) {
      // Toggle direction
      onSort(key, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, start with asc
      onSort(key, 'asc');
    }
  };

  const renderCell = (item: T, column: TableColumn<T>) => {
    if (column.render) {
      return column.render(item);
    }
    return item[column.key];
  };

  const getResponsiveClass = (responsive?: string) => {
    switch (responsive) {
      case 'sm':
        return 'hidden sm:table-cell';
      case 'md':
        return 'hidden md:table-cell';
      case 'lg':
        return 'hidden lg:table-cell';
      case 'xl':
        return 'hidden xl:table-cell';
      default:
        return '';
    }
  };

  // const renderPagination = () => {
  //   if (totalPages <= 1) return null;

  //   const getVisiblePages = () => {
  //     const delta = 2;
  //     const range = [];
  //     const rangeWithDots = [];

  //     for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
  //       range.push(i);
  //     }

  //     if (currentPage - delta > 2) {
  //       rangeWithDots.push(1, '...');
  //     } else {
  //       rangeWithDots.push(1);
  //     }

  //     rangeWithDots.push(...range);

  //     if (currentPage + delta < totalPages - 1) {
  //       rangeWithDots.push('...', totalPages);
  //     } else if (totalPages > 1) {
  //       rangeWithDots.push(totalPages);
  //     }

  //     return rangeWithDots;
  //   };

  //   return (
  //     <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
  //       <div className="text-sm text-muted-foreground order-2 sm:order-1">
  //         Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
  //       </div>
  //       <div className="flex items-center gap-2 order-1 sm:order-2">
  //         <div className="flex items-center gap-2">
  //           <span className="text-sm text-muted-foreground">Rows per page:</span>
  //           <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
  //             <SelectTrigger className="w-16 h-8">
  //               <SelectValue />
  //             </SelectTrigger>
  //             <SelectContent>
  //               <SelectItem value="5">5</SelectItem>
  //               <SelectItem value="10">10</SelectItem>
  //               <SelectItem value="20">20</SelectItem>
  //               <SelectItem value="50">50</SelectItem>
  //             </SelectContent>
  //           </Select>
  //         </div>

  //         <div className="flex items-center gap-1">
  //           <Button
  //             variant="outline"
  //             size="sm"
  //             onClick={() => onPageChange(Math.max(1, currentPage - 1))}
  //             disabled={currentPage === 1}
  //             className="h-8 w-8 p-0 sm:w-auto sm:px-3"
  //           >
  //             <ChevronLeft className="h-4 w-4 sm:mr-2" />
  //             <span className="hidden sm:inline">Previous</span>
  //           </Button>

  //           <div className="hidden sm:flex items-center gap-1">
  //             {getVisiblePages().map((page, index) => (
  //               <Button
  //                 key={index}
  //                 variant={currentPage === page ? "default" : "outline"}
  //                 size="sm"
  //                 onClick={() => typeof page === 'number' && onPageChange(page)}
  //                 disabled={typeof page !== 'number'}
  //                 className="h-8 w-8 p-0"
  //               >
  //                 {page}
  //               </Button>
  //             ))}
  //           </div>

  //           {/* Mobile pagination info */}
  //           <div className="sm:hidden flex items-center px-3 py-1 text-sm bg-muted rounded">
  //             {currentPage} / {totalPages}
  //           </div>

  //           <Button
  //             variant="outline"
  //             size="sm"
  //             onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
  //             disabled={currentPage === totalPages}
  //             className="h-8 w-8 p-0 sm:w-auto sm:px-3"
  //           >
  //             <span className="hidden sm:inline">Next</span>
  //             <ChevronRight className="h-4 w-4 sm:ml-2" />
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const renderPagination = () => {
    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

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
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
        </div>

        {/* Only show controls if totalPages > 1 */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
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
                {getVisiblePages().map((page, index) => (
                  <Button
                    key={index}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={typeof page !== 'number'}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
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
        )}
      </div>
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'px-4 py-3 text-left text-sm font-medium text-muted-foreground',
                      getResponsiveClass(column.responsive),
                      column.sortable && 'cursor-pointer hover:text-foreground',
                      column.className
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={cn(
                              'h-3 w-3',
                              sortKey === column.key && sortDirection === 'asc'
                                ? 'text-foreground'
                                : 'text-muted-foreground/50'
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              'h-3 w-3 -mt-1',
                              sortKey === column.key && sortDirection === 'desc'
                                ? 'text-foreground'
                                : 'text-muted-foreground/50'
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className={cn(
                      'border-t',
                      striped && index % 2 === 1 && 'bg-muted/25',
                      hoverable && 'hover:bg-muted/50 transition-colors'
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          'px-4 py-3 text-sm',
                          getResponsiveClass(column.responsive),
                          column.className
                        )}
                      >
                        {renderCell(item, column)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {renderPagination()}
    </div>
  );
}