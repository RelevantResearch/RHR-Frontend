'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { BreadcrumbNavigation } from '@/components/ui/breadcrumbs-navigation';
import { EmployeeForm, EmployeeFormData } from '@/components/employeeForm';
import { Employee } from '@/types/user';
import { getUserById } from '@/api/user';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export default function EditEmployeePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams?.get('id');

  useEffect(() => {
    if (user?.role?.name !== 'Admin') {
      router.push('/unauthorized');
    }
  }, [user, router]);

  const mapApiToFormData = (data: Employee): EmployeeFormData => ({
    name: data.name,
    email: data.email,
    phone: data.phone,
    department: data.department?.name || '',
    position: data.position || '',
    salary: String(data.salary ?? ''),
    joinDate: data.DOB || '',
    employmentType: data.fullTimer ? 'full-time' : 'part-time',
    role: data.UserRole?.[0]?.role.name === 'Admin' ? 'Admin' : 'Employee',
    address: data.address || '',
    status: data.isDeleted ? 'inactive' : 'active',
    bankDetails: {
      accountHolder: data.bankInfo?.acName || '',
      accountNumber: data.bankInfo?.acNumber || '',
      bankName: data.bankInfo?.name || '',
      panId: data.bankInfo?.tax || '',
      bankAddress: data.bankInfo?.address || '',
    },
    password: ''
  });

  const { data: employeeData, isLoading, isError, error } = useQuery<Employee, Error>({
    queryKey: ['employee', employeeId],
    queryFn: () => getUserById(Number(employeeId)),
    enabled: !!employeeId,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load employee');
      router.push('/admin/employees');
    }
  }, [isError, router]);



  const [formEmployee, setFormEmployee] = useState<EmployeeFormData | null>(null);
  const [originalEmployee, setOriginalEmployee] = useState<EmployeeFormData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (employeeData) {
      const formData = mapApiToFormData(employeeData);
      setFormEmployee(formData);
      setOriginalEmployee(formData);
    }
  }, [employeeData]);

  if (user?.role?.name !== 'Admin') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !formEmployee) {
    return null; 
  }

  const handleUpdateEmployee = async () => {
    if (!formEmployee) return;

    if (!formEmployee.department || !formEmployee.position) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUpdating(true);
    try {
      // await updateUserById(Number(employeeId), formEmployee);
      toast.success('Employee updated successfully');
      router.push('/admin/employees');
    } catch {
      toast.error('Failed to update employee');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/employees');
  };

  const handleResetChanges = () => {
    if (originalEmployee) {
      setFormEmployee({ ...originalEmployee });
      toast.info('Changes reset to original values');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container">
        <BreadcrumbNavigation dynamicData={{ employeeName: formEmployee.name }} />
        <EmployeeForm
          employee={formEmployee}
          onEmployeeChange={setFormEmployee}
          onSubmit={handleUpdateEmployee}
          onCancel={handleCancel}
          onReset={handleResetChanges}
          isLoading={isUpdating}
          isEditMode={true}
          readOnlyFields={['name', 'email', 'phone', 'address']}
        />
      </div>
    </div>
  );
}
