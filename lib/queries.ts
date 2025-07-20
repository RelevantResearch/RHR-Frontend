
import { useQuery } from '@tanstack/react-query';
import { getAllEmployees, getUserById } from '@/api/user';
import { fetchDepartments } from '@/api/department';
import { getAllRoles } from '@/api/roles';
import { Role } from '@/types/role';

export const useEmployeesQuery = () =>
  useQuery({
    queryKey: ['employees'],
    queryFn: getAllEmployees,
  });

export const useDepartmentsQuery = () =>
  useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  });


export const useEmployeeByIdQuery = (id: string) =>
  useQuery({
    queryKey: ['employee', id],
    queryFn: () => getUserById(Number(id)),
    enabled: !!id,
  });


export const useRolesQuery = () =>
  useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: getAllRoles,
  });