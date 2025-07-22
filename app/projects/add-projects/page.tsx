
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BreadcrumbNavigation } from '@/components/ui/breadcrumbs-navigation';
import ProjectForm from '@/components/projectForm';
import { useDepartmentsQuery } from '@/lib/queries';
import { createProject } from '@/api/project';
import {
  Department,
  ProjectFormData,
  User,
  ApiProject,
  ProjectFormProps,
} from '@/types/projects';

const statuses: ProjectFormProps['statuses'] = [
  'processing',
  'active',
  'on-hold',
  'completed',
  'cancelled',
];

const statusMap: Record<string, string> = {
  processing: 'PROCRESSING',
  active: 'ACTIVE',
  'on-hold': 'ON_HOLD',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
};

export default function AddProjectPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: departmentsData,
    isLoading: isDepartmentsLoading,
    error: departmentsError,
  } = useDepartmentsQuery();

  const { departments, departmentIdMap } = useMemo(() => {
    if (!departmentsData) return { departments: [], departmentIdMap: {} };

    const departments: string[] = departmentsData.map((dept: Department) => dept.name);
    const departmentIdMap: Record<string, number> = {};

    departmentsData.forEach((dept: Department) => {
      departmentIdMap[dept.name] = dept.id;
    });

    return { departments, departmentIdMap };
  }, [departmentsData]);

  const transformFormDataToPayload = (
    formData: ProjectFormData,
    userAssignments: { userId: number; role: string }[]
  ) => {

  const normalizedStatus = formData.status.toLowerCase();

    const payload = {
      name: formData.name,
      client: formData.clientName,
      budget: formData.budget,
      deadline: new Date(formData.deadline).toISOString(),
      departmentId: departmentIdMap[formData.department] || 1,
      description: formData.description,
      status: statusMap[normalizedStatus] || 'ACTIVE',
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      userAssignments,
    };

    return payload;
  };

  const handleSubmit: ProjectFormProps['onSubmit'] = async (
    formData,
    userAssignments
  ) => {
    setIsSubmitting(true);

    try {


      const payload = transformFormDataToPayload(formData, userAssignments);
      
      console.log('Sending payload to API:', JSON.stringify(payload, null, 2));
      
      const result = await createProject(payload);
      
      console.log('Project created successfully:', result);

      await queryClient.invalidateQueries({ queryKey: ['projects'] });

      toast.success('Project created successfully');
      router.push('/projects');
    } catch (error: any) {
      console.error('Error creating project:', error);
      
      
      let errorMessage = 'Failed to create project';
      
      if (error?.response?.status === 400) {
        errorMessage = 'Invalid project data. Please check all fields.';
      } else if (error?.response?.status === 422) {
        errorMessage = 'Validation failed. Please check the status and other fields.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/projects');
  };

  if (isDepartmentsLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <BreadcrumbNavigation />
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Loading departments...</div>
        </div>
      </div>
    );
  }

  if (departmentsError) {
    return (
      <div className="space-y-4 md:space-y-6">
        <BreadcrumbNavigation />
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500">Failed to load departments. Please try again.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <BreadcrumbNavigation />
      <ProjectForm
        departments={departments}
        statuses={statuses}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitButtonText="Create Project"
        title="Project Information"
      />
    </div>
  );
}