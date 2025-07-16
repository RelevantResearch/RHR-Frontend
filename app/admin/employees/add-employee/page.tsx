'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { BreadcrumbNavigation } from '@/components/ui/breadcrumbs-navigation';
import { EmployeeForm, EmployeeFormData, createEmptyEmployee } from '@/components/employeeForm';
import { createUserApi } from '@/api/user'; 

export default function AddEmployeePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [employee, setEmployee] = useState<EmployeeFormData>(createEmptyEmployee());
  const [isLoading, setIsLoading] = useState(false);

  if (user?.role?.name !== 'Admin') {
    router.push('/unauthorized');
    return null;
  }

  const handleAddEmployee = async () => {
    if (!employee.name || !employee.email || !employee.phone || !employee.position || !employee.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // await createUserApi(employee);
      toast.success('Employee added successfully');
      router.push('/admin/employees');
    } catch {
      toast.error('Failed to add employee');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/employees');
  };

  const handleReset = () => {
    setEmployee(createEmptyEmployee());
    toast.info('Form reset');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container">
        <BreadcrumbNavigation dynamicData={{ page: 'Add Employee' }} />
        <EmployeeForm
          employee={employee}
          onEmployeeChange={setEmployee}
          onSubmit={handleAddEmployee}
          onCancel={handleCancel}
          onReset={handleReset}
          isLoading={isLoading}
          isEditMode={false}
          readOnlyFields={[]}
        />
      </div>
    </div>
  );
}
