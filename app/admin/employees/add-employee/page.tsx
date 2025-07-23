'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { BreadcrumbNavigation } from '@/components/ui/breadcrumbs-navigation';
import { EmployeeForm, EmployeeFormData, createEmptyEmployee } from '@/components/employeeForm';
import { createUserApi, CreateUserPayload } from '@/api/user'; 
import { useDepartmentsQuery, useRolesQuery } from '@/lib/queries';

// export default function AddEmployeePage() {
//   const { user } = useAuth();
//   const router = useRouter();

//   const [employee, setEmployee] = useState<EmployeeFormData>(createEmptyEmployee());
//   const [isLoading, setIsLoading] = useState(false);

//   if (user?.role?.name !== 'Admin') {
//     router.push('/unauthorized');
//     return null;
//   }

//   const handleAddEmployee = async () => {

//     setIsLoading(true);
//     try {
//       // await createUserApi(employee);
//       toast.success('Employee added successfully');
//       router.push('/admin/employees');
//     } catch {
//       toast.error('Failed to add employee');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     router.push('/admin/employees');
//   };

//   const handleReset = () => {
//     setEmployee(createEmptyEmployee());
//     toast.info('Form reset');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container">
//         <BreadcrumbNavigation dynamicData={{ page: 'Add Employee' }} />
//         <EmployeeForm
//           employee={employee}
//           onEmployeeChange={setEmployee}
//           onSubmit={handleAddEmployee}
//           onCancel={handleCancel}
//           onReset={handleReset}
//           isLoading={isLoading}
//           isEditMode={false}
//           readOnlyFields={[]}
//         />
//       </div>
//     </div>
//   );
// }

export default function AddEmployeePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [employee, setEmployee] = useState<EmployeeFormData>(createEmptyEmployee());
  const [isLoading, setIsLoading] = useState(false);

  // Get departments and roles data for mapping
  const { data: departments = [] } = useDepartmentsQuery();
  const { data: roles = [] } = useRolesQuery();

  if (user?.role?.name !== 'Admin') {
    router.push('/unauthorized');
    return null;
  }

  const handleAddEmployee = async () => {
    setIsLoading(true);
    try {
      // Find the department ID by name
      const department = departments.find(dept => dept.name === employee.department);
      const departmentId = department?.id;

      // Find the role ID by name
      const role = roles.find(r => r.name === employee.role);
      const roleId = role?.id;

      // Validate that we found the IDs
      if (!departmentId) {
        toast.error('Invalid department selected');
        return;
      }

      if (!roleId) {
        toast.error('Invalid role selected');
        return;
      }

      // Transform the form data to match API payload
      const apiPayload: CreateUserPayload = {
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        password: employee.password,
        fullTimer: employee.employmentType === 'full-time', // Convert to boolean
        salary: parseFloat(employee.salary), // Convert to number
        address: employee.address || undefined,
        roleId: roleId,
        position: employee.position,
        departmentId: departmentId,
        document: "test docs",
      };

      await createUserApi(apiPayload);
      toast.success('Employee added successfully');
      router.push('/admin/employees');
    } catch (error) {
      console.error('Error adding employee:', error);
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