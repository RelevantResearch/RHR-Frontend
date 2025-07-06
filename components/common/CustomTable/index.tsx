import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import Paginate from "./Paginate";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_PAGE_LIMIT } from "@/static/table";
import { cn } from "@/lib/utils";

type Props = {
  data: unknown[];
  columns: any;
  totalCount: number;
  currentPage?: number;
  perPage?: number;
  handlePageChange?: (page: string) => void;
  handlePerPageChange?: (perPage: number) => void;
  isLoading?: boolean;
  tableClassName?: string;
};

export function CustomTable({
  data,
  columns,
  totalCount,
  currentPage = 0,
  perPage = DEFAULT_PAGE_LIMIT,
  handlePageChange,
  handlePerPageChange,
  isLoading = false,
  tableClassName,
}: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: Math.ceil(totalCount / perPage),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    table.setPageIndex(Number(currentPage - 1));
  }, [currentPage]);

  return (
    <>
      <Table
        className={cn(
          `border-spacing-6 w-[900px] lg:w-full overflow-auto`,
          tableClassName
        )}
      >
        <TableHeader className="bg-white-200 rounded-t-sm p-4 [&_tr]:border-b-0 sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="border-0" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="text-black-800 text-[13px] font-normal uppercase px-4 md:px-2 py-3"
                    key={header.id}
                    style={{ maxWidth: header.column.columnDef.maxSize }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="h-full w-full">
          {isLoading ? (
            table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="border-0" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="text-black-800 text-[13px] font-normal uppercase px-2"
                      key={header.id}
                    >
                      <div className="flex flex-col gap-4">
                        <Skeleton className="w-full h-10 mt-4" />
                        <Skeleton className="w-full h-10" />
                        <Skeleton className="w-full h-10" />
                        <Skeleton className="w-full h-10" />
                        <Skeleton className="w-full h-10" />
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <>
              {table &&
              table.getRowModel().rows &&
              table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b w-full"
                  >
                    {row.getVisibleCells().map((cell: any) => (
                      <TableCell
                        style={{
                          width:
                            `${cell?.column?.columnDef?.meta?.size}` || "auto",
                          maxWidth: cell.column.columnDef.maxSize,
                        }}
                        className="paragraph-2 text-black px-4 md:px-2 py-3"
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="flex justify-center hover:bg-white">
                  <TableCell
                    colSpan={columns?.length}
                    className="h-24 text-center"
                  >
                    <p className="left-0 right-0 absolute">No data</p>
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>

      <Paginate
        itemsCount={totalCount}
        itemsPerPage={perPage}
        currentPage={currentPage}
        setCurrentPage={(page: string) => {
          table.setPageIndex(Number(page) - 1);
          handlePageChange && handlePageChange(page);
        }}
        setCurrentPageSize={(perPage: number) => {
          table.setPageSize(Number(perPage));
          handlePerPageChange && handlePerPageChange(perPage);
        }}
      />
    </>
  );
}
