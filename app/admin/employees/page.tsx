'use client';


import { useEmployeesQuery, useDepartmentsQuery } from '@/lib/queries';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { sortData } from '@/lib/sort';
import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Trash2, Edit } from "lucide-react";
import {
  ReusableTable,
  TableColumn,
} from "@/components/customeTable/DataTable";
import { TableFilters, FilterGroup } from "@/components/customeTable/DataTableFilters";
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserApi, deleteUserApi } from '@/api/user';
import { BreadcrumbNavigation } from "@/components/ui/breadcrumbs-navigation";
import { Department } from '@/lib/types';


interface Employee {
  DOB: string | number | Date;
  id: string;
  name: string;
  email: string;
  phone: string;
  department: Department;
  position: string;
  status: 'active' | 'inactive';
  joinDate: string;
  employmentType: 'full-time' | 'part-time';
  role: 'admin' | 'employee';
  address: string;
  avatar?: string;
}

export default function EmployeesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    department: 'all',
    status: 'all',
    employmentType: 'all',
    role: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [tableLoading, setTableLoading] = useState(false);
  const { data: departments = [], isLoading: deptLoading } = useDepartmentsQuery();
  const { data: fetchedEmployees = [], isLoading: loading } = useEmployeesQuery();
  const [softDeletedIds, setSoftDeletedIds] = useState<string[]>([]);

  const employees = useMemo(() => {
    return (fetchedEmployees ?? [])
      .filter((emp: { id: string }) => !softDeletedIds.includes(emp.id))
      .map((emp: { isDeleted: boolean; fullTimer: boolean; }) => ({
        ...emp,
        status: emp.isDeleted === false ? 'active' : 'inactive',
        employmentType: emp.fullTimer === true ? 'full-time' : 'part-time',
      }));
  }, [fetchedEmployees, softDeletedIds]);


  const handleSort = (key: keyof Employee) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };


  const handleDeleteEmployee = async (id: string) => {
    const userToDelete = fetchedEmployees?.find((emp: { id: string; }) => emp.id === id);

    if (!userToDelete) {
      toast.error("Employee not found.");
      return;
    }

    try {
      await deleteUserApi(id);
      setSoftDeletedIds(prev => [...prev, id]);
      toast.success(`Soft deleted employee: ${userToDelete.name}`);
    } catch (err) {
      console.error(`[ERROR] Soft delete failed for ID ${id}:`, err);
      toast.error("Failed to delete employee.");
    }
  };


  const filteredEmployees = useMemo(() => {
    return (employees as Employee[]).filter((employee: Employee) => {
      const matchesSearch = !searchTerm ||
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = filters.department === 'all' || employee.department.name === filters.department;

      const matchesStatus = filters.status === 'all' || employee.status === filters.status;

      const matchesEmploymentType = filters.employmentType === 'all' || employee.employmentType === filters.employmentType;

      return matchesSearch && matchesDepartment && matchesStatus && matchesEmploymentType;
    });
  }, [employees, searchTerm, filters]);

  const sortedEmployees = useMemo(() => {
    if (!sortKey) return filteredEmployees;
    return sortData(filteredEmployees, sortKey, sortDirection);
  }, [filteredEmployees, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedEmployees.length / pageSize);
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedEmployees.slice(start, start + pageSize);
  }, [sortedEmployees, currentPage, pageSize]);

  const departmentFilterOptions = departments.map(dept => ({
    key: dept.name.toLowerCase().replace(/\s+/g, '-'),
    label: dept.name,
    value: dept.name,
  }));

  const filterGroups: FilterGroup[] = [
    {
      key: 'department',
      label: 'Department',
      options: departmentFilterOptions,
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { key: 'active', label: 'Active', value: 'active' },
        { key: 'inactive', label: 'Inactive', value: 'inactive' },
      ],
    },
    {
      key: 'employmentType',
      label: 'Job Type',
      options: [
        { key: 'full-time', label: 'Full Time', value: 'full-time' },
        { key: 'part-time', label: 'Part Time', value: 'part-time' },
      ],
    },
  ];

  const columns: TableColumn<Employee>[] = [
    {
      key: 'name',
      header: 'Employee',
      sortable: true,
      render: (employee) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={employee.avatar} alt={employee.name} />
            <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{employee.name}</div>
            <div className="text-sm text-gray-500">{employee.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      responsive: 'md',
      render: (employee) => employee.department?.name || 'N/A',
    },
    {
      key: 'position',
      header: 'Position',
      responsive: 'md',
    },
    {
      key: 'status',
      header: 'Status',
      responsive: 'lg',
      render: (employee) => {
        const status = (employee.status ?? '').toLowerCase();
        return (
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status || 'N/A'}
          </Badge>
        );
      },
    },
    {
      key: 'employmentType',
      header: 'Type',
      responsive: 'lg',
      render: (employee) => {
        const type = (employee.employmentType ?? '').toLowerCase().replace('-', ' ');
        return (
          <span className="text-sm capitalize">
            {type || 'N/A'}
          </span>
        );
      },
      sortable: true,
    },

    {
      key: 'joinDate',
      header: 'Join Date',
      responsive: 'md',
      sortable: true,
      render: (employee) => format(new Date(employee.DOB), 'MMM dd, yyyy'),
    },
  ];



  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };



  const handleClearFilters = () => {
    setFilters({
      department: 'all',
      status: 'all',
      employmentType: 'all',
      role: 'all'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const renderActions = (employee: Employee) => {
    return (
      <div className="flex items-center gap-1">
        <Link href={`/admin/employees/view-employee?id=${employee.id}`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </Link>

        {user?.role?.name === 'Admin' && (
          <>
            <Link href={`/admin/employees/edit-employee?id=${employee.id}`}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </Link>

            <ConfirmDialog
              title="Delete Employee"
              description={`Are you sure you want to delete ${employee.name}? This action cannot be undone.`}
              confirmText="Delete"
              onConfirm={() => handleDeleteEmployee(employee.id)}
              triggerButton={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />

          </>
        )}
      </div>
    );
  };

  const columnsWithActions: TableColumn<Employee>[] = [
    ...columns,
    {
      key: 'actions',
      header: 'Actions',
      render: renderActions,
    },
  ];

  return (
    <div className="space-y-6">
      < BreadcrumbNavigation />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TableFilters
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search employees..."
          filterGroups={filterGroups}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        {user?.role?.name === 'Admin' && (
          <Link href="/admin/employees/add-employee">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </Link>
        )}
      </div>


      <div className="relative">
        <ReusableTable
          data={paginatedEmployees}
          columns={columnsWithActions}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={sortedEmployees.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          sortKey={sortKey as string | undefined}
          sortDirection={sortDirection}
          onSort={(key, direction) => {
            setSortKey(key as keyof Employee);
            setSortDirection(direction);
            setCurrentPage(1);
          }}
          emptyMessage="No employees found"
          striped={true}
          hoverable={true}
        />

        <LoadingOverlay isVisible={tableLoading} className="absolute inset-0" />
      </div>
    </div>
  );
}